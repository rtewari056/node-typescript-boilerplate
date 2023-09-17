import crypto from 'crypto';
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

const SECRET: string = process.env.PASSWORD_SECRET || 'Node-TypeScript-API';

// Create random tokens
const random = (): string => crypto.randomBytes(128).toString('base64');

// Authentication util
const authentication = (salt: string, password: string): string => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

// Custom Error Handling by extending Error class
class ErrorResponse extends Error {
    statusCode: number;
    // It will take a "message" and "statusCode"
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
};

export { random, authentication, ErrorResponse }