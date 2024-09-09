import bcrypt from 'bcrypt';
import { User } from "../users.js";

export default async function registerUser(req, res)
{
    const { username, password, email, o_provider, o_access, o_refresh, o_id, bio, name, profileImage } = req.body

    const idGen = async () =>
    {
        try
        {
            const id = Math.floor(Math.random() * 1000000000000000) % 100000000
            const ids = await User.findAll({
                attributes: ['id'],
            })
            if (ids.includes(id))
            {
                idGen();
            } {
                return id;
            }
        } catch (e)
        {
            console.log(e);

        }
    }
    const id = await idGen();
    bcrypt.hash(password, 12).then(pwd =>
    {
        bcrypt.compare("11211211", pwd).then(x => console.log(x)).catch(err => console.log(err))
        User.create({ id: id, username: username, password: pwd, email: email, o_provider: o_provider, o_access: o_access, o_refresh: o_refresh, o_id: o_id, bio: bio, name: name, profileImage: profileImage }).then(() =>
        {

        }).catch(err => console.error(err))
        res.status(201).send("user created successfully");
    }).catch(err => console.error(err));
    res.status(500)




}