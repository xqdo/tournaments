import { Tournament } from "../../models/tournament";

export default function getAllTournaments(req, res)
{
    Tournament.findAll()
        .then((tournaments) =>
        {
            if (!tournaments)
            {
                return res.status(404).json({ message: "No tournaments found." });
            }
            res.status(200).json(tournaments);
        })
        .catch((err) =>
        {
            res.status(500).json({ error: err.message });
        });
}