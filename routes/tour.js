import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import auth from "../middlewares/authmw.js";

const router = express.Router();
const db = new Sequelize('main', 'root', '1122', {
    host: 'localhost',
    dialect: 'mysql'
});
router.use(express.json())
router.use(auth)
// Define the TOURNAMENT MODEL

// THE CRUD API
// DON'T USE JUST '/' ROUTES 
//POST
router.get('/', (req, res) =>
{
    res.send("worked")
})
//GET

//PUT

//PATCH

//DELETE

//DO NOT CHANGE THIS 
export default router
