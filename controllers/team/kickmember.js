import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";

export default function kickMember(req, res)
{
    const { teamName, memberUsername } = req.body;

    // Fetch the team by name
    Team.findOne({ where: { name: teamName } })
        .then(team =>
        {
            if (!team)
            {
                return res.status(404).send("Team not found");
            }

            // Fetch leader's ID
            return User.findOne({ where: { username: req.user.username } })
                .then(leader =>
                {
                    if (!leader)
                    {
                        return res.status(404).send("Leader not found");
                    }

                    // Check if the leader is authorized

                    team.members.map(member =>
                    {
                        if (member.role === 'leader' && member.id !== leader.id)
                        {
                            return res.status(403).send("You are not authorized to perform this action");
                        }
                    })

                    // Fetch member's ID
                    return User.findOne({ where: { username: memberUsername } })
                        .then(member =>
                        {
                            if (!member)
                            {
                                return res.status(404).send("Member not found");
                            }

                            // Check if the member to kick is in the team
                            const memberIndex = team.members.findIndex(m => m.id === member.id);
                            if (memberIndex === -1)
                            {
                                return res.status(404).send("Member not found in the team");
                            }

                            // Remove the member from the team
                            const updatedMembers = team.members.filter(m => m.id !== member.id);

                            // Update the team with the member removed
                            return team.update({ members: updatedMembers })
                                .then(() =>
                                {
                                    // Optionally clear the team reference for the user
                                    member.team = null;
                                    return member.save();
                                });
                        })
                        .then(() =>
                        {
                            res.status(200).send("Member kicked successfully");
                        });
                });
        })
        .catch(err =>
        {
            console.error("Error kicking member:", err);
            res.status(500).send("Error kicking member");
        });
}
