<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => 'Laskar Pelangi',
                'description' => 'Kisah perjuangan anak-anak Belitung.',
                'price' => 25000,
                'stock' => 10,
                'cover' => 'laskar-pelangi.jpg',
                'author' => 'Andrea Hirata',
                'genre' => 'Novel',
            ],
            [
                'title' => 'Bumi',
                'description' => 'Novel petualangan dunia paralel.',
                'price' => 90000,
                'stock' => 15,
                'cover' => 'bumi.jpg',
                'author' => 'Tere Liye',
                'genre' => 'Fantasi',
            ],
            [
                'title' => 'Filosofi Teras',
                'description' => 'Buku pengantar filsafat Stoisisme.',
                'price' => 75000,
                'stock' => 12,
                'cover' => 'filosofi-teras.jpg',
                'author' => 'Dee Lestari',
                'genre' => 'Filsafat',
            ],
            [
                'title' => 'Harry Potter',
                'description' => 'Kisah petualangan seorang penyihir muda.',
                'price' => 85000,
                'stock' => 8,
                'cover' => 'harry-potter.jpg',
                'author' => 'J.K. Rowling',
                'genre' => 'Fantasi',
            ],
            [
                'title' => 'Koala Kumal',
                'description' => 'Kumpulan cerita tentang cinta dan kehidupan.',
                'price' => 65000,
                'stock' => 10,
                'cover' => 'koala-kumal.jpg',
                'author' => 'Raditya Dika',
                'genre' => 'Komedi',
            ],
        ];

        foreach ($books as $data) {
            $author = Author::firstOrCreate(['name' => $data['author']]);
            $genre = Genre::firstOrCreate(['name' => $data['genre']]);

            $book = Book::firstOrCreate(
                ['title' => $data['title']],
                [
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'stock' => $data['stock'],
                    'cover' => $data['cover'],
                    'author_id' => $author->id,
                    'genre_id' => $genre->id,
                ]
            );

            $missingRelations = [];

            if (!$book->author_id) {
                $missingRelations['author_id'] = $author->id;
            }

            if (!$book->genre_id) {
                $missingRelations['genre_id'] = $genre->id;
            }

            if ($missingRelations) {
                $book->update($missingRelations);
            }
        }
    }
}
