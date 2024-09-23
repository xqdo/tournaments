import { Tournament } from "../../models/tournament.js";

export default function getTournamentBySlug(req, res)
{
    const { slug } = req.params;
    Tournament.findOne({ where: { slug } }).then((tournament) =>
    {
        if (tournament)
        {
            res.json(tournament)
        } else
        {
            res.status(404).send("Tournament not found")
        }
    }).catch(err => res.status(500).send(err))
}