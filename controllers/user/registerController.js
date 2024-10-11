import bcrypt from 'bcrypt';
import { User } from "../../models/user.js";

export default async function registerUser(req, res) {
    const { username, password, email, bio, name, profileImage } = req.body;
    
    if (!username && !name) {
        return res.status(400).send('Provide credentials');
    }

    // Check if the username already exists
    const userExists = await User.findOne({ where: { username: username } });
    
    if (userExists) {
        return res.status(400).send('Username is already taken');
    }

    // Function to generate a unique user ID
    const idGen = async () => {
        try {
            const id = Math.floor(Math.random() * 1000000000000000) % 100000000;
            const ids = await User.findAll({
                attributes: ['id'],
            });
            
            if (ids.map(user => user.id).includes(id)) {
                return await idGen();  // Recursively generate a new ID if collision occurs
            } else {
                return id;
            }
        } catch (e) {
            console.log(e);
        }
    };

    const id = await idGen();

    // Hash the password and create the user
    bcrypt.hash(password, 12).then(async (hashedPassword) => {
        try {
            await User.create({
                id: id,
                username: username,
                password: hashedPassword,
                email: email,
                bio: bio,
                name: name,
                profileImage: profileImage
            });

            res.status(201).send("User created successfully");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error creating user");
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error hashing password");
    });
}
