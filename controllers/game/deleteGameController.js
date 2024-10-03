import { Game } from "../../models/game.js";

export default function deleteGame(req, res) {
    const { id } = req.params;
    
    Game.destroy({ where: { id } })
        .then((deleted) => {
            if (deleted) {
                return res.status(200).send({ message: "Game deleted successfully." });
            } else {
                return res.status(404).send({ message: "Game not found." });
            }
        })
        .catch((err) => res.status(500).send({ message: "Error deleting game.", error: err }));
}
