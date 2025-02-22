import pool from "../config/db";

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT *  FROM users");
    return result.rows;
}

export const getUserById = async (id)