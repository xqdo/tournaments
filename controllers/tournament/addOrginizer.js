import { Tournament } from "../../models/tournament.js";
import { User } from "../../models/user.js";

export default function addOrganizer(req, res)
{
    const { userId } = req.body;
    const { slug } = req.params;
    // Find the user by ID
    User.findByPk(userId)
        .then(user =>
        {
            if (!user)
            {
                return res.status(404).json({ error: "User not found" });
            }
            // Find the tournament by ID
            return Tournament.findOne({ where: { slug } })
                .then(tournament =>
                {
                    if (!tournament)
                    {
                        return res.status(404).json({ error: "Tournament not found" });
                    }
                    // Check if the organizers field exists and is an array
                    let organizers
                    const isOnlyNull = tournamentOrganizers.every(org => org === null)
                    if (isOnlyNull)
                    {
                        organizers = [];
                    } else
                    {
                        organizers = tournament.orginizers
                    }
                    // Prevent duplicates by checking if the userId is already an organizer
                    if (organizers.includes(userId))
                    {
                        return res.status(400).json({ error: "User is already an organizer" });
                    }
                    // Add the user ID to the organizers array
                    organizers.push(user.id);
                    console.log(organizers);
                    // Update the organizers field in the tournament and save
                    tournament.orginizers = organizers;
                    tournament.save();
                    return res.status(200).json({ message: `Organizer ${user.username} added successfully` });
                })

        })
        .catch(error =>
        {
            console.error("Error adding organizer:", error);
            res.status(500).json({ error: "Internal server error" });
        });
}
