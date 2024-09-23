import { db } from '../config/database.js';
import { DataTypes } from 'sequelize';


const Game = db.define(
    'game',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        gameName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        battleRoyale: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        solo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        teamSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        platforms: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        gameLogo: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
)

Game.sync().then().catch((err) => console.log(err))

export { Game };