const errors = require('restify-errors');
const Customer = require('../models/Customer');


module.exports = server => {
    try {
        server.get('/customers', async (req, res, next) => {
            const customers = await Customer.find({});
            res.send(customers);
            next();
        })
    } catch (err) {
        return next (new errors.InvalidContentError(err));
    }
}