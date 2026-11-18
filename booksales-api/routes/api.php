<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Book: Read All dan Show bisa diakses publik
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);

// Author: Read All dan Show bisa diakses publik
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{author}', [AuthorController::class, 'show']);

// Genre: Read All dan Show bisa diakses publik
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/genres/{genre}', [GenreController::class, 'show']);

// Pesan ke admin bisa dikirim oleh user maupun tamu
Route::post('/messages', [MessageController::class, 'store']);

// Notifikasi pembayaran Midtrans
Route::post('/payments/notification', [PaymentController::class, 'notification']);

// CRUD Author dan Genre hanya untuk admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/authors', [AuthorController::class, 'store']);
    Route::put('/authors/{author}', [AuthorController::class, 'update']);
    Route::patch('/authors/{author}', [AuthorController::class, 'update']);
    Route::delete('/authors/{author}', [AuthorController::class, 'destroy']);

    Route::post('/genres', [GenreController::class, 'store']);
    Route::put('/genres/{genre}', [GenreController::class, 'update']);
    Route::patch('/genres/{genre}', [GenreController::class, 'update']);
    Route::delete('/genres/{genre}', [GenreController::class, 'destroy']);

    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::patch('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'index']);

    Route::get('/messages', [MessageController::class, 'index']);
    Route::patch('/messages/{id}/read', [MessageController::class, 'markAsRead']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);
});

// Transaction: Create, Update, Show hanya untuk customer
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::post('/checkout', [TransactionController::class, 'checkout']);
    Route::get('/payments/{orderNumber}', [PaymentController::class, 'show']);
    Route::post('/payments/{orderNumber}/pay', [PaymentController::class, 'create']);
    Route::post('/payments/{orderNumber}/simulate', [PaymentController::class, 'simulate']);
    Route::post('/payments/{orderNumber}/sync', [PaymentController::class, 'sync']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::patch('/transactions/{id}', [TransactionController::class, 'update']);
});

// Transaction: Read All dan Destroy hanya untuk admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
});
