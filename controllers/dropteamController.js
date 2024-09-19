import { Team } from "../models/team.js";
import { User } from "../models/user.js";

export default function dropTeam(req, res)
{
    // Expecting the team name and username of the requestor
    const captinId = req.user.user
    // Find the team by name
    Team.findOne({ where: { teamCaptin: captinId } })
        .then((team) =>
        {
            if (!team)
            {
                return res.status(404).json({ message: 'Team not found' });
            }
            team.destroy()
        })
        .catch((error) =>
        {
            console.error('Error dropping team:', error);  // Log the error for debugging
            res.status(500).json({ message: 'Error dropping team', error });
        });
}