import jwt from 'jsonwebtoken';
import { User } from '../auth/models/User.js';

async function verifyLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.KEY);
        const verifiedUser = await User.findOne({ username: decoded.username }).exec();
        if (!verifiedUser) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }

        req.user = {
            id: verifiedUser.id,
            username: verifiedUser.username,
            role: verifiedUser.role,
        };
        next();
    } catch (err) {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
}

export default verifyLoggedIn;