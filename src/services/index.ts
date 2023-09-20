import { RowDataPacket } from "mysql2/promise";

// Database connection
import connection from "../config/db.config";

type User = { name: string, email: string, salt: string, password: string, verificationCode: string };

const execute = async (sql: string, params?: (string | number)[]): Promise<RowDataPacket[]> => { 
    const [results] = (params) ? await connection.query<RowDataPacket[]>(sql, params) : await connection.query<RowDataPacket[]>(sql);
    return results;
}

const getUsers = async (limit: number = 100): Promise<RowDataPacket[]> => { 
    const [results] = await connection.query<RowDataPacket[]>('SELECT id, name, email, image, last_login FROM user LIMIT ?;', [limit]);
    return results;
}

const getUserByEmail = async (email: string): Promise<RowDataPacket> => { 
    const [[results]] = await connection.query<RowDataPacket[]>('SELECT * FROM user WHERE LOWER(user.email) = LOWER(?) LIMIT 1;', [email]);
    return results;
}

const createUser = async (user: User): Promise<RowDataPacket[]> => { 
    const [results] = await connection.query<RowDataPacket[]>('INSERT INTO user (`name`,`email`, `salt`, `password`, `verification_code`) VALUES (?, ?, ?, ?, ?);', [user.name, user.email, user.salt, user.password, user.verificationCode]);
    return results;
}

const getUserBySessionToken = async (sessionToken: string): Promise<RowDataPacket> => { 
    const [[results]] = await connection.query<RowDataPacket[]>('SELECT * FROM user WHERE user.session_token = ? LIMIT 1;', [sessionToken]);
    return results;
}

const deleteUser = async(email: string): Promise<RowDataPacket[]> => {
    const [results] = await connection.query<RowDataPacket[]>('DELETE FROM user WHERE user.email = ?;', [email]);
    return results;
}

const updateSessionToken = async(email: string, sessionToken: string): Promise<RowDataPacket[]> => {
    const [results] = await connection.query<RowDataPacket[]>('Update user SET user.session_token = ? WHERE user.email = ?;', [sessionToken, email]);
    return results;
}

const updateUserVerificationStatus = async (email: string, isVerified: boolean): Promise<void> => {
    await connection.query<RowDataPacket[]>('UPDATE user SET user.is_verified = ?, user.verification_code = NULL  WHERE user.email = ?;', [isVerified ? 1 : 0, email]);
}

export default { execute, getUsers, getUserByEmail, createUser, getUserBySessionToken, deleteUser, updateSessionToken, updateUserVerificationStatus };

// module.exports = { execute, getUserByEmail, createUser, getUserBySessionToken, deleteUser, updateSessionToken };