import { Tournament } from "../../models/tournament.js";

export default async function updateMatchResult(req, res)
{
    try
    {
        const { tournamentId, roundNumber, matchId } = req.params;
        const { winner, points } = req.body;
        const tournament = await Tournament.findByPk(tournamentId);

        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        let bracket = JSON.parse(tournament.bracket || "[]");

        switch (tournament.Format)
        {
            case "SE":
                updateSingleEliminationMatch(bracket, roundNumber, matchId, winner, points);
                break;
            case "DE":
                updateDoubleEliminationMatch(bracket, roundNumber, matchId, winner, points);
                break;
            case "RR":
                updateRoundRobinMatch(bracket, roundNumber, matchId, winner, points);
                break;
            case "SW":
                updateSwissMatch(bracket, roundNumber, matchId, winner, points);
                break;
            case "BR":
                updateBattleRoyaleMatch(bracket, matchId, points);
                break;
            default:
                return res.status(400).json({ message: "Invalid tournament format" });
        }
        tournament.bracket = JSON.stringify(bracket);
        await tournament.save();

        return res.status(200).json({ message: "Match result updated successfully", bracket });
    } catch (error)
    {
        console.error("Error updating match result:", error);
        return res.status(500).json({ message: "Error updating match result" });
    }
}

function updateSingleEliminationMatch(bracket, roundNumber, matchId, winner, points)
{
    const round = bracket.rounds.find(r => r.roundNumber === parseInt(roundNumber));
    if (!round) throw new Error("Round not found");

    const match = round.Matches.find(m => m.id === parseInt(matchId));
    if (!match) throw new Error("Match not found");

    match.winner = winner;
    match.status = "Completed";
    if (points)
    {
        match.points = points;
    }
}

function updateDoubleEliminationMatch(bracket, roundNumber, matchId, winner, points)
{
    let match;

    // Check in winnerRounds
    const winnerRound = bracket.winnerRounds.find(r => r.roundNumber === parseInt(roundNumber));
    if (winnerRound)
    {
        match = winnerRound.Matches.find(m => m.id === parseInt(matchId));
    }
    if (!match)
    {
        const loserRound = bracket.loserRounds.find(r => r.roundNumber === parseInt(roundNumber));
        if (!loserRound) throw new Error("Round not found");
        match = loserRound.Matches.find(m => m.id === parseInt(matchId));
    }

    if (!match) throw new Error("Match not found");

    match.winner = winner;
    match.status = "Completed";
    if (points)
    {
        match.points = points;
    }
}

function updateRoundRobinMatch(bracket, roundNumber, matchId, winner, points)
{
    const group = bracket.groups.find(g => g.groupNumber === parseInt(roundNumber));
    if (!group) throw new Error("Group not found");

    const match = group.Matches.find(m => m.id === parseInt(matchId));
    if (!match) throw new Error("Match not found");

    match.winner = winner;
    match.status = "Completed";
    if (points)
    {
        match.points = points;
    }
    updateRankings(group, match, winner);
}

function updateSwissMatch(bracket, roundNumber, matchId, winner, points)
{
    const round = bracket.rounds.find(r => r.roundNumber === parseInt(roundNumber));
    if (!round) throw new Error("Round not found");

    const match = round.Matches.find(m => m.id === parseInt(matchId));
    if (!match) throw new Error("Match not found");

    match.winner = winner;
    match.status = "Completed";
    if (points)
    {
        match.points = points;
    }
    updateRankings(bracket.ranking, match, winner);
}

function updateRankings(ranking, match, winner)
{
    const { t1, t2 } = match;
    if (winner === t1)
    {
        updateParticipantRanking(ranking, t1, 3);
        updateParticipantRanking(ranking, t2, 0);
    } else if (winner === t2)
    {
        updateParticipantRanking(ranking, t2, 3);
        updateParticipantRanking(ranking, t1, 0);
    } else
    {
        updateParticipantRanking(ranking, t1, 1);
        updateParticipantRanking(ranking, t2, 1);
    }
    ranking.sort((a, b) => b.teamPoints - a.teamPoints);
}

function updateParticipantRanking(ranking, participantId, pointsEarned)
{
    const participant = ranking.find(r => r.teamId === participantId);

    if (!participant)
    {
        ranking.push({
            teamId: participantId,
            teamPoints: pointsEarned,
            matchesPlayed: 1
        });
    } else
    {
        participant.teamPoints += pointsEarned;
        participant.matchesPlayed += 1;
    }
}
