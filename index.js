import express from 'express';
import user from './routes/users.js'
import tour from './routes/tour.js'

const app = express()
const port = 8080

const logging = (req, res, next) =>
{
    console.log(`${req.method} - ${req.url}`);
    next();
}

app.use(logging)
app.use('/user', user)
app.use('/tour', tour)

app.get('/', (req, res) => res.send('bye !'))
app.listen(port, () => console.log(`listening on port ${port}!`))
