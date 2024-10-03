import { Team } from "../../models/team.js";
import { User } from "../../models/user.js"; // Import the User model
import crypto from "crypto";

export default function createTeam(req, res) {
    const { teamName, teamLogo, teamDescription, teamCover } = req.body;
    const { user } = req; // Assuming req.user holds the authenticated user's ID

    // Generate a unique team ID
    const idGen = () => {
        const id = Math.floor(Math.random() * 100000000) % 100000000;
        return Team.findAll({
            attributes: ['id'],
            raw: true
        }).then(existingIds => {
            const ids = existingIds.map(team => team.id);
            if (ids.includes(id)) {
                return idGen(); // Recursive call if ID is taken
            }
            return id; // Return the generated ID
        }).catch(err => {
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

    // Check if the user exists in req.user
    console.log(user)
    if (!user) {
        return res.status(404).send("User not found");
    }

    // Fetch the user from the database
    console.log(user.user);
    User.findByPk(user.user) // Assuming user.id is passed from the request object
        .then(foundUser => {
            if (!foundUser) {
                return res.status(404).send("User not found in the database");
            }

            // Generate team ID and invite link, then create the team
            return Promise.all([idGen(), linkGen()]).then(([id, inviteLink]) => {
                const creatorInfo = {
                    id: foundUser.id,
                    role: 'Leader', // Assign the creator as the leader by default
                    joinedAt: new Date().toISOString() // Add the current time when the team is created
                };

                // Create the team
                return Team.create({
                    id,
                    name: teamName,
                    inviteLink,
                    teamLogo,
                    teamDescription,
                    teamCover,
                    members: [creatorInfo], // Set the creator as the first member
                    tournamentsHistory: [] // Empty tournaments array by default
                }).then((team) => {
                    // Assign the team ID to the user and save
                    foundUser.team = team.id; // Update user's team property
                    return foundUser.save(); // Save the user instance to the database
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
