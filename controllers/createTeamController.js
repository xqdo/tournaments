import { Team, teamMembers } from "../models/team.js";
import { User } from "../models/user.js";
import crypto from "crypto"

export default function createTeam(req, res)
{
    const { username, teamName, logo } = req.body; // Add username to fetch creator's info

    // Generate a unique team ID
    const idGen = () =>
    {
        const id = Math.floor(Math.random() * 1000000000000000) % 100000000;
        return Team.findAll({
            attributes: ['id'],
            raw: true
        }).then(existingIds =>
        {
            const ids = existingIds.map(team => team.id);
            if (ids.includes(id))
            {
                return idGen();  // Recursive call if ID is taken
            }
            return id;  // Return the generated ID
        }).catch(err =>
        {
            console.error('Error generating unique ID:', err);
            throw new Error('Error generating unique ID');
        });
    };
    const linkGen = () =>
    {
        const link = crypto.randomBytes(8).toString('hex');
        return Team.findAll({
            attributes: [inviteLink],
            raw: true
        }).then(links =>
        {
            if (links.includes(link))
            {
                return linkGen();  // Recursive call if link is taken
            }
            return link;  // Return the generated link

        }).catch(err =>
        {
            console.error('Error generating unique link:', err);

        });
    };
    const id = idGen()
    const inviteLink = linkGen()
    // Fetch the creator's user info from the database
    User.findOne({ where: { username } })
        .then(user =>
        {
            if (!user)
            {
                return res.status(404).send("User not found");
            }

            // Create a new team in the database
            Team.create({ id, name: teamName, teamCaptin: user.id, inviteLink, teamLogo: logo })
                .then(() =>
                {
                    // Add the creator to the team members table
                    teamMembers.create({ userId: user.id, teamId: id })
                        .then(() =>
                        {
                            res.status(201).send("Team created successfully");
                        })
                        .catch(err =>
                        {
                            // console.error("Error adding creator to team members:", err);
                            res.status(500).send("Error adding creator to team members");

                        });
                })
                .catch(err =>
                {
                    console.error("Error creating team:", err);
                    res.status(500).send("Error creating team");
                });


        })
        .catch(err =>
        {
            console.error("Error fetching creator info:", err);
            res.status(500).send("Error fetching creator info");
        });
}