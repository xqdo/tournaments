import express from 'express';
import user from './routes/users.js'
import tour from './routes/tour.js'
const app = express()
const port = 8080

app.use('/user', user)
app.use('/tour', tour)

app.get('/', (req, res) => res.send('Hello !'))
app.listen(port, () => console.log(`listening on port ${port}!`))
