import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env.local') });

const app: Express = express();
app.use(express.json()); // Accept JSON data
const PORT: string | undefined = process.env.PORT || '5000';

app.use(cors({
    credentials: true
}))

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>HELLO FROM Express + TypeScript</h1>')
});

app.listen(PORT, () => {
    console.log(`⚡️ Server is running at http://localhost:${PORT}`);
})