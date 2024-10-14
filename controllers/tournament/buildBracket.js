import { Tournament } from "../../models/tournament.js";

export default async function buildBracket(req, res)
{
    try
    {
        const { tournamentId } = req.params;

        // Fetch the tournament
        const tournament = await Tournament.findByPk(tournamentId);

        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        // Parse and filter qualified participants
        const participants = JSON.parse(tournament.participants || "[]").filter(p => p.qualified);

        // Check if the number of qualified participants meets the minParticipants requirement
        if (participants.length < tournament.minParticipants)
        {
            return res.status(400).json({
                message: `Not enough qualified participants. Minimum required is ${tournament.minParticipants}, but only ${participants.length} qualified.`
            });
        }

        // Check if the number of qualified participants does not exceed maxParticipants
        if (participants.length > tournament.maxParticipants)
        {
            return res.status(400).json({
                message: `Too many qualified participants. Maximum allowed is ${tournament.maxParticipants}, but ${participants.length} are qualified.`
            });
        }

        let bracket;

        // Build bracket based on tournament format
        switch (tournament.Format)
        {
            case "SE":
                bracket = buildSingleEliminationBracket(participants);
                break;
            case "DE":
                bracket = buildDoubleEliminationBracket(participants);
                break;
            case "RR":
                bracket = buildRoundRobin(participants);
                break;
            case "SW":
                bracket = buildSwissBracket(participants);
                break;
            case "BR":
                bracket = buildBattleRoyaleBracket(participants);
                break;
            default:
                return res.status(400).json({ message: "Invalid tournament format" });
        }

        // Return the bracket
        return res.status(200).json({ bracket });

    } catch (error)
    {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error building bracket" });
    }
}

function buildSingleEliminationBracket(participants)
{
    const rounds = [];
    let currentRound = participants;

    let roundNumber = 1;
    while (currentRound.length > 1)
    {
        const matches = [];
        for (let i = 0; i < currentRound.length; i += 2)
        {
            const match = {
                team1: currentRound[i],
                team2: currentRound[i + 1] || null, // Null for a bye if odd
                winner: null,
                status: "pending",
            };
            matches.push(match);
        }

        rounds.push({ roundNumber, matches });
        currentRound = matches.map(match => match.team1); // Winners advance to next round
        roundNumber++;
    }

    return { rounds };
}

function buildDoubleEliminationBracket(participants)
{
    const winnersRounds = [];
    const losersRounds = [];

    let currentRound = participants;
    let roundNumber = 1;

    // Winners bracket
    while (currentRound.length > 1)
    {
        const matches = [];
        for (let i = 0; i < currentRound.length; i += 2)
        {
            const match = {
                team1: currentRound[i],
                team2: currentRound[i + 1] || null, // Null for a bye if odd
                winner: null,
                status: "pending",
            };
            matches.push(match);
        }

        winnersRounds.push({ roundNumber, matches });
        currentRound = matches.map(match => match.team1); // Winners advance to next round
        roundNumber++;
    }

    // Losers bracket will require logic to populate based on losers from winners
    // Placeholder for losers rounds
    losersRounds.push({ roundNumber: 1, matches: [] });

    return { winnersRounds, losersRounds };
}

function buildRoundRobin(participants)
{
    const groups = [];
    const totalMatches = [];

    // Create groups or single group based on your rules
    groups.push({ groupNumber: 1, ranking: [], matches: [] });

    // Create matches between each participant
    for (let i = 0; i < participants.length; i++)
    {
        for (let j = i + 1; j < participants.length; j++)
        {
            const match = {
                team1: participants[i],
                team2: participants[j],
                winner: null,
                isDraw: false,
            };
            totalMatches.push(match);
        }
    }

    // Populate matches to the group
    groups[0].matches = totalMatches;

    // Placeholder ranking structure
    groups[0].ranking = participants.map(participant => ({
        team: participant,
        teamPoints: 0,
        matchesPlayed: 0,
        ranking: 0,
    }));

    return { groups, finalRounds: { rounds: [] } };
}

function buildSwissBracket(participants)
{
    const ranking = participants.map(participant => ({
        team: participant,
        teamPoints: 0,
        matchesPlayed: 0,
        ranking: 0,
    }));

    const matches = []; // Matches would be built based on rounds

    return { ranking, matches };
}

function buildBattleRoyaleBracket(participants)
{
    const teams = participants.map(participant => ({
        team: participant,
        rank: null, // Rank will be determined during gameplay
        eliminations: 0, // Count of eliminations
    }));

    return { teams, status: "ongoing" }; // Status can be dynamic based on gameplay
}
