import express from 'express';
import user from './routes/users.js'
import team from './routes/teams.js'
import game from './routes/games.js'

const app = express()
const port = 8080

const logging = (req, res, next) =>
{
    console.log(`${req.method} - ${req.url}`);
    next();
}

app.use(logging)
app.use('/user', user)
app.use('/team', team)
app.use(express.json())
app.get('/', (req, res) => res.send('bye !'))
app.listen(port, () => console.log(`listening on port ${port}!`))
