import { Team } from "../../models/team.js";
import { Tournament } from "../../models/tournament.js";
import { User } from "../../models/user.js";

export default async function updateMatchResult(req, res)
{
    try
    {
        const { tournamentId, roundNumber, matchId } = req.params;
        const { winner, points, start, end } = req.body;
        const tournament = await Tournament.findByPk(tournamentId);
        const isStart = start ? true : false
        const isEnd = end ? true : false
        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        let bracket = JSON.parse(tournament.bracket || "[]");

        if (isEnd)
        {
            switch (tournament.Format)
            {
                case "SE":
                    bracket = updateSingleEliminationMatch(bracket, roundNumber, matchId, winner, points);
                    if (checkForSEWinner(bracket))
                    {
                        return await endTournament(tournamentId, res)
                    }
                    break;
                case "DE":
                    bracket = updateDoubleEliminationMatch(bracket, roundNumber, matchId, winner, points);
                    if (checkForDEWinner(bracket))
                    {
                        return await endTournament(tournamentId, res)
                    }
                    break;
                case "RR":
                    bracket = updateRoundRobinMatch(bracket, roundNumber, matchId, winner, points);
                    if (checkForRRWinner(bracket))
                    {
                        return await endTournament(tournamentId, res)
                    }
                    break;
                case "SW":
                    bracket = updateSwissMatch(bracket, roundNumber, matchId, winner, points);
                    if (checkForSWWinner(bracket))
                    {
                        return await endTournament(tournamentId, res)
                    }
                    break;
                default:
                    return res.status(400).json({ message: "Invalid tournament format" });
            }
        }
        if (isStart)
        {

            bracket = startMatch(tournament, roundNumber, matchId)

        }
        tournament.bracket = JSON.stringify(bracket);
        await tournament.save();

        return res.status(200).json({ message: "Match result updated successfully", bracket });
    } catch (error)
    {
        console.error("Error updating match result:", error);
        return res.status(500).json({ message: "Error updating match", error: error });
    }
}

function startMatch(tournament, roundNumber, matchId)
{
    // Ensure the tournament has a valid bracket
    let bracket = JSON.parse(tournament.bracket || "[]");

    // Check the tournament format, as the match structure may vary by format
    switch (tournament.Format)
    {
        case "SE":
            startSingleEliminationMatch(bracket, roundNumber, matchId);
            break;
        case "DE":
            startDoubleEliminationMatch(bracket, roundNumber, matchId);
            break;
        case "RR":
            startRoundRobinMatch(bracket, roundNumber, matchId);
            break;
        case "SW":
            startSwissMatch(bracket, roundNumber, matchId);
            break;
        case "BR":
            startBattleRoyaleMatch(bracket, matchId);
            break;
        default:
            throw new Error("Invalid tournament format");
    }

    // Update the tournament bracket and save
    tournament.bracket = JSON.stringify(bracket);
    return tournament.save();
}

// Single Elimination
function startSingleEliminationMatch(bracket, roundNumber, matchId)
{
    const round = bracket.rounds.find(round => round.roundNumber === roundNumber);
    if (!round) throw new Error("Round not found");

    const match = round.matches.find(match => match.matchId === matchId);
    if (!match) throw new Error("Match not found");

    if (match.status !== "pending") throw new Error("Match cannot be started");

    // Mark the match as ongoing
    match.status = "ongoing";
}

// Double Elimination
function startDoubleEliminationMatch(bracket, roundNumber, matchId)
{
    let round = bracket.winnerRounds.find(round => round.roundNumber === roundNumber);

    if (!round)
    {
        round = bracket.loserRounds.find(round => round.roundNumber === roundNumber);
        if (!round) throw new Error("Round not found");
    }

    const match = round.matches.find(match => match.matchId === matchId);
    if (!match) throw new Error("Match not found");

    if (match.status !== "pending") throw new Error("Match cannot be started");

    // Mark the match as ongoing
    match.status = "ongoing";
}

// Round Robin
function startRoundRobinMatch(bracket, roundNumber, matchId)
{
    const group = bracket.groups.find(group => group.groupNumber === roundNumber);
    if (!group) throw new Error("Group not found");

    const match = group.matches.find(match => match.matchId === matchId);
    if (!match) throw new Error("Match not found");

    if (match.status !== "pending") throw new Error("Match cannot be started");

    // Mark the match as ongoing
    match.status = "ongoing";
}

// Swiss
function startSwissMatch(bracket, roundNumber, matchId)
{
    const match = bracket.matches.find(match => match.roundNumber === roundNumber && match.matchId === matchId);
    if (!match) throw new Error("Match not found");

    if (match.status !== "pending") throw new Error("Match cannot be started");

    // Mark the match as ongoing
    match.status = "ongoing";
}

// Battle Royale (BR)
function startBattleRoyaleMatch(bracket, matchId)
{
    const match = bracket.teams.find(team => team.matchId === matchId);
    if (!match) throw new Error("Match not found");

    if (match.status !== "pending") throw new Error("Match cannot be started");

    // Mark the match as ongoing
    match.status = "ongoing";
}


function updateSingleEliminationMatch(bracket, roundNumber, matchId, winner)
{
    const round = bracket.rounds.find(r => r.roundNumber === parseInt(roundNumber));
    if (!round) throw new Error("Round not found");
    const match = round.Matches.find(m => m.id === parseInt(matchId));
    if (!match) throw new Error("Match not found");
    return bracket
}

function checkForSEWinner(bracket)
{
    const lastRound = bracket.rounds[bracket.rounds.length - 1];
    if (lastRound && lastRound.matches.length === 1)
    {
        const finalMatch = lastRound.matches[0];
        if (finalMatch.status === 'completed' && finalMatch.winner)
        {
            return finalMatch.winner; // Return the winner's ID or object
        }
    }
    return null; // No winner yet
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
    return bracket
}

function checkForDEWinner(bracket)
{
    const winnerRound = bracket.winnerRounds[bracket.winnerRounds.length - 1];
    const loserRound = bracket.loserRounds[bracket.loserRounds.length - 1];

    // Check winners bracket
    if (winnerRound && winnerRound.matches.length === 1)
    {
        const finalMatch = winnerRound.matches[0];
        if (finalMatch.status === 'completed' && finalMatch.winner)
        {
            return finalMatch.winner; // Return the winner's ID or object
        }
    }

    // Check losers bracket
    if (loserRound && loserRound.matches.length === 1)
    {
        const finalMatch = loserRound.matches[0];
        if (finalMatch.status === 'completed' && finalMatch.winner)
        {
            return finalMatch.winner; // Return the winner's ID or object
        }
    }
    return null; // No winner yet
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
    return bracket
}

function checkForRRWinner(bracket)
{
    const finalRounds = bracket.finalRounds;
    const standings = {}; // A map to keep track of points and matches played
    // Calculate points based on matches played
    finalRounds.forEach(round =>
    {
        round.matches.forEach(match =>
        {
            if (match.status === 'completed')
            {
                if (match.winner)
                {
                    standings[match.winner] = (standings[match.winner] || 0) + 3; // 3 points for a win
                }
                // Draw scenario
                if (match.isDraw)
                {
                    standings[match.team1] = (standings[match.team1] || 0) + 1; // 1 point for draw
                    standings[match.team2] = (standings[match.team2] || 0) + 1;
                }
            }
        });
    });

    // Determine the participant with the most points
    const winner = Object.entries(standings).reduce((a, b) => (a[1] > b[1] ? a : b), [null, -1])[0];
    return winner || null; // Return winner or null
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
    return bracket
}

