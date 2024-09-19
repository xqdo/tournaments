import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export default function deleteUser(req, res)
{
    const { password } = req.body;
    const id = req.user.user

    User.findByPk(id).then((user) =>
    {
        if (bcrypt.compareSync(password, user.password))
        {
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