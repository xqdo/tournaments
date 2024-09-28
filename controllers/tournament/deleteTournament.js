import { Tournament } from "../../models/tournament.js";

export default async function deleteTournament(req, res)
{
    try
    {
        const { id } = req.params;

        // Find the tournament by its ID
        const tournament = await Tournament.findByPk(id);

        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        // Hard delete the tournament
        await tournament.destroy();

        return res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (error)
    {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error processing request" });
    }
}
