import express from 'express';
// import auth from "../middlewares/authmw.js";
import { Team, teamMembers } from '../models/team.js';
import JoinTeam from '../controllers/jointeamController.js';
import createTeam from '../controllers/createTeamController.js';
const router = express.Router();
router.use(express.json())
// router.use(auth)


// THE CRUD API
// DON'T USE JUST '/' ROUTES 
//POST
router.post('/join/:link', JoinTeam)
router.post('/create', createTeam)
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

//DO NOT CHANGE THIS 
export default router
