<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with(['author', 'genre']);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($subQuery) use ($search) {
                $subQuery
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('author', function ($authorQuery) use ($search) {
                        $authorQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('genre', function ($genreQuery) use ($search) {
                        $genreQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('genre_id')) {
            $query->where('genre_id', $request->input('genre_id'));
        }

        $books = $query->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data buku',
            'data' => $books,
        ], 200);
    }

    public function show($id)
    {
        $book = Book::with(['author', 'genre'])->find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil detail buku',
            'data' => $book,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cover' => 'nullable|string|max:255',
            'author_id' => 'nullable|exists:authors,id',
            'genre_id' => 'nullable|exists:genres,id',
        ]);

        $book = Book::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil ditambahkan',
            'data' => $book->load(['author', 'genre']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'cover' => 'sometimes|nullable|string|max:255',
            'author_id' => 'sometimes|nullable|exists:authors,id',
            'genre_id' => 'sometimes|nullable|exists:genres,id',
        ]);

        $book->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diperbarui',
            'data' => $book->load(['author', 'genre']),
        ], 200);
    }

    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
            ], 404);
        }

        if ($book->transactions()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak dapat dihapus karena sudah memiliki transaksi',
            ], 422);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dihapus',
        ], 200);
    }
}
