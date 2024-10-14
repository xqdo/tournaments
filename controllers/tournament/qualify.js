import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";

export default async function qualify(req, res)
{
    try
    {
        const { tournamentSlug } = req.params;
        const { playerId } = req.body;

        // Fetch the tournament by slug
        const tournament = await Tournament.findOne({ where: { slug: tournamentSlug } });
        if (!tournament)
        {
            return res.status(404).json({ error: "Tournament not found" });
        }

        // Fetch the user by ID
        const user = await User.findByPk(playerId);
        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        // Parse the participants JSON (assuming it is a JSON array stored as a string)
        let participants = JSON.parse(tournament.participants || "[]");

        // Find the participant in the participants array
        const participantIndex = participants.findIndex(participant => participant.userId === user.id);

        if (participantIndex === -1)
        {
            return res.status(400).json({ error: "User is not a participant in this tournament" });
        }

        // Check if the participant is already qualified
        if (participants[participantIndex].qualified)
        {
            return res.status(400).json({ error: "User is already qualified for this tournament" });
        }

        // Qualify the participant
        participants[participantIndex].qualified = true;

        // Update the participants field
        tournament.participants = JSON.stringify(participants);
        await tournament.save();

        return res.json({ message: "User qualified successfully" });

    } catch (error)
    {
        console.error("Error qualifying user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
