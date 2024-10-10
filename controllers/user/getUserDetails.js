import { User } from "../../models/user.js";


export default async function getUserDetails(req, res)
{
    if (req.params.username)
    {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } })
        const resp = {}
        if (!user)
        {
            resp.error = "User not found";
            res.status(404).json(resp);
            return;
        }
        resp.username = user.username;
        resp.email = user.email;
        resp.team = user.team;
        resp.role = user.role;
        resp.name = user.name;
        resp.profileImage = user.profileImage;
        return res.status(200).json(resp);
    }
    else if (req.user)
    {
        const user = await User.findByPk(req.user.id);
        const resp = {}
        if (!user)
        {
            resp.error = "you are not logged in";
            res.status(404).json(resp);
            return;
        }
        resp.username = user.username;
        resp.email = user.email;
        resp.team = user.team;
        resp.role = user.role;
        resp.name = user.name;
        resp.profileImage = user.profileImage;
        return res.status(200).json(resp);
    }
    res.status(500).send("something went wrong")
}