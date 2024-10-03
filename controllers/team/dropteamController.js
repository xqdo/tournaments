import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";

export default function dropTeam(req, res) {
    const { teamName } = req.params; // Expecting the team name from the request params
    const { user } = req; // Get the user from req.user

    // Check if the user exists in req.user
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Fetch the user from the database
    User.findByPk(user.user)
        .then(foundUser => {
            if (!foundUser) {
                return res.status(404).json({ message: "User not found in the database" });
            }

            // Find the team by name
            return Team.findOne({ where: { name: teamName } })
                .then(team => {
                    if (!team) {
                        return res.status(404).json({ message: "Team not found" });
                    }

                    // Check if the user is the leader of the team
                    const leader = team.members.find(member => member.id === foundUser.id && member.role === 'Leader');
                    if (!leader) {
                        return res.status(403).json({ message: "Only the team leader can drop the team" });
                    }

                    // Update the user's team to null
                    foundUser.team = null;
                    return foundUser.save(); // Save the user instance first
                })
                .then(() => {
                    // Now drop (delete) the team
                    return Team.destroy({ where: { name: teamName } });
                })
                .then(() => {
                    res.status(200).json({ message: "Team dropped successfully" });
                });
        })
        .catch(error => {
            console.error("Error dropping team:", error); // Log the error for debugging
            res.status(500).json({ message: "Error dropping team", error });
        });
}
