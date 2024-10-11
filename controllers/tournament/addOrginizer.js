import { Tournament } from "../../models/tournament.js";
import { User } from "../../models/user.js";

export default function addOrganizer(req, res) {
    const { userId } = req.body;
    const { slug } = req.params;

    // Find the user by ID
    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Find the tournament by slug
            return Tournament.findOne({ where: { slug } })
                .then(tournament => {
                    if (!tournament) {
                        return res.status(404).json({ error: "Tournament not found" });
                    }

                    // Ensure orginizers field exists and is an array
                    let orginizers = tournament.orginizers || []; // Fallback to an empty array if undefined

                    // Log the existing orginizers for debugging
                    console.log('Existing Organizers:', orginizers);

                    // Prevent adding the same user twice as an organizer
                    if (orginizers.includes(userId)) {
                        return res.status(400).json({ error: "User is already an organizer" });
                    }

                    // Add the user to the orginizers array
                    orginizers.push(user.id);

                    // Update the tournament's orginizers field using update
                    return Tournament.update(
                        { orginizers }, // New value for the orginizers field
                        { where: { slug } } // Condition to identify the tournament
                    ).then(() => {
                        res.status(200).json({ message: `Organizer ${user.username} added successfully`, orginizers });
                    });
                });
        })
        .catch(error => {
            console.error("Error adding organizer:", error);
            res.status(500).json({ error: "Internal server error" });
        });
}
