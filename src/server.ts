import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';

// Database connection
import connection from "./config/db.config.js";

// Config environment variables
dotenv.config({ path: path.resolve(process.cwd(), 'src/config/.env.local') });

const server: Express = express();
server.use(express.json()); // Accept JSON data
const PORT: string | undefined = process.env.PORT || '5000';

server.use(cors({ credentials: true })); // Enable CORS
server.use(compression()); // Compress responses
server.use(cookieParser()); // Parse cookies

server.get('/', (req: Request, res: Response) => {
    res.send('<h1>HELLO FROM Express + TypeScript</h1>')
});

server.get('/api/data', async (req: Request, res: Response) => {
    const [data] = await connection.query("SELECT * FROM test.User");
    res.json(data)
});

server.listen(PORT, () => {
    console.log(`⚡️ Server is running at http://localhost:${PORT}`);
})