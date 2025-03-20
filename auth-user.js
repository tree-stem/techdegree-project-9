'use-strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('./models');

// Export authenticateUser function 
exports.authenticateUser = async (req, res, next) => {
    let message;

    // Add req content to authentication header
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                message = `Authentication failed for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.emailAddress}`;
        }
    } else {
        message = `Auth header not found`;
    }

    // Log message if authentication fails
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};