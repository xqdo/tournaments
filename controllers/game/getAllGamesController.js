import { Game } from "../../models/game.js";
export default function getAllGames(req, res)
{
    Game.findAll().then((games) =>
    {
        if (!games) return res.status(404).json({ message: "No games found" })
        res.status(200).json(games)
    }).catch((err) => res.status(500));
}