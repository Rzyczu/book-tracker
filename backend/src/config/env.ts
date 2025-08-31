import 'dotenv/config';

export const env = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    DB_FILE: process.env.DB_FILE || './data/books.db',
};
