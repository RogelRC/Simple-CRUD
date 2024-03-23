import { pool } from "../database/connection.js";
import bcrypt from 'bcrypt';
import isValidEmail from "../helpers/isValidEmail.js";
import isValidName from "../helpers/isValidName.js";
import isValidUsername from "../helpers/isValidUsername.js";
import isValidPhone from "../helpers/isValidPhone.js";

const getUsers = async () => {
    return await pool.query('SELECT * FROM "user"');
};

const getByID = async (id) => {
    return (await pool.query(`SELECT * FROM "user" WHERE id_user = ${id}`)).rows[0];
}

const createUser = async (username, name, last_name, phone, password, email) => {

    if(!isValidUsername(username) || !isValidName(name) || !isValidName(last_name) || !isValidEmail(email) || !isValidPhone(phone)){
        if(!isValidUsername(username)) console.log("Invalid username");
        if(!isValidName(name)) console.log("Invalid name");
        if(!isValidName(last_name)) console.log("Invalid last name");
        if(!isValidEmail(email)) console.log("Invalid email");
        if(!isValidPhone(phone)) console.log("Invalid phone");

        return {};
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO "user" (username, name, last_name, phone, password, verification_code, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    //estas condiciones tengo que arreglarlas
    const countUsername = parseInt((await pool.query('SELECT COUNT(*) FROM "user" WHERE username = $1', [username])).rows[0].count);
    const countPhone = parseInt((await pool.query('SELECT COUNT (*) FROM "user" WHERE phone = $1', [phone])).rows[0].count);
    const countEmail = parseInt((await pool.query('SELECT COUNT (*) FROM "user" WHERE email = $1', [email])).rows[0].count);

    //console.log(countUsername + "   " + countPhone);

    if(countUsername === 0 && countPhone === 0 && countEmail === 0){
        const { rows } = await pool.query(query, [username, name, last_name, phone, hashedPassword, parseInt(Math.random() * 10000000), email]);
        console.log("Insert user done");
        return rows[0];
    }

    else{
        if(countUsername > 0) console.log("Username already taken");
        if(countPhone > 0) console.log("Phone number already taken");
        if(countEmail > 0) console.log("Email already taken");
        return {};
    }
}

const deleteUser = async (username) => {
    const query = 'DELETE FROM "user" WHERE username = $1 RETURNING *';

    return await pool.query(query, [username]);
}

const updateUser = async (id, username, password) => {

    if(username){
        const countUsername = parseInt((await pool.query('SELECT COUNT(*) FROM "user" WHERE username = $1', [username])).rows[0].count);

        if(countUsername === 0){
            await pool.query('UPDATE "user" SET username = $1 WHERE id_user = $2', [username, id]);
            console.log("User updated");
        }
        else{
            console.log("Username already taken");
        }
    }
    if(password){
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query('UPDATE "user" SET password = $1 WHERE id_user = $2 RETURNING *', [hashedPassword, id]);
    }

    return await pool.query('SELECT * FROM "user" WHERE id_user = $1', [id]);
}

export const crudModel = {
    getUsers,
    createUser,
    deleteUser,
    getByID,
    updateUser,
};