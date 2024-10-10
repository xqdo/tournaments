import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { User } from '../models/user.js';

configDotenv();

export default function auth(req, res, next)
{
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) =>
    {
        if (err) return res.sendStatus(403);

        // Access user ID from the decoded token
        const userId = decoded.user;
        console.log(userId);
        // Changed from decoded.id to decoded.user
        User.findByPk(userId)
            .then(foundUser =>
            {
                if (!foundUser) return res.sendStatus(401);
                req.user = foundUser;
                next();
            })
            .catch(err =>
            {
                console.error(err);
                return res.status(500).send(err.toString()); // Internal Server Error
            });
    });
}
