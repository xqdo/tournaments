import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import { User } from '../models/user.js';
configDotenv()
export default function auth(req, res, next)
{
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) =>
    {
        if (err) return res.sendStatus(403);
        User.findByPk(user.user).then(founduser =>
        {
            if (!founduser) return res.sendStatus(401);
            req.user = user;
            next();
        })


    });
}