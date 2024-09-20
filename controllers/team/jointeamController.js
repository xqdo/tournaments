import { Team, teamMembers } from "../../models/team.js";
import { User } from "../../models/user.js";

export default async function joinTeam(req, res)
{
    const inviteLink = req.params.link; // Extract inviteLink from URL parameters
    const userId = req.user.user;

    try
    {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user)
        {
            return res.status(404).send("User not found");
        }

        // Find the team by invite link
        const team = await Team.findOne({ where: { inviteLink } });
        if (!team)
        {
            return res.status(404).send("Team not found");
        }

        // Check if the team is full
        const teamMembersList = await teamMembers.findAll({ where: { teamId: team.id } });
        if (teamMembersList.length >= 6)
        {
            return res.status(403).send("Team is full");
        }

        // Check if the user is already a member of the team
        const isMember = teamMembersList.some(member => member.userId === userId);
        if (isMember)
        {
            return res.status(403).send("User is already a member of this team");
        }

        // Check if the user is already a member of any team
        const existingMember = await teamMembers.findOne({ where: { userId } });
        if (existingMember)
        {
            return res.status(403).send("User is already a member of another team");
        }

        // Add the user to the team
        await teamMembers.create({ userId, teamId: team.id });
        return res.status(201).send("User added to team successfully");

    } catch (err)
    {
        console.error("Error joining team:", err);
        return res.status(500).send("Error joining team");
    }
}
