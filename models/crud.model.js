import { pool } from "../database/connection.js";
import bcrypt from 'bcrypt';
import isValidEmail from "../helpers/isValidEmail.js";
import isValidName from "../helpers/isValidName.js";
import isValidUsername from "../helpers/isValidUsername.js";

const getUsers = async () => {
    return await pool.query('SELECT * FROM "user"');
};

const getByID = async (id) => {
    return (await pool.query(`SELECT * FROM "user" WHERE id_user = ${id}`)).rows[0];
}

const createUser = async (username, name, last_name, phone, password, verification_code, email) => {

    if(!isValidUsername(username) || !isValidName(name) || !isValidName(last_name) || !isValidEmail(email)){
        if(!isValidUsername(username)) console.log("Invalid username");
        if(!isValidName(name)) console.log("Invalid name");
        if(!isValidName(last_name)) console.log("Invalid last name");
        if(!isValidEmail(email)) console.log("Invalid email");

        return {};
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO "user" (username, name, last_name, phone, password, verification_code, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    const countUsername = parseInt((await pool.query('SELECT COUNT(*) FROM "user" WHERE username = $1', [username])).rows[0].count);
    const countPhone = parseInt((await pool.query('SELECT COUNT (*) FROM "user" WHERE phone = $1', [phone])).rows[0].count);

    //console.log(countUsername + "   " + countPhone);

    if(countUsername === 0 && countPhone === 0){
        const { rows } = await pool.query(query, [username, name, last_name, phone, hashedPassword, verification_code, email]);
        console.log("Insert user done");
        return rows[0];
    }

    else{
        if(countUsername > 0) console.log("Username already taken");
        if(countPhone > 0) console.log("Phone number already taken");
        return {};
    }
}

const deleteUser = async (username) => {
    const query = 'DELETE FROM "user" WHERE username = $1 RETURNING *';

    return await pool.query(query, [username]);
}

const updateUser = async (username, name, last_name, phone, password, verification_code, email) => {
    const countPhone = (await pool.query('SELECT COUNT (*) FROM "user" WHERE username NOT LIKE $1 AND phone = $2', [username, phone])).rows[0].count;

    if(countPhone > 0){
        console.log("Phone number already taken");
        return {};
    }
    else{
        const query = 'UPDATE "user" SET name = $1, last_name = $2, phone = $3, password = $4, verification_code = $5, email = $6 WHERE username = $7 RETURNING *';

        const hashedPassword = await bcrypt.hash(password, 10);

        return (await pool.query(query, [name, last_name, phone, hashedPassword, verification_code, email, username])).rows[0];
    }
}

export const crudModel = {
    getUsers,
    createUser,
    deleteUser,
    getByID,
    updateUser,
};