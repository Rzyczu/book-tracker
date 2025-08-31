export class NotFoundError extends Error {
    status = 404 as const;
    constructor(message = 'Not Found') { super(message); }
}

export class BadRequestError extends Error {
    status = 400 as const;
    constructor(message = 'Bad Request') { super(message); }
}
