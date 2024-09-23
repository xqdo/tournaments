import { db } from '../../config/database.js';
import { Team } from '../../models/team.js';// Adjust the import based on your file structure

export default function getAllTeams(req, res)
{
    Team.findAll().then((teams) =>
    {
        res.status(200).json({
            message: 'Teams found',
            teams
        });
    }).catch((err) =>
    {
        console.error("Error fetching teams:", err);
        res.status(500).json({ message: 'Error fetching teams' });
    });
}
