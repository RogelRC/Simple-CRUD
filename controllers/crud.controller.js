import { crudModel } from "../models/crud.model.js";


const getUsers = async (_, res) => {
    try{
        const { rows } = await crudModel.getUsers();
        res.json(rows);
    }
    catch(error){
        console.log(error);
    }
}

const getByID = async (req, res)=> {
    try{
        const {id} = req.body;

        const response = await crudModel.getByID(id);

        res.json(response);
    }
    catch(error){
        console.log(error);
    }
}

const createUser = async(req, res) => {
    try{
        const {username, name, last_name, phone, password, verification_code, email} = req.body;

        const response = await crudModel.createUser(username, name, last_name, phone, password, verification_code, email);

        if(response) res.json(response);
    }
    catch(error){
        console.log(error);
    }
}

const deleteUser = async(req, res) => {
    try{
        const { username } = req.body;

        const response = (await crudModel.deleteUser(username)).rows[0];

        res.json(response);
    }
    catch(error){
        console.log(error);
    }
}

const updateUser = async(req, res) => {
    try{
        const {username, name, last_name, phone, password, verification_code, email} = req.body;

        const response = (await crudModel.updateUser(username, name, last_name, phone, password, verification_code, email));

        res.json(response);
    }
    catch(error){
        console.log(error);
    }
}

export const crudController = {
    getUsers,
    createUser,
    deleteUser,
    getByID,
    updateUser,
};