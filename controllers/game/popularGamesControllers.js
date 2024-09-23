import { Game } from "../../models/game.js";
import { Tournament } from "../../models/tournament.js"

export default function popularGames(req, res)
{
    const pGames = {}
    Tournament.findAll()
        .then(tours =>
            tours.forEach(tour =>
                Game.findByPk(tour.gameId)
                    .then(game =>
                    {
                        if (pGames[game.name]) pGames[game.name].played++;
                        pGames[game.name] = {
                            game, played: 1
                        }
                    }
                    )
            ))
    if (Object.keys(pGames).length > 0)
    {
        return res.status(200).json(pGames)
    }
    return res.status(404).json({ message: 'No popular games found' })
}