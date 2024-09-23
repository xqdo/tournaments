import { Team } from "../../models/team.js";
export default function searchTeamsByName(req, res)
{
    const { teamName } = req.params;  // Expecting the team name in the URL parameters

    // Search for teams that have similar names (case-insensitive match)
    Team.findAll({
        where: {
            name: {
                teamName// Use LIKE for partial matching
            }
        },
    })
        .then((teams) =>
        {
            if (teams.length === 0)
            {
                return res.status(404).json({ message: 'No teams found with that name' });
            }

            // Send the list of teams as the response
            res.status(200).json({
                message: 'Teams found',
                teams
            });
        })
        .catch((err) =>
        {
            console.error("Error searching for teams:", err);
            res.status(500).json({ message: 'Error searching for teams' });
        });
}
