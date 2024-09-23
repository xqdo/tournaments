import express from 'express';
import getAllGames from '../controllers/game/getAllGamesController.js';
import editGame from '../controllers/game/editGameController.js';
import deleteGame from '../controllers/game/deleteGameController.js';
import createNewGame from '../controllers/game/createNewGameController.js';
import popularGames from '../controllers/game/popularGamesControllers.js';
const router = express.Router();

//get all games 
router.get('/', getAllGames);
//edit game info 
router.patch('/:id', editGame);
//delete game
router.delete('/:id', deleteGame);
//add game 
router.post('/', createNewGame);
//populare games 
router.get('/popular', popularGames);

export default router