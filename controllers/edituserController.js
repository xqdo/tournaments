import bcrypt from 'bcrypt';
import { User } from "../models/user.js";

export default function patchUser(req, res)
{
    const { username, name, oldpassword, newPassword, bio } = req.body;
    const id = req.user.user
    console.log(req.user);

    // Find the user by username
    User.findByPk(id)
        .then(existingUser =>
        {
            if (!existingUser)
            {
                // If the user is not found, respond with an error
                return res.status(404).send("User not found");
            }

            // Prepare an object to store the fields to update
            const updates = {};

            // Conditionally update fields if provided
            if (name) updates.name = name;
            if (username) updates.username = username;
            if (bio) updates.bio = bio;

            // If password is provided, hash it before updating
            if (newPassword)
            {
                bcrypt.compare(oldpassword, existingUser.password).then((state) =>
                {
                    if (state)
                    {
                        bcrypt.hash(newPassword, 12).then(hashedPassword =>
                        {
                            updates.password = hashedPassword;
                        });
                    } else
                    {
                        return res.status(400).send("Old password is incorrect");
                    }
                }).catch(err => console.log(err))

            }
            // Wait for password hash (if applicable) and then update user
            User.update(updates, { where: { username } }).then(() =>
            {
                return res.status(206).send("done updating this :" + JSON.stringify(updates))
            }).catch(err =>
            {
                console.error("Error finding user:", err);
                res.status(500).send("Error finding user");
            })
        })
        .catch(err =>
        {
            console.error("Error finding user:", err);
            res.status(500).send("Error finding user");
        });
}