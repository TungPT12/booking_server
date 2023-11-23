const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

exports.isAccessToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).send(JSON.stringify({
                message: 'UnAuthorization'
            }));
        }
        const decoded = jwt.verify(token, 'mysecret');
        const userId = decoded._id;
        let user = await User.findOne({ _id: userId }).select('_id username fullName phoneNumber avatar email isAdmin')

        if (user) {
            if (user.isAdmin) {
                return res.send(JSON.stringify({
                    ...user._doc,
                    success: true,
                }));
            }
        }
        return res.status(403).send(JSON.stringify({
            success: false
        }))
    } catch (error) {
        return res.status(401).send(JSON.stringify({
            message: 'UnAuthorization'
        }));
    }
}