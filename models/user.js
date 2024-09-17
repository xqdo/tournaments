import { Sequelize, DataTypes } from 'sequelize';

const db = new Sequelize('main', 'root', '1122', {
    host: 'localhost',
    dialect: 'mysql'
});

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