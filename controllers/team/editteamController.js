import { Team } from "../../models/team.js";
import { User } from "../../models/user.js";
import crypto from "crypto";

export default function patchTeam(req, res) {
    const { 
        username, 
        teamId, 
        newTeamName, 
        newTeamLogo, 
        newTeamDescription, 
        newTeamCover, 
        regenerateInviteLink, 
        newLeaderUsername // New leader username
    } = req.body; 

    // Find the user by username to get the user ID
    User.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found");
            }

            const userId = user.id;

            // Find the team by ID
            return Team.findOne({ where: { id: teamId } })
                .then(existingTeam => {
                    if (!existingTeam) {
                        return res.status(404).send("Team not found");
                    }

                    // Check if the user is the leader of the team
                    const isLeader = existingTeam.members.some(member => member.id === userId && member.role === 'Leader');
                    if (!isLeader) {
                        return res.status(403).send("Only the team leader can edit the team");
                    }

                    // Prepare an object to store the fields to update
                    const updates = {};

                    // Conditionally update fields if provided
                    if (newTeamName) updates.name = newTeamName;
                    if (newTeamLogo) updates.teamLogo = newTeamLogo;
                    if (newTeamDescription) updates.teamDescription = newTeamDescription;
                    if (newTeamCover) updates.teamCover = newTeamCover;

                    // If regenerateInviteLink flag is true, generate a new invite link
                    const inviteLinkPromise = regenerateInviteLink
                        ? Promise.resolve(crypto.randomBytes(8).toString('hex')).then(newInviteLink => {
                              updates.inviteLink = newInviteLink;
                          })
                        : Promise.resolve(); // No invite link update if the flag is not provided

                    // If a new leader is provided, update the team members
                    const updateLeaderPromise = newLeaderUsername
                        ? User.findOne({ where: { username: newLeaderUsername } }).then(newLeader => {
                              if (!newLeader) {
                                  return res.status(404).send("New leader not found");
                              }

                              const newLeaderId = newLeader.id;
                              
                              // Update current leader's role and set the new leader
                              existingTeam.members.forEach(member => {
                                  if (member.id === userId) {
                                      member.role = 'Member'; // Change current leader to member
                                  }
                                  if (member.id === newLeaderId) {
                                      member.role = 'Leader'; // Set new leader
                                  }
                              });

                              // Optionally update the members array in the team
                              updates.members = existingTeam.members; // This may depend on how you manage members

                          })
                        : Promise.resolve(); // No leader update if the flag is not provided

                    // Wait for all updates before applying them
                    return Promise.all([inviteLinkPromise, updateLeaderPromise])
                        .then(() => {
                            return Team.update(updates, { where: { id: teamId } });
                        })
                        .then(() => {
                            res.status(200).send("Team updated successfully");
                        });
                });
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).send("Error processing request");
        });
}
