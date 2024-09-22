import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";
import crypto from "crypto";

export default function createTeam(req, res) {
    const { username, teamName, teamLogo, teamDescription, teamCover } = req.body;

    // Generate a unique team ID
    const idGen = () => {
        const id = Math.floor(Math.random() * 100000000) % 100000000;
        return Team.findAll({
            attributes: ['id'],
            raw: true
        })
            .then(existingIds => {
                const ids = existingIds.map(team => team.id);
                if (ids.includes(id)) {
                    return idGen(); // Recursive call if ID is taken
                }
                return id; // Return the generated ID
            })
            .catch(err => {
                console.error('Error generating unique ID:', err);
                throw new Error('Error generating unique ID');
            });
    };

    // Generate a unique invite link
    const linkGen = () => {
        const link = crypto.randomBytes(8).toString('hex');
        return Team.findOne({ where: { inviteLink: link } })
            .then(existingLink => {
                if (existingLink) {
                    return linkGen(); // Recursive call if link is taken
                }
                return link; // Return the unique link
            })
            .catch(err => {
                console.error("Error generating invite link:", err);
                throw new Error("Error generating invite link");
            });
    };

    // Fetch the creator's user info from the database
    User.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found");
            }

            // Generate team ID and invite link, then create the team
            return Promise.all([idGen(), linkGen()]).then(([id, inviteLink]) => {
                const creatorInfo = {
                    id: user.id,
                    role: 'Leader', // Assign the creator as the leader by default
                    joinedAt: new Date().toISOString() // Add the current time when the team is created
                };

                return Team.create({
                    id,
                    name: teamName,
                    inviteLink,
                    teamLogo,
                    teamDescription,
                    teamCover,
                    members: [creatorInfo], // Set the creator as the first member
                    tournamentsHistory: [] // Empty tournaments array by default
                }).then(() => {
                    user.team = id; // Assign the team ID to the user
                    return user.save(); // Save the user with the updated team ID
                });
            });
        })
        .then(() => {
            res.status(201).send("Team created successfully with creator as leader");
        })
        .catch(err => {
            console.error("Error creating team:", err);
            res.status(500).send("Error creating team");
        });
}
