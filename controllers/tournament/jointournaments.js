import { Tournament } from "../../models/tournament.js";
import { User } from "../../models/user.js";
import { Team } from "../../models/team.js";

export default function joinTournament(req, res) {
    const { tournamentLink } = req.params;
    const { teamMembers } = req.body; // Array of { userId, isprimary }
    const { user } = req; // user contains the id of the user

    if (!tournamentLink) {
        return res.status(400).json({ error: 'Invite link is required' });
    }

    // Validate that teamMembers is provided and is an array
    if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        return res.status(400).json({ error: 'Team members are required and should be an array' });
    }

    // Find the tournament by invite link
    Tournament.findOne({ where: { InviteLink: tournamentLink } })
        .then(tournament => {
            if (!tournament) {
                return res.status(404).json({ error: 'Tournament not found' });
            }

            // If it's a solo tournament
            if (tournament.teamSize === 1) {
                const isUserParticipant = tournament.participants?.some(participant => participant.userId === user.id);
                if (isUserParticipant) {
                    return res.status(400).json({ error: 'User is already a participant in this tournament' });
                }

                const soloParticipant = {
                    userId: user.id,
                    teamId: null,
                    qualified: false,
                    isprimary: true
                };

                const newParticipants = [...(tournament.participants || []), soloParticipant];

                // Force setting participants and save
                tournament.set('participants', newParticipants);
                return tournament.save().then(() => {
                    res.json({ success: 'User successfully joined the tournament', participants: newParticipants });
                });
            }

            // Find the user
            return User.findByPk(user.id)
                .then(userx => {
                    if (!userx) {
                        return res.status(404).json({ error: 'User not found' });
                    }

                    // Find the user's team
                    return Team.findByPk(userx.team)
                        .then(team => {
                            if (!team) {
                                return res.status(404).json({ error: 'Team not found' });
                            }

                            // Ensure the user is the team leader
                            const leader = team.members.find(member => member.id === user.id && member.role === 'Leader');
                            if (!leader) {
                                return res.status(403).send("Only the team leader is allowed to join tournaments");
                            }

                            // Ensure the number of primary team members matches the tournament's team size
                            const primaryMembers = teamMembers.filter(member => member.isprimary);
                            if (primaryMembers.length !== tournament.TeamSize) {
                                return res.status(400).json({ error: `The number of primary members must be exactly ${tournament.TeamSize}` });
                            }

                            // Validate that all provided team members are part of the team
                            const invalidMembers = teamMembers.filter(
                                ({ userId }) => !team.members.some(teamMember => teamMember.id === userId)
                            );
                            if (invalidMembers.length > 0) {
                                return res.status(400).json({
                                    error: `The following members are not part of the team: ${invalidMembers.map(m => m.userId).join(', ')}`,
                                });
                            }

                            // Add team members to the tournament's participants
                            const newParticipants = teamMembers.map(({ userId, isprimary }) => ({
                                userId,
                                teamId: team.id,
                                qualified: false,
                                isprimary
                            }));

                            // Check if any team members are already participants
                            const existingParticipants = tournament.participants || [];
                            const alreadyParticipants = newParticipants.filter(({ userId }) =>
                                existingParticipants.some(participant => participant.userId === userId)
                            );

                            if (alreadyParticipants.length > 0) {
                                return res.status(400).json({
                                    error: `The following members are already participants: ${alreadyParticipants.map(m => m.userId).join(', ')}`,
                                });
                            }

                            // Combine and update the participants
                            const updatedParticipants = [...existingParticipants, ...newParticipants];

                            // Force setting participants and save
                            tournament.set('Participants', updatedParticipants);
                            return tournament.save().then(() => {
                                res.json({ success: 'Team successfully joined the tournament', participants: updatedParticipants });
                            });
                        });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An internal error occurred' });
        });
}
