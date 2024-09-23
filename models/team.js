import { DataTypes } from 'sequelize';
import { db } from '../config/database.js';

const Team = db.define(
    'team',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true,
        },
        inviteLink: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        tournametsHistory: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        teamLogo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        members: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        teamDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        teamCover: {
            type: DataTypes.STRING,
            allowNull: true
        },


    },

    {
        freezeTableName: true
    }
)

Team.sync().then().catch(err => console.log(err))
export { Team }