import { Game } from "../../models/game.js";

export default function deleteGame(req, res)
{
    const { id } = req.params;
    Game.destroy({ where: { id } })
}