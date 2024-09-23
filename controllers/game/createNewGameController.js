import { Game } from "../../models/game.js";

export default function createNewGame(req, res)
{
    const { gameName, battleRoyale, solo, teamSize, platforms } = req.body
    Game.create({ gameName, battleRoyale, solo, teamSize, platforms })
        .then((game) =>
        {
            res.status(201).json(game)
        }).catch(err => res.status(500).json(err))
}