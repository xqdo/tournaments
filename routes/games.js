import express from 'express';
import { Game } from '../models/game.js';
const router = express.Router();

router.get('/', (req, res) =>
{
    Game.findAll().then(games => res.status(200).json(games));
})


export default router