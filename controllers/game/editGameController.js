import { Game } from "../../models/game.js";

export default function editGame(req, res)
{
    const { gameName, battleRoyale, solo, teamSize, platforms } = req.body
    const { id } = req.params
    Game.findByPk(id).then((game) =>
    {
        if (!game)
        {
            return res.status(404).send({ message: "Game not found." });
        }
        const updates = {};
        if (gameName) updates.gameName = gameName;
        if (battleRoyale === true || battleRoyale === false) updates.battleRoyale = battleRoyale;
        if (solo === true || solo === false) updates.solo = solo;
        if (teamSize) updates.teamSize = teamSize;
        if (platforms) updates.platforms = platforms;
        game.update(updates).then(() => res.status(201).send(game)).catch((err) => res.status(500).send(err));
    }).catch((err) => res.status(500).send(err));
}