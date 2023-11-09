const jsonwebtoken = require('jsonwebtoken');

exports.verifyAdminToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send(JSON.stringify({
                message: 'UnAuthorization'
            }));
        }
        const decoded = jsonwebtoken.verify(token, 'mysecret');
        if (!decoded.isAdmin) {
            return res.status(403).send(JSON.stringify({
                message: 'Not permission'
            }));
        }
        req.userId = decoded._id;
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(403).json({
            message: 'UnAuthorization'
        });
    }
}

