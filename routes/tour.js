import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const router = express.Router();
const db = new Sequelize('main', 'root', '1122', {
    host: 'localhost',
    dialect: 'mysql'
});
router.use(express.json())

// Define the TOURNAMENT MODEL

// THE CRUD API
// DON'T USE JUST '/' ROUTES 
//POST

//GET

//PUT

//PATCH

//DELETE

//DO NOT CHANGE THIS 
export default router
