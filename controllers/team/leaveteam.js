import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";

export default function leaveTeam(req, res)
{
    const { teamName } = req.body;  // Expecting the username and the team name

    // Find the team by its name
    Team.findOne({ where: { name: teamName } })
        .then((team) =>
        {
            if (!team)
            {
                return res.status(404).json({ message: 'Team not found' });
            }

            // Find the user by their username
            return User.findOne({ where: { username: req.user.username } })
                .then((user) =>
                {
                    if (!user)
                    {
                        return res.status(404).json({ message: 'User not found' });
                    }

                    // Check if the user is a member of the team
                    const isMember = team.members.some(member => member.id === user.id);
                    if (!isMember)
                    {
                        return res.status(400).json({ message: 'User is not a member of the team' });
                    }

                    // Check if the user is the leader
                    const isLeader = team.members.some(member => member.id === user.id && member.role === 'Leader');

                    // Remove the user from the members array
                    const updatedMembers = team.members.filter(member => member.id !== user.id);

                    // If the user is the leader, promote the oldest member as the new leader
                    if (isLeader)
                    {
                        // Sort members by joinedAt timestamp to find the oldest member
                        const sortedMembers = updatedMembers.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));

                        // Promote the oldest member if there are remaining members
                        if (sortedMembers.length > 0)
                        {
                            sortedMembers[0].role = 'Leader';  // Promote the oldest member to Leader
                        }
                    }

                    // Clear the user's team reference
                    user.team = null;

                    // Check if members are empty after removal
                    if (updatedMembers.length === 0)
                    {
                        // If no members left, delete the team
                        return team.destroy().then(() =>
                        {
                            res.status(200).json({ message: 'Team has been deleted as it is now empty' });
                        });
                    }

                    // Update the team with the new members list and save the user
                    return Promise.all([team.update({ members: updatedMembers }), user.save()])
                        .then(() =>
                        {
                            res.status(200).json({ message: 'User has successfully left the team' });
                        });
                });
        })
        .catch((error) =>
        {
            console.error('Error leaving the team:', error);  // Log the error for debugging
            res.status(500).json({ message: 'Error leaving the team', error });
        });
}
