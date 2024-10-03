import express from 'express';
import getAllGames from '../controllers/game/getAllGamesController.js';
import editGame from '../controllers/game/editGameController.js';
import deleteGame from '../controllers/game/deleteGameController.js';
import createNewGame from '../controllers/game/createNewGameController.js';
import popularGames from '../controllers/game/popularGamesControllers.js';
const router = express.Router();
router.use(express.json());
//get all games working
router.get('/', getAllGames);
//edit game info working
router.patch('/:id', editGame);
//delete game working
router.delete('/:id', deleteGame);
//add game working
router.post('/', createNewGame);
//populare games  working
router.get('/popular', popularGames);

export default router