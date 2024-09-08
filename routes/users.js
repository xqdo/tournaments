import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const router = express.Router();

const db = new Sequelize('main', 'root', '1122', {
    host: 'localhost',
    dialect: 'mysql'
});

router.use(express.json())

// Define the USER MODEL
export const User = db.define('user', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    o_provider: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    o_access: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    o_refresh: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    o_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, { freezeTableName: true, updatedAt: false });

User.sync().then(() =>
{
    console.log('User table created successfully');
})
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

router.post("/register", (req, res) =>
{
    const { username, password, email, o_provider, o_access, o_refresh, o_id, bio, name, profileImage } = req.body
    const id = 10001000
    User.create({ id: id, username: username, password: password, email: email, o_provider: o_provider, o_access: o_access, o_refresh: o_refresh, o_id: o_id, bio: bio, name: name, profileImage: profileImage })
    res.status(201).send("user created successfully");
})

//PATCH

//DELETE

//DO NOT CHANGE THIS 
export default router
