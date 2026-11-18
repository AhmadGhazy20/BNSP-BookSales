<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class PaymentController extends Controller
{
    public function show(Request $request, $orderNumber)
    {
        $transactions = $this->getOrderTransactions($orderNumber, $request->user()->id);

        if ($transactions->isEmpty()) {
            return $this->notFound();
        }

        return response()->json([
            'success' => true,
            'data' => $this->buildSummary($transactions),
        ]);
    }

    public function create(Request $request, $orderNumber)
    {
        $transactions = $this->getOrderTransactions($orderNumber, $request->user()->id);

        if ($transactions->isEmpty()) {
            return $this->notFound();
        }

        if ($this->isPaid($transactions)) {
            return response()->json([
                'success' => true,
                'message' => 'Pesanan sudah dibayar',
                'data' => array_merge($this->buildSummary($transactions), [
                    'mode' => 'paid',
                ]),
            ]);
        }

        $serverKey = $this->serverKey();

        if (!$serverKey) {
            return response()->json([
                'success' => true,
                'message' => 'Midtrans belum dikonfigurasi. Pembayaran akan memakai mode simulasi.',
                'data' => array_merge($this->buildSummary($transactions), [
                    'mode' => 'simulation',
                ]),
            ]);
        }

        $payload = [
            'transaction_details' => [
                'order_id' => $orderNumber,
                'gross_amount' => (int) round($transactions->sum('total_amount')),
            ],
            'item_details' => $transactions->map(function ($transaction) {
                $price = $transaction->quantity > 0
                    ? (int) round($transaction->total_amount / $transaction->quantity)
                    : (int) round($transaction->total_amount);

                return [
                    'id' => (string) $transaction->book_id,
                    'price' => $price,
                    'quantity' => (int) $transaction->quantity,
                    'name' => Str::limit($transaction->book?->title ?? 'Buku', 50),
                ];
            })->values()->all(),
            'customer_details' => [
                'first_name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
            'callbacks' => [
                'finish' => rtrim(config('services.frontend_url'), '/')
                    . "/payment/{$orderNumber}",
            ],
        ];

        try {
            $response = Http::withBasicAuth($serverKey, '')
                ->acceptJson()
                ->post(config('services.midtrans.snap_url'), $payload);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi Midtrans.',
            ], 502);
        }

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat transaksi pembayaran.',
                'detail' => $response->json(),
            ], 502);
        }

        $payment = $response->json();
        $redirectUrl = $payment['redirect_url'] ?? null;

        foreach ($transactions as $transaction) {
            $transaction->update([
                'payment_status' => 'pending',
                'payment_method' => 'midtrans',
                'payment_reference' => null,
                'payment_url' => $redirectUrl,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi pembayaran berhasil dibuat',
            'data' => array_merge($this->buildSummary($transactions->fresh('book')), [
                'mode' => 'midtrans',
                'redirect_url' => $redirectUrl,
                'token' => $payment['token'] ?? null,
            ]),
        ]);
    }

    public function simulate(Request $request, $orderNumber)
    {
        if ($this->serverKey() && !app()->environment('local')) {
            return response()->json([
                'success' => false,
                'message' => 'Simulasi pembayaran hanya tersedia pada mode lokal.',
            ], 403);
        }

        $transactions = $this->getOrderTransactions($orderNumber, $request->user()->id);

        if ($transactions->isEmpty()) {
            return $this->notFound();
        }

        $reference = 'SIM-' . strtoupper(Str::random(10));

        foreach ($transactions as $transaction) {
            $transaction->update([
                'payment_status' => 'paid',
                'payment_method' => 'simulation',
                'payment_reference' => $reference,
                'payment_url' => null,
                'paid_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran simulasi berhasil',
            'data' => $this->buildSummary($transactions->fresh('book')),
        ]);
    }

    public function sync(Request $request, $orderNumber)
    {
        $transactions = $this->getOrderTransactions($orderNumber, $request->user()->id);

        if ($transactions->isEmpty()) {
            return $this->notFound();
        }

        $serverKey = $this->serverKey();

        if (!$serverKey) {
            return response()->json([
                'success' => false,
                'message' => 'Midtrans belum dikonfigurasi.',
            ], 400);
        }

        try {
            $response = Http::withBasicAuth($serverKey, '')
                ->acceptJson()
                ->get(config('services.midtrans.api_url') . "/{$orderNumber}/status");
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi Midtrans.',
            ], 502);
        }

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil status pembayaran.',
                'detail' => $response->json(),
            ], 502);
        }

        $this->applyMidtransStatus($transactions, $response->json());

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran diperbarui',
            'data' => $this->buildSummary($transactions->fresh('book')),
        ]);
    }

    public function notification(Request $request)
    {
        $serverKey = $this->serverKey();

        if (!$serverKey) {
            return response()->json([
                'success' => false,
                'message' => 'Midtrans belum dikonfigurasi.',
            ], 403);
        }

        $payload = $request->all();
        $orderNumber = $payload['order_id'] ?? null;

        if (!$orderNumber) {
            return response()->json([
                'success' => false,
                'message' => 'Order ID tidak ditemukan pada notifikasi.',
            ], 422);
        }

        $signature = hash(
            'sha512',
            $orderNumber
            . ($payload['status_code'] ?? '')
            . ($payload['gross_amount'] ?? '')
            . $serverKey
        );

        if (!hash_equals($signature, (string) ($payload['signature_key'] ?? ''))) {
            return response()->json([
                'success' => false,
                'message' => 'Signature notifikasi tidak valid.',
            ], 403);
        }

        $transactions = Transaction::with('book')
            ->where('order_number', $orderNumber)
            ->get();

        if ($transactions->isEmpty()) {
            return $this->notFound();
        }

        $this->applyMidtransStatus($transactions, $payload);

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi pembayaran berhasil diproses',
        ]);
    }

    private function getOrderTransactions($orderNumber, $customerId)
    {
        return Transaction::with('book')
            ->where('order_number', $orderNumber)
            ->where('customer_id', $customerId)
            ->get();
    }

    private function buildSummary($transactions)
    {
        $statuses = $transactions->pluck('payment_status');
        $paymentStatus = 'pending';

        if ($statuses->every(fn ($status) => $status === 'paid')) {
            $paymentStatus = 'paid';
        } elseif ($statuses->contains(fn ($status) => in_array($status, ['failed', 'cancelled', 'expired'], true))) {
            $paymentStatus = 'failed';
        }

        $first = $transactions->first();

        return [
            'order_number' => $first->order_number,
            'total_amount' => (float) $transactions->sum('total_amount'),
            'payment_status' => $paymentStatus,
            'payment_method' => $first->payment_method,
            'payment_reference' => $first->payment_reference,
            'paid_at' => $first->paid_at,
            'items' => $transactions->map(fn ($transaction) => [
                'id' => $transaction->id,
                'book_id' => $transaction->book_id,
                'title' => $transaction->book?->title ?? 'Buku',
                'quantity' => (int) $transaction->quantity,
                'total_amount' => (float) $transaction->total_amount,
            ])->values()->all(),
        ];
    }

    private function applyMidtransStatus($transactions, $payload)
    {
        $transactionStatus = $payload['transaction_status'] ?? 'pending';
        $fraudStatus = $payload['fraud_status'] ?? null;

        if ($transactionStatus === 'capture' && $fraudStatus === 'challenge') {
            $paymentStatus = 'pending';
        } elseif (in_array($transactionStatus, ['capture', 'settlement'], true)) {
            $paymentStatus = 'paid';
        } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'], true)) {
            $paymentStatus = 'failed';
        } else {
            $paymentStatus = 'pending';
        }

        foreach ($transactions as $transaction) {
            $transaction->update([
                'payment_status' => $paymentStatus,
                'payment_method' => $payload['payment_type'] ?? 'midtrans',
                'payment_reference' => $payload['transaction_id'] ?? null,
                'paid_at' => $paymentStatus === 'paid' ? now() : null,
            ]);
        }
    }

    private function serverKey()
    {
        return config('services.midtrans.server_key') ?: null;
    }

    private function isPaid($transactions)
    {
        return $transactions->every(
            fn ($transaction) => $transaction->payment_status === 'paid'
        );
    }

    private function notFound()
    {
        return response()->json([
            'success' => false,
            'message' => 'Pesanan tidak ditemukan.',
        ], 404);
    }
}
