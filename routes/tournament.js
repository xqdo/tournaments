import express from 'express';
import getAllTournaments from '../controllers/tournament/getAllTournamentsController.js';
import createTournament from '../controllers/tournament/createtournament.js';
import getTournamentBySlug from '../controllers/tournament/getTournamentBySlugController.js';
import auth from '../middlewares/authmw.js';
const router = express.Router();
router.use(express.json());
router.use(auth);
//get all tournaments
router.get('/', getAllTournaments);
//get tournament by slug
router.get('/:slug', getTournamentBySlug);
//create tournament
router.post("/create",createTournament)
//edit tournament

//delete tournament

//join tournament

//leave tournament

//get tournament participants

//get tournament Bracket 

//edit bracket

//add orginizer

export default router