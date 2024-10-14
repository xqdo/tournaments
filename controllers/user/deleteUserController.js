import { User } from "../../models/user.js";
import bcrypt from "bcrypt";
import fs from 'fs';
import path from 'path';
export default function deleteUser(req, res)
{
    const { password } = req.body;
    const id = req.user.user

    User.findByPk(id).then((user) =>
    {
        if (bcrypt.compareSync(password, user.password))
        {
            if (user.profileImage)
            {
                const imagePath = path.resolve(user.profileImage);
                if (fs.existsSync(imagePath))
                {

                    fs.unlinkSync(imagePath);
                }
            }
            user.destroy()
            res.status(200).json({ message: "User deleted successfully" })
        }
        else
        {
            res.status(401).json({ message: "Incorrect password" })
        }

    }
    ).catch(err => res.status(500).json({ message: "Error: " + err }))
}