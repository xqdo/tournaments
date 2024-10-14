import express from 'express';
import user from './routes/users.js'
import team from './routes/teams.js'
import game from './routes/games.js'
import tour from './routes/tournament.js'
import cors from 'cors'
import { whitelist } from './config/roles_list.js';
import morgan from 'morgan';

const app = express()
const port = 8080



var corsOptionsDelegate = function (req, callback)
{
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1)
    {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else
    {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// app.use(logging)
app.use('/game', game)
app.use('/user', user)
app.use('/team', team)
app.use('/tour', tour)
app.use(express.json())
app.get('/', (req, res) => res.send('bye !'))
app.listen(port, () => console.log(`listening on port ${port}!`))
