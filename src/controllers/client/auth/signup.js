const User = require("../../../models/User");

exports.signup = async (req, res) => {
    try {
        const { username, password, fullName, email, phoneNumber, } = req.body;
        let isDuplicateUserName = await User.findOne({ username: username })
        let isDuplicateEmail = await User.findOne({ email: email })
        if (isDuplicateUserName) {
            return res.status(400).send(JSON.stringify({
                message: "Duplicate User Name",
                success: false
            }))
        }
        if (isDuplicateEmail) {
            return res.status(400).send(JSON.stringify({
                message: "Duplicate Email",
                success: false
            }))
        }
        const user = new User({
            username: username,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            isAdmin: false,
            avatar: 'https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png',
            isDisable: false,
        })
        const result = await user.save();
        if (result) {
            return res.sendStatus(200);
        }
        return res.status(400).send(JSON.stringify({
            message: "Sorry system is Error!",
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