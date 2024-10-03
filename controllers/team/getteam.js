import { Team } from "../../models/team.js";
import { Op } from 'sequelize';

export default function searchTeamsByName(req, res) {
    const { teamName } = req.params; // Expecting the team name in the URL parameters

    // Ensure teamName is sanitized and exists
    if (!teamName) {
        return res.status(400).json({ message: 'Team name is required' });
    }

    // Search for teams that have similar names (case-insensitive match)
    Team.findAll({
        where: {
            name: {
                [Op.like]: `%${teamName}%` // Use LIKE for partial matching with wildcards
            }
        },
    })
        .then((teams) => {
            if (teams.length === 0) {
                return res.status(404).json({ message: 'No teams found with that name' });
            }

            // Send the list of teams as the response
            res.status(200).json({
                message: 'Teams found',
                teams
            });
        })
        .catch((err) => {
            console.error("Error searching for teams:", err);
            res.status(500).json({ message: 'Error searching for teams' });
        });
}
