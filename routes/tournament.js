import express from 'express';
import getAllTournaments from '../controllers/tournament/getAllTournamentsController.js';
import createTournament from '../controllers/tournament/createtournament.js';
import getTournamentBySlug from '../controllers/tournament/getTournamentBySlugController.js';
import auth from '../middlewares/authmw.js';
import joinTournament from '../controllers/tournament/jointournaments.js';
import editTournament from '../controllers/tournament/editTournament.js';
import deleteTournament from '../controllers/tournament/deleteTournament.js';
import leaveTournament from '../controllers/tournament/leaveTournament.js';
import getAllParticipants from '../controllers/tournament/getAllParticipants.js';
import addOrginizer from '../controllers/tournament/addOrginizer.js';
const router = express.Router();
router.use(express.json());
router.use(auth);
//get all tournaments
router.get('/', getAllTournaments);
//get tournament by slug
router.get('/:slug', getTournamentBySlug);
//create tournament
router.post("/create", createTournament)
//edit tournament
router.patch('/:id', editTournament)
//delete tournament
router.delete('/:id', deleteTournament)
//join tournament
router.post("/join/:tournamentLink", joinTournament)
//leave tournament
router.get('/leave/:id', leaveTournament)
//get tournament participants
router.get('/participants/:tournamentId', getAllParticipants)
//edit bracket
router.patch('/:tournamentId/rounds/:roundNumber/matches/:matchId')
//add orginizer
router.post('/addOrginizer/:tournamentId/', addOrginizer)
export default router