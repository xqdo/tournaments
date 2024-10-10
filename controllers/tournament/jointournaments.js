import { Tournament } from "../../models/tournament.js";
import { User } from "../../models/user.js";
import { Team } from "../../models/team.js";

export default async function joinTournament(req, res)
{
    try
    {
        const { tournamentLink } = req.params;
        const { teamMembers } = req.body; // Array of { userId, isprimary }
        const { user } = req; // user contains the id of the user

        if (!tournamentLink)
        {
            return res.status(400).json({ error: 'Invite link is required' });
        }

        // Validate that teamMembers is an array


        // Find the tournament by invite link
        const tournament = await Tournament.findOne({ where: { InviteLink: tournamentLink } });
        if (!tournament)
        {
            return res.status(404).json({ error: 'Tournament not found' });
        }

        // Log the tournament object to debug
        // console.log('Tournament:', tournament);

        // If the tournament's team size is 1 (solo tournament)
        if (tournament.teamSize === 1)
        {
            // Check if the user is already a participant
            const isUserParticipant = tournament.participants?.some(participant => participant.userId === user);
            if (isUserParticipant)
            {
                return res.status(400).json({ error: 'User is already a participant in this tournament' });
            }

            // Add the user as a participant (teamId is null since it's a solo game)
            const soloParticipant = {
                userId: user,
                teamId: null,
                qualified: false, // Default value, modify if needed
                isprimary: true
            };

            tournament.participants = [...(tournament.participants || []), soloParticipant];
            await tournament.save();

            return res.json({ success: 'User successfully joined the tournament', participants: tournament.participants });
        }

        // For team-based tournaments (teamSize > 1), proceed with team checks

        // Find the user trying to join
        // console.log(user);

        const userx = await User.findByPk(user.id);
        if (!userx)
        {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the user's team
        const team = await Team.findByPk(userx.team);
        if (!team)
        {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Ensure the user is a team leader
        const leader = team.members.find(member => member.id === user.id && member.role === 'Leader');
        if (!leader)
        {
            return res.status(403).send("Only the team leader is allowed to join tournaments");
        }

        // Ensure the number of primary team members matches the tournament's team size
        const primaryMembers = teamMembers.filter(member => member.isprimary);

        // Log the primaryMembers and tournament.teamSize for debugging
        console.log('Primary Members:', primaryMembers);
        console.log('Tournament Team Size:', tournament.TeamSize);

        if (primaryMembers.length !== tournament.TeamSize)
        {
            return res.status(400).json({ error: `The number of primary members must be exactly ${tournament.TeamSize}` });
        }

        // Validate that all provided team members are part of the team
        const invalidMembers = teamMembers.filter(
            ({ userId }) => !team.members.some(teamMember => teamMember.id === userId)
        );
        if (invalidMembers.length > 0)
        {
            return res.status(400).json({
                error: `The following members are not part of the team: ${invalidMembers.map(m => m.userId).join(', ')}`
            });
        }

        // Add team members to the tournament's participants
        const newParticipants = teamMembers.map(({ userId, isprimary }) => ({
            userId,
            teamId: team.id,
            qualified: false,  // Default value, modify if needed
            isprimary
        }));

        // Check if any team members are already participants
        const existingParticipants = tournament.participants || [];
        const alreadyParticipants = newParticipants.filter(({ userId }) =>
            existingParticipants.some(participant => participant.userId === userId)
        );

        if (alreadyParticipants.length > 0)
        {
            return res.status(400).json({
                error: `The following members are already participants: ${alreadyParticipants.map(m => m.userId).join(', ')}`
            });
        }

        // Add new participants to the tournament
        tournament.participants = [...existingParticipants, ...newParticipants];
        await tournament.save();

        res.json({ success: 'Team successfully joined the tournament', participants: tournament.participants });
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'An internal error occurred' });
    }
}
