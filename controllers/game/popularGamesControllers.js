import { Game } from "../../models/game.js";
import { Tournament } from "../../models/tournament.js";

export default async function popularGames(req, res)
{
    const pGames = {};

    try
    {
        const tours = await Tournament.findAll();

        for (const tour of tours)
        {
            const game = await Game.findByPk(tour.game);
            if (!game) continue; // Handle case where game is not found

            if (pGames[game.gameName])
            {
                pGames[game.gameName].played++;
            } else
            {
                pGames[game.gameName] = { game, played: 1 };
            }
        }

        if (Object.keys(pGames).length > 0)
        {
            return res.status(200).json(pGames);
        } else
        {
            return res.status(404).json({ message: `there are ${Object.keys(pGames).length} games found` });
        }
    } catch (error)
    {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
