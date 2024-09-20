import express from 'express';
// import auth from "../middlewares/authmw.js";
import { Team, teamMembers } from '../models/team.js';
import JoinTeam from '../controllers/team/jointeamController.js';
import createTeam from '../controllers/team/createTeamController.js';
import dropTeam from '../controllers/team/dropteamController.js';
import auth from '../middlewares/authmw.js';
const router = express.Router();
router.use(express.json())
// router.use(auth)


// THE CRUD API
// DON'T USE JUST '/' ROUTES 
//POST
router.get('/join/:link', auth, JoinTeam)
router.post('/create', auth, createTeam)
//GET
router.get('/', (req, res) =>
{
    Team.findAll().then(teams => res.status(200).json(teams));
})

router.get('/members', (req, res) =>
{
    teamMembers.findAll().then(teamMembers => res.status(200).json(teamMembers));
})


//PUT

//PATCH

//DELETE
router.delete('/', auth, dropTeam)
//DO NOT CHANGE THIS 
export default router
