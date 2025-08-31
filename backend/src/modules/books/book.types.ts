// Kształt domenowy (to zwracamy na zewnątrz API)
export type Book = {
    id: number;
    title: string;
    author: string;
    read: boolean;
};

// Kształt w bazie (read jako 0/1)
export type BookRow = {
    id: number;
    title: string;
    author: string;
    read: 0 | 1;
};
