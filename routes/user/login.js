
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { User } from '../users.js'; // Import User model

const SECRET_KEY = process.env.SECRET_KEY;

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
                    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

                    res.json({ token });
                })
                .catch(err =>
                {
                    res.status(500).json({ message: 'Error while comparing passwords' });
                });
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Server error' });
        });
}

