import express from 'express';
// import auth from "../middlewares/authmw.js";
import { Team, teamMembers } from '../models/team.js';
import JoinTeam from '../controllers/team/jointeamController.js';
import createTeam from '../controllers/team/createTeamController.js';
import dropTeam from '../controllers/team/dropteamController.js';
import auth from '../middlewares/authmw.js';
const router = express.Router();
router.use(express.json())
router.use(auth)

//join team 
//?????- Edit this -?????
router.get('/join/:link', JoinTeam)

//create team
//?????- Edit this -?????
router.post('/create', createTeam)

//list team members

//kick member

//member leave 

//edit team details

//list of all teams 

//get one team by name 

//drop team
router.delete('/', dropTeam)
//DO NOT CHANGE THIS 
export default router
