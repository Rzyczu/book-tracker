export type Book = {
    id: number;
    title: string;
    author: string;
    read: boolean;
};

export type BookRow = {
    id: number;
    title: string;
    author: string;
    read: 0 | 1;
};
