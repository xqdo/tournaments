import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const router = express.Router();

const db = new Sequelize('main', 'root', '1122', {
    host: 'localhost',
    dialect: 'mysql'
});

router.use(express.json())

// Define the USER MODEL

// THE CRUD API
// DON'T USE JUST '/' ROUTES 
//GET
router.get('/all', (req, res) =>
{
    res.status(200).send("hello yousef");
})
router.get('/', (req, res) =>
{
    res.status(200).send("not yet implemented");
})
router.get('/:id', (req, res) =>
{
    const { id } = req.params
    res.status(200).send("not yet implemented " + id);
})
//POST

router.post("/login", (req, res) =>
{
    const { username, password } = req.body
    res.status(200).send("not yet implemented");
})

router.post("/login", (req, res) =>
{
    const { username, password } = req.body
    res.status(200).send("not yet implemented");
})

//PATCH

//DELETE

//DO NOT CHANGE THIS 
export default router
