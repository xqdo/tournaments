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
        tournamentsOnThisGame: {
            type: DataTypes.JSON,
            defaultValue: []
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
)

db.sync().then().catch((err) => console.log(err))

export { Game };