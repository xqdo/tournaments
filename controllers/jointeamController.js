import { Team, teamMembers } from "../models/team.js";
import { User } from "../models/user.js";

export default function joinTeam(req, res)
{
    const inviteLink = req.params.link;  // Extract inviteLink from URL parameters
    const { username } = req.body

    // Check if the user exists
    User.findOne({ where: { username } })
        .then(user =>
        {
            if (!user)
            {
                return res.status(404).send("User not found");
            }

            // Find the team by invite link
            return Team.findOne({ where: { inviteLink } })
                .then(team =>
                {
                    if (!team)
                    {
                        return res.status(404).send("Team not found");
                    }

                    // Check if the user is already a member of the team
                    return teamMembers.findOne({ where: { userId: user.id } })
                        .then(existingMember =>
                        {
                            if (existingMember)
                            {
                                return res.status(400).send("User is already a member of a team");
                            }

                            // Add the user to the team
                            return teamMembers.create({
                                userId: user.id,
                                teamId: team.id
                            })
                                .then(() =>
                                {
                                    res.status(200).send("User added to team successfully");
                                });
                        });
                });
        })
        .catch(err =>
        {
            console.error("Error joining team:", err);
            res.status(500).send("Error joining team");
        });
}