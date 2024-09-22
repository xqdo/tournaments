import express from 'express';
// import auth from "../middlewares/authmw.js";
import JoinTeam from '../controllers/team/jointeamController.js';
import createTeam from '../controllers/team/createTeamController.js';
import dropTeam from '../controllers/team/dropteamController.js';
import auth from '../middlewares/authmw.js';
import listTeamMembers from '../controllers/team/listmembers.js';
import kickMember from '../controllers/team/kickmember.js';
import leaveTeam from '../controllers/team/leaveteam.js';
import patchTeam from '../controllers/team/editteamController.js';
import getAllTeams from '../controllers/team/showallteams.js';
import searchTeamsByName from '../controllers/team/getteam.js';
const router = express.Router();
router.use(express.json())
//join team 
//?????- Edit this -????? workiung 
router.patch('/join', JoinTeam)

//create team
//?????- Edit this -????? working 
router.post('/create', createTeam)

//list team members working 
router.get("/:teamName", listTeamMembers)
//kick member working
router.patch("/kickuser", kickMember)
//member leave working
router.patch("/leave",leaveTeam)
//edit team details working 
router.patch("/edit",patchTeam)
//list of all teams  not working well 
router.get('/teams',getAllTeams)
//get one team by namex not working well 
router.get('/team',searchTeamsByName)
//drop team working
router.post('/', dropTeam)
//DO NOT CHANGE THIS 
export default router
