const User = require('../../../models/User')
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        res.setHeader('Set-Cookie', "name=tung")
        const { username, password } = req.body;
        let user = await User.findOne({
            $or: [
                {
                    username: username,
                    password: password,
                    isDisable: false
                },
                {
                    email: username,
                    password: password,
                    isDisable: false
                }
            ]
        }).select('_id username fullName phoneNumber avatar email isAdmin')
        if (user) {
            if (user.isAdmin) {
                const token = jwt.sign({
                    _id: user._id,
                    isAdmin: user.isAdmin
                }, "mysecret", { expiresIn: '1d' });
                return res.send(JSON.stringify({
                    ...user._doc,
                    token: token
                }));
            }
            return res.status(403).send(JSON.stringify({
                message: "Not permission!",
                success: false
            }))
        }
        return res.status(401).send(JSON.stringify({
            message: "Wrong username , email or password!",
            success: false
        }))
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}