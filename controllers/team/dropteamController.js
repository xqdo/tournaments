import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";

export default function dropTeam(req, res) {
    const { username, teamName } = req.body;  // Expecting the team name and username of the requestor

    // Find the team by name
    Team.findOne({ where: { name: teamName } })
        .then((team) => {
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }

            // Fetch the user who requested to drop the team
            return User.findOne({ where: { username } })
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }

                    // Check if the user is the leader of the team
                    const leader = team.members.find(member => member.id === user.id && member.role === 'Leader');
                    if (!leader) {
                        return res.status(403).json({ message: 'Only the team leader can drop the team' });
                    }

                    // Update the user's team to null
                    user.team = null;
                    return user.save(); // Save the user first
                })
                .then(() => {
                    // Now drop (delete) the team
                    return team.destroy();
                })
                .then(() => {
                    res.status(200).json({ message: 'Team dropped successfully' });
                });
        })
        .catch((error) => {
            console.error('Error dropping team:', error);  // Log the error for debugging
            res.status(500).json({ message: 'Error dropping team', error });
        });
}
