const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth')
const config = require('../config');


module.exports = server =>{
    // Register User
    server.post('/register', (req, res, next)=>{
        const {email, password} = req.body;
        const user = new User({
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, async (err, hash)=>{
                user.password = hash;

                try {
                    const newUser = await user.save();
                    res.send(201)
                    next();
                } catch (error) {
                    return next(new errors.InternalError(error.message));
                }
            })
        })
    });

        // Auth User
    server.post('/auth', async (req, res, next)=>{
        const {email, password} = req.body;

        try {
            //AUTINTICATE USER
            const user = await auth.authenticate(email, password);
            
            //CREATE TOKEN
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });

            //RESPOND WITH TOKEN
            const {iat, exp} = jwt.decode(token);
            res.send({iat, exp, token});

        } catch (err) {
            // User unauthorized 
            return next (new errors.UnauthorizedError(err));
        }
    })
}