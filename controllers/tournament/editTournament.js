import { Tournament } from "../../models/tournament.js";
import crypto from "crypto";

export default async function editTournament(req, res)
{
    try
    {
        const {
            name,
            slug,
            description,
            streamLink,
            coverImage,
            portraitBG,
            startDate,
            registrationStartDate,
            registrationEndDate,
            requireRegistration,
            registrationForm,
            rulesFile,
            rulesDescription,
            maxParticipants,
            minParticipants,
            requireResultsAttachment,
            requireCheckIn,
            checkInTime,
            totalPrizePool,
            prizeLine,
            private: isPrivate,
            countryOfTheTournament,
            participantAccessResults,
            sponsorName,
            sponsorLogo,
            sponsorCountry,
            sponsorWebsite
        } = req.body;

        const tournamentId = req.params.id;

        // Check if tournament exists
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament)
        {
            return res.status(404).json({ message: "Tournament not found" });
        }

        // Function to generate unique invite link
        const generateUniqueLink = async () =>
        {
            let link;
            let isUnique = false;
            while (!isUnique)
            {
                link = crypto.randomBytes(8).toString('hex');
                const existingLink = await Tournament.findOne({ where: { InviteLink: link } });
                if (!existingLink)
                {
                    isUnique = true;
                }
            }
            return link;
        };

        // Fields that can always be updated
        const updates = {};

        // Automatically map the incoming request fields to the updates object
        const fields = {
            name,
            slug,
            description,
            coverImage,
            portraitBG,
            startDate,
            registrationStartDate,
            registrationEndDate,
            requireRegistration,
            registrationForm,
            rulesFile,
            rulesDescription,
            maxParticipants,
            minParticipants,
            requireResultsAttachment,
            requireCheckIn,
            checkInTime,
            totalPrizePool,
            prizeLine,
            private: isPrivate,
            countryOfTheTournament,
            participantAccessResults,
            sponsorName,
            sponsorLogo,
            sponsorCountry,
            sponsorWebsite
        };

        // Only assign fields that exist in req.body
        for (const [key, value] of Object.entries(fields))
        {
            if (value !== undefined) updates[key] = value;
        }

        // Generate unique invite link if streamLink is provided
        if (streamLink)
        {
            updates.streamLink = await generateUniqueLink();
        }

        // Fields that should NOT be updated after the tournament is created
        if (req.body.game || req.body.teamSize || req.body.format || req.body.qualifyingType)
        {
            return res.status(400).json({
                error: "Fields like game, teamSize, format, and qualifyingType cannot be changed after the tournament is created."
            });
        }

        // Update the tournament with valid fields
        await Tournament.update(updates, { where: { id: tournamentId } });

        return res.status(200).json({ message: "Tournament updated successfully" });

    } catch (error)
    {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error processing request" });
    }
}
