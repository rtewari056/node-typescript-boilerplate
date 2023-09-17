import { RowDataPacket } from "mysql2/promise";

// Database connection
import connection from "../config/db.config.js";

type User = { name: string, email: string, password: string };

const execute = async (sql: string, params?: (string | number)[]): Promise<RowDataPacket[]> => { 
    const [results] = (params) ? await connection.query<RowDataPacket[]>(sql, params) : await connection.query<RowDataPacket[]>(sql);
    return results;
}

const getUserByEmail = async (email: string): Promise<RowDataPacket> => { 
    const [[results]] = await connection.query<RowDataPacket[]>('SELECT * FROM user WHERE LOWER(user.email) = LOWER(`email`) LIMIT 1;', [email]);
    return results;
}

const createUser = async (user: User): Promise<RowDataPacket[]> => { 
    const [results] = await connection.query<RowDataPacket[]>('INSERT INTO user (`name`,`email`,`password`) VALUES (?, ?, ?);', [user.name, user.email, user.password]);
    return results;
}

const getUserBySessionToken = async (sessionToken: string): Promise<RowDataPacket[]> => { 
    const [results] = await connection.query<RowDataPacket[]>('SELECT * FROM user WHERE user.token = ? LIMIT 1;', [sessionToken]);
    return results;
}

const deleteUser = async(email: string): Promise<RowDataPacket[]> => {
    const [results] = await connection.query<RowDataPacket[]>('DELETE FROM user WHERE user.email = ?;', [email]);
    return results;
}

export { execute, getUserByEmail, createUser, getUserBySessionToken, deleteUser }