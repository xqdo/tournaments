import express from 'express';
import getAllTournaments from '../controllers/tournament/getAllTournamentsController.js';
const router = express.Router();

//get all tournaments
router.get('/', getAllTournaments);
//get tournament by slug
router.get('/:slug', getTournamentBySlug);
//create tournament

//edit tournament

//delete tournament

//join tournament

//leave tournament

//get tournament participants

//get tournament Bracket 

//edit bracket

//add orginizer

export default router