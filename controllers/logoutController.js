

export default async function logout(req, res)
{
    const cookie = req.cookies
    if (!cookie) return res.sendStatus(204);
    res.clearCookie('jwt', { httpOnly: true, maxAge: 60 * 60 * 24 });
    res.sendStatus(204);
}
