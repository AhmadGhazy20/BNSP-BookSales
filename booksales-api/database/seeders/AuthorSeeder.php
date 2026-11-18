<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        Author::where('name', 'Andrea Hirata Updated')
            ->update(['name' => 'Andrea Hirata']);

        $authors = [
            [
                'name' => 'Andrea Hirata',
                'bio' => 'Penulis novel Laskar Pelangi.',
                'photo' => 'andrea-hirata.jpg',
            ],
            [
                'name' => 'Tere Liye',
                'bio' => 'Penulis novel Indonesia.',
                'photo' => 'tere-liye.jpg',
            ],
            [
                'name' => 'Dee Lestari',
                'bio' => 'Penulis novel dan penyanyi Indonesia.',
                'photo' => 'dee-lestari.jpg',
            ],
            [
                'name' => 'J.K. Rowling',
                'bio' => 'Penulis seri Harry Potter.',
                'photo' => 'jk-rowling.jpg',
            ],
            [
                'name' => 'Raditya Dika',
                'bio' => 'Penulis dan komedian Indonesia.',
                'photo' => 'raditya-dika.jpg',
            ],
        ];

        foreach ($authors as $author) {
            Author::updateOrCreate(
                ['name' => $author['name']],
                $author
            );
        }
    }
}
