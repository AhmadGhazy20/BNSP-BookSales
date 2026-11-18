const coverCache = new Map();

const knownCovers = {
    'koala kumal':
        'https://perpustakaan.jakarta.go.id/catalog-dispusip/uploaded_files/sampul_koleksi/original/Monograf/85325.png',
};

export const getBookCover = async (book) => {
    const title = book?.title?.trim();

    if (!title) return null;

    const cacheKey = title.toLowerCase();

    // Cover Koala Kumal dari katalog Perpustakaan Jakarta
    if (knownCovers[cacheKey]) {
        return knownCovers[cacheKey];
    }

    if (coverCache.has(cacheKey)) {
        return coverCache.get(cacheKey);
    }

    try {
        const url =
            `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=20`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Gagal mencari cover buku.');
        }

        const data = await response.json();
        const results = data.docs || [];

        const exactMatch = results.find(
            (item) =>
                item.title?.toLowerCase() === cacheKey &&
                item.cover_i
        );

        const fallbackMatch = results.find(
            (item) => item.cover_i
        );

        const selectedBook = exactMatch || fallbackMatch;

        const image = selectedBook?.cover_i
            ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
            : null;

        coverCache.set(cacheKey, image);

        return image;
    } catch (error) {
        console.error('Gagal mengambil cover:', error);
        return null;
    }
};