function checkForSWWinner(bracket)
{
    const standings = {}; // To track points and matches

    // Calculate points based on matches played
    bracket.Matches.forEach(match =>
    {
        if (match.status === 'completed')
        {
            if (match.winner)
            {
                standings[match.winner] = (standings[match.winner] || 0) + 3; // 3 points for a win
            }
            if (match.isDraw)
            {
                standings[match.team1] = (standings[match.team1] || 0) + 1; // 1 point for draw
                standings[match.team2] = (standings[match.team2] || 0) + 1;
            }
        }
    });

    // Determine the participant with the most points
    const winner = Object.entries(standings).reduce((a, b) => (a[1] > b[1] ? a : b), [null, -1])[0];
    return winner || null; // Return winner or null
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

export async function eliminatePlayer(req, res)
{
    try
    {
        const { tournamentSlug } = req.params;
        const { playerId, eliminatorId } = req.body; // Expecting playerId and eliminatorId in the request body

        const tournament = await Tournament.findOne({ where: { slug: tournamentSlug } });
        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        let bracket = JSON.parse(tournament.bracket || "[]");

        // Call the function to handle player elimination
        const result = updateBattleRoyaleElimination(bracket, playerId, eliminatorId);
        if (checkBattleRoyaleWinner(bracket))
        {
            return await endTournament(tournament.id, res)
        }
        if (!result.success)
        {
            return res.status(400).json({ message: result.message });
        }

        tournament.bracket = JSON.stringify(bracket);
        await tournament.save();

        return res.status(200).json({ message: "Player eliminated successfully", bracket });
    } catch (error)
    {
        console.error("Error eliminating player:", error);
        return res.status(500).json({ message: "Error eliminating player" });
    }
}

function updateBattleRoyaleElimination(bracket, playerId, eliminatorId)
{
    // Find the player in the bracket and mark them as eliminated
    const player = bracket.find(p => p.id === playerId);
    if (!player)
    {
        return { success: false, message: "Player not found in the bracket" };
    }

    // Mark the player as eliminated
    player.status = "eliminated"; // Or however you define it in your bracket structure
    player.eliminatedBy = eliminatorId; // Store who eliminated the player

    return { success: true };
}
function checkBattleRoyaleWinner(bracket)
{
    const activeParticipants = bracket.filter(participant => participant.status === "active");

    if (activeParticipants.length === 1)
    {
        // We have a winner
        const winner = activeParticipants[0];
        return { winner, isFinished: true };
    } else
    {
        // No winner yet, tournament is still ongoing
        return null;
    }
}


async function endTournament(tournamentId, res)
{
    try
    {
        const tournament = await Tournament.findByPk(tournamentId);

        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        if (tournament.status === "Completed")
        {
            return res.status(400).json({ message: "Tournament already completed" });
        }

        let participants = JSON.parse(tournament.participants || "[]");

        // Mark tournament as completed
        tournament.status = "Completed";

        // Loop through participants and update history
        for (const participant of participants)
        {
            if (participant.teamId)
            {
                // Team tournament - update team history
                const team = await Team.findByPk(participant.teamId);
                if (team)
                {
                    updateTeamTournamentHistory(participant.teamId, tournament.id, {
                        tournamentName: tournament.name,
                        position: participant.finalPosition || null,
                        result: participant.result || "Unknown",
                        joinedAt: participant.joinedAt,
                        status: "Completed",
                        members: team.members,
                        matchHistory: participant.matchHistory || []
                    });
                }
            } else
            {
                // Solo tournament - update user history
                const user = await User.findByPk(participant.userId);
                if (user)
                {
                    updateUserTournamentHistory(participant.userId, tournament.id, {
                        tournamentName: tournament.name,
                        role: "Solo",
                        position: participant.finalPosition || null,
                        result: participant.result || "Unknown",
                        joinedAt: participant.joinedAt,
                        leftAt: participant.leftAt,
                        status: "Completed",
                        matchHistory: participant.matchHistory || []
                    });
                }
            }
        }

        await tournament.save();
        return res.status(200).json({ message: "Tournament ended successfully", tournament });

    } catch (error)
    {
        console.error("Error ending tournament:", error);
        return res.status(500).json({ message: "Error ending tournament" });
    }
}

function updateUserTournamentHistory(userId, tournamentId, resultData)
{
    const tournamentData = {
        tournamentId: tournamentId,
        tournamentName: resultData.tournamentName,
        role: resultData.role || (resultData.teamId ? "Player" : "Solo"),  // 'Player' or 'Solo'
        teamId: resultData.teamId || null,   // Null for solo tournaments
        teamName: resultData.teamName || null, // Null for solo tournaments
        position: resultData.position,      // Final standing (null if incomplete)
        result: resultData.result,          // 'Winner', 'Runner-up', etc.
        joinedAt: resultData.joinedAt,
        leftAt: resultData.leftAt,
        status: resultData.status,          // 'Active', 'Completed', 'Left'
        matchHistory: resultData.matchHistory // Matches and performance
    };

    User.findByPk(userId).then(user =>
    {
        if (user)
        {
            const history = user.tournamentsHistory || [];
            history.push(tournamentData);
            user.update({ tournamentsHistory: history })
                .then(() =>
                {
                    console.log("User history updated successfully");
                })
                .catch(err =>
                {
                    console.error("Error updating user history:", err);
                });
        }
    });
}

function updateTeamTournamentHistory(teamId, tournamentId, resultData)
{
    const tournamentData = {
        tournamentId: tournamentId,
        tournamentName: resultData.tournamentName,
        teamPosition: resultData.position,  // Final standing of the team
        teamResult: resultData.result,      // 'Winner', 'Runner-up', etc.
        qualified: resultData.qualified,    // Whether the team qualified
        joinedAt: resultData.joinedAt,
        leftAt: resultData.leftAt,
        status: resultData.status,          // 'Active', 'Completed', 'Left'
        members: resultData.members,        // Members with roles and participation status
        matchHistory: resultData.matchHistory // Team match history
    };

    Team.findByPk(teamId).then(team =>
    {
        if (team)
        {
            const history = team.tournamentsHistory || [];
            history.push(tournamentData);
            team.update({ tournamentsHistory: history })
                .then(() =>
                {
                    console.log("Team history updated successfully");
                })
                .catch(err =>
                {
                    console.error("Error updating team history:", err);
                });
        }
    });
}
