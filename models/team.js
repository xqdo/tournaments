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
            allowNull: false
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
        teamCaptin: {
            type: DataTypes.BIGINT,
            references: {
                model: 'user',
                key: 'id'
            },
            allowNull: false
        }
    },

    {
        freezeTableName: true
    }
)

const teamMembers = db.define(
    'teamMembers',//table name
    {

        userId: {
            type: DataTypes.BIGINT,
            references: {
                model: 'user',
                key: 'id'
            },
            allowNull: false,
            unique: true
        },
        teamId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'team',
                key: 'id'
            },
            allowNull: false
        }
    },//columns
    {
        freezeTableName: true,
        updatedAt: false
    }//options 
);

db.sync().then().catch(err => console.log(err))
export { Team, teamMembers }