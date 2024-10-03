import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";

export default async function JoinTeam(req, res) {
    try {
        const { name } = req.body;  // Team name from request
        const { user } = req;       // User from the request (assuming it's populated via auth middleware)

      

        // Find the team by name
        const team = await Team.findOne({ where: { name } });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        console.log(user.username)
        // Find the user in the database by username
        const foundUser = await User.findOne({
            where: { username: user.username },
            attributes: ['id', 'username', 'team']  // Only select necessary fields
        });

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already in a team
        if (foundUser.team) {
            return res.status(400).json({ message: 'User is already a member of another team' });
        }

        // Check if the user is already a member of the current team
        const memberExists = team.members && team.members.some(member => member.id === foundUser.id);
        if (memberExists) {
            return res.status(400).json({ message: 'User is already a member of this team' });
        }

        // Add the user as a new member
        const newMember = {
            id: foundUser.id,
            role: 'Member',
            joinedAt: new Date().toISOString()  // Capture join time
        };

        // Update the team's member list with the new member
        const updatedMembers = [...team.members, newMember];
        await team.update({ members: updatedMembers });

        // Assign the team ID to the user and save the user
        foundUser.team = team.id;
        await foundUser.save();

        // Return success response
        res.status(200).json({ message: 'Member added successfully' });
        
    } catch (error) {
        // Log the error and return a 500 status
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Error adding member', error });
    }
}
