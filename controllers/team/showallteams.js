import { db } from '../../config/database.js'; // Adjust the import based on your file structure

export default function getAllTeams(req, res) {
    const sql = `
        SELECT 
            id, 
            name, 
            inviteLink, 
            tournametsHistory, 
            teamLogo, 
            members, 
            teamDescription, 
            teamCover 
        FROM team
    `;

    db.query(sql, { type: db.QueryTypes.SELECT })
        .then((teams) => {
            res.status(200).json({
                message: 'Teams found',
                teams
            });
        })
        .catch((err) => {
            console.error("Error fetching teams:", err);
            res.status(500).json({ message: 'Error fetching teams' });
        });
}
