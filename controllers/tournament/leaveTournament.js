import { Tournament } from "../../models/tournament.js";
import { Team } from "../../models/team.js";

export default async function leaveTournament(req, res)
{
    try
    {
        const { tournamentId } = req.params;
        const { user } = req.user; // Assuming req.user contains the user id

        // Find the tournament by its ID
        const tournament = await Tournament.findByPk(tournamentId);

        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        // Check if the tournament has started
        if (new Date(tournament.startDate) <= new Date())
        {
            return res.status(400).json({ message: "Cannot leave after the tournament has started" });
        }

        // Parse the participants field (JSON)
        let participants = JSON.parse(tournament.participants || "[]");

        // Find the team associated with the user
        const team = await Team.findOne({ where: { id: req.user.teamId } }); // Assuming teamId is stored in user

        if (!team)
        {
            return res.status(400).json({ message: "Team not found" });
        }

        // Check if the user is the leader
        const isLeader = team.members.some(member => member.userId === user && member.role === 'Leader');

        if (!isLeader)
        {
            return res.status(403).json({ message: "Only team leaders can leave the tournament" });
        }

        // Remove the entire team if the leader leaves
        participants = participants.filter(participant => participant.teamId !== team.id);

        // Update the participants field in the tournament
        await tournament.update({ participants: JSON.stringify(participants) });

        return res.status(200).json({ message: "Team successfully left the tournament" });

    } catch (error)
    {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error processing request" });
    }
}
