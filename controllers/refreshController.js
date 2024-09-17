
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
configDotenv()

const ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_SECRET_KEY;

// Login route
export default async function refresh(req, res)
{
    const cookie = req.cookies
    if (!cookie) return res.sendStatus(401);
    const token = cookie.jwt;
    jwt.verify(token, REFRESH_KEY, (err, user) =>
    {
        if (err) return res.sendStatus(403);
        const access_token = jwt.sign({ username: user.username }, ACCESS_KEY, { expiresIn: '32s' });
        req.user = user;
        res.json({ access_token })
    });
}

