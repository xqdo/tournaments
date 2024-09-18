import { Sequelize, DataTypes } from 'sequelize';

export const db = new Sequelize('main', 'root', '1122', {
    host: 'localhost',
    dialect: 'mysql'
});