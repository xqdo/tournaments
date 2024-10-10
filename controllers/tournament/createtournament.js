import { Tournament } from "../../models/tournament.js";
import crypto from "crypto";
import slugify from "slugify"; // For slug generation
import { User } from "../../models/user.js";

export default function createTournament(req, res)
{
    const {
        name,
        slug,
        description,
        streamLink,
        coverImage,
        portraitBG,
        game,
        startDate,
        registrationStartDate,
        registrationEndDate,
        requireRegistration,
        registrationForm,
        rulesFile,
        rulesDescription,
        maxParticipants,
        minParticipants,
        teamSize,
        qualifyingType,
        format,
        matchDuration,
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

    const { user } = req; // Assuming req.user holds the authenticated user
    if (!user)
    {
        return res.status(401).send("User not authenticated");
    }

    // Generate a unique invite link
    const linkGen = () =>
    {
        const link = crypto.randomBytes(8).toString('hex');
        return Tournament.findOne({ where: { InviteLink: link } }).then(existingLink =>
        {
            if (existingLink)
            {
                return linkGen(); // Recursion if link is already taken
            }
            return link;
        });
    };
    // Generate slug and invite link, and create the tournament
    linkGen()
        .then(inviteLink =>
        {
            return Tournament.create({
                name,
                slug,
                description,
                streamLink,
                coverImage,
                portraitBG,
                game,
                start_date: startDate,
                RegisterationStartDate: registrationStartDate,
                RegisterationEndDate: registrationEndDate,
                RequireRegisteration: requireRegistration || false,
                RegisterationForm: registrationForm || null,
                RulesFile: rulesFile || null,
                RulesDescription: rulesDescription || null,
                MaxParticipants: maxParticipants,
                MinParticipants: minParticipants,
                TeamSize: teamSize,
                QualifyingType: qualifyingType || 'manual', // Set default qualifying type if not provided
                Format: format,
                MatchDuration: matchDuration,
                RequireResultsAttachment: requireResultsAttachment || false,
                RequireCheckIn: requireCheckIn || false,
                CheckInTime: checkInTime || 0,
                TotalPrizePool: totalPrizePool,
                PrizeLine: prizeLine || null,
                Private: isPrivate || false,
                CountryOfTheTournament: countryOfTheTournament || null,
                ParticipantAccessResults: participantAccessResults || false,
                SponserName: sponsorName || null,
                SponserLogo: sponsorLogo || null,
                SponserCountry: sponsorCountry || null,
                SponserWebsite: sponsorWebsite || null,
                RechedBy: 0, // Default value
                Shares: 0, // Default value
                InviteLink: inviteLink,
                Bracket: [], // Default empty array
                Participants: [], // Default empty array
                creator: user.id, // Set the tournament creator
                orginizers: [user.user] // Set the user as the organizer
            });
        })
        .then(tournament =>
        {
            res.status(201).send({ message: "Tournament created successfully", tournament });
        })
        .catch(error =>
        {
            console.error("Error creating tournament:", error);
            res.status(500).send("Error creating tournament");
        });
}
