import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";
export default function listTeamMembers(req, res)
{
    const { teamName } = req.params;  // Expecting team name in the URL parameters

    // Find the team by name
    Team.findOne({ where: { name: teamName } })
        .then((team) =>
        {
            if (!team)
            {
                return res.status(404).json({ message: 'Team not found' });
            }

            // Extract member IDs from the team
            const memberIds = team.members.map(member => member.id);

            // Find the user details for each member based on their ID
            User.findAll({
                where: { id: memberIds },  // Match all users with IDs from the members array
                attributes: ['username', "profileImage", "name"]  // Only select username and image fields
            })
                .then(users =>
                {
                    // Create a response array with member info (username and image)
                    const memberList = users.map((user, i) => ({
                        username: user.username,
                        name: user.name,
                        profileImage: user.profileImage,
                        role: team.members[i].role
                    }));

                    // Respond with the member list
                    res.status(200).json({ team: teamName, members: memberList });
                })
                .catch(err =>
                {
                    console.error('Error fetching user details:', err);
                    res.status(500).json({ message: 'Error fetching user details', error: err });
                });
        })
        .catch(err =>
        {
            console.error('Error finding team:', err);
            res.status(500).json({ message: 'Error finding team', error: err });
        });
}
