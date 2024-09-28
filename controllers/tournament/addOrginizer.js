import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";

export default async function addOrginizer(req, res)
{
    const { userId } = req.body
    const { tournamentId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    tournament.orginizers.push(userId);
    tournament.save().then(() =>
    {
        res.status(200).json({ message: "Orginizer added successfully" });
    })
}