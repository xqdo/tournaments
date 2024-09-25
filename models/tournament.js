import { db } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Tournament = db.define(
    "tournament",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(260),
            allowNull: true
        },
        streamLink: {
            type: DataTypes.STRING,
            allowNull: true
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        portraitBG: {
            type: DataTypes.STRING,
            allowNull: true
        },
        game: {
            type: DataTypes.INTEGER,
            references: {
                model: "game",
                key: "id"
            },
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        RegisterationStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        RegisterationEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        RequireRegisteration: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        RegisterationForm: {
            type: DataTypes.JSON,
            allowNull: true
        },
        RulesFile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        RulesDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        MaxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        MinParticipants: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TeamSize: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        QualifyingType: {
            type: DataTypes.ENUM,
            values: ['random', 'first registered', 'manual'],

        },
        Format: {
            type: DataTypes.ENUM,
            values: ["SE", "DE", "RR", "SW", "BR"],
            allowNull: false
        },
        MatchDuration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // AutoCompleteMatches:{
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        RequireResultsAttachment: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        RequireCheckIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        CheckInTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TotalPrizePool: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        PrizeLine: {
            type: DataTypes.JSON,
            allowNull: true
        },
        Private: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        CountryOfTheTournament: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ParticipantAccessResults: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        SponsorName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SponsorLogo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SponsorCountry: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SponsorWebsite: {
            type: DataTypes.STRING,
            allowNull: true
        },
        RechedBy: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Shares: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        InviteLink: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Bracket: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        Participants: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        creator: {
            type: DataTypes.BIGINT,
            references: {
                model: "user",
                key: "id"
            },
            allowNull: false
        },
        orginizers: {
            type: DataTypes.JSON,
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
)


Tournament.sync().then().catch((err) => console.log(err))
export { Tournament }