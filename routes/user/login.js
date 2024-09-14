
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { User } from '../users.js'; // Import User model

import { configDotenv } from 'dotenv';
configDotenv()

const ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const REFRESH_KEY = process.env.SECRET_REFRESH_KEY;

// Login route
export default async function login(req, res)
{
    const { username, password } = req.body;

    // Find user by username
    User.findOne({ where: { username } })
        .then(user =>
        {
            if (!user)
            {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify password
            bcrypt.compare(password, user.password)
                .then(isMatch =>
                {
                    if (!isMatch)
                    {
                        return res.status(400).json({ message: 'Invalid credentials' });
                    }

                    // Generate JWT token
                    const access_token = jwt.sign({ username: user.username }, ACCESS_KEY, { expiresIn: '32s' });
                    const refresh_token = jwt.sign({ username: user.username }, REFRESH_KEY, { expiresIn: '1d' });

                    res.json({ token });
                })
                .catch(err =>
                {
                    console.log(password, user.password, SECRET_KEY);

                    res.status(500).json({ message: 'Error while comparing passwords' + err });
                });
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Server error' });
        });
}

