import { Tournament } from "../../models/tournament.js";

export default async function getAllParticipants(req, res)
{
    try
    {
        const { slug } = req.params;

        // Find the tournament by its ID
        const tournament = await Tournament.findOne({ where: { slug } });

        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        // Parse the participants field (stored as JSON in the database)
        const participants = JSON.parse(tournament.participants || "[]");

        // Return the participants in the response
        return res.status(200).json(participants);

    } catch (error)
    {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error fetching participants" });
    }
}
