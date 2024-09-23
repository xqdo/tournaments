import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";

export default function JoinTeam(req, res)
{
    const { name } = req.body;  // Expecting a single username for the new member
    let team;  // Declare team variable in outer scope

    // Find the team by name
    Team.findOne({ where: { name } })
        .then((foundTeam) =>
        {
            if (!foundTeam)
            {
                return res.status(404).json({ message: 'Team not found' });
            }
            team = foundTeam;  // Assign found team to the outer variable

            // Find the user by username
            return User.findOne({
                where: { username: req.user.username },
                attributes: ['id', 'username', 'team']  // Select only the 'id' and 'username'
            });
        })
        .then((user) =>
        {
            if (!user)
            {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the user is already a member of the team
            const memberExists = team.members && team.members.some(member => member.id === user.id);
            if (memberExists)
            {
                return res.status(400).json({ message: 'User is already a member of this team' });
            }

            if (user.team)
            {
                return res.status(400).json({ message: 'User is already a member of another team' });
            }

            // Prepare the new member object with role and joinedAt timestamp
            const newMember = {
                id: user.id,
                role: 'Member',  // Set the role of the new user
                joinedAt: new Date().toISOString()  // Add the current time when the user joins
            };

            // Combine existing members with the new member
            const updatedMembers = [...team.members.filter(member => member.id !== user.id), newMember];

            // Update the team with the new member
            return team.update({ members: updatedMembers })
                .then(() =>
                {
                    // Update the user's team reference
                    user.team = team.id;
                    return user.save();  // Save the updated user
                });
        })
        .then(() =>
        {
            res.status(200).json({ message: 'Member added successfully' });
        })
        .catch((error) =>
        {
            console.error('Error adding member:', error);  // Log the error for debugging
            res.status(500).json({ message: 'Error adding member', error });
        });
}
