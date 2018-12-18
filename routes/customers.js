const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Customer = require('../models/Customer');
const config = require('../config');


module.exports = server => {
    //GET CUSTOMER
    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({});
            res.send(customers);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });



    //GET SINGLE CUSTOMER
    server.get('/customers/:id', async (req, res, next) => {
        try {
            const customers = await Customer.findById(req.params.id);
            res.send(customers);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`thiere is no customer with id of ${req.params.id} `));
        }
    });




    //ADD CUSTOMER
    server.post('/customers', rjwt({secret: config.JWT_SECRET}) , async (req, res, next) => {
        // CHECK FOR JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application/json"));
        }

        const {
            name,
            email,
            balance
        } = req.body;
        const customer = new Customer({
            name,
            /*SAME AS name: name*/
            email,
            balance

        });

        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });





    //THIS IS UPDATE REQUEST
    server.put('/customers/:id', rjwt({secret: config.JWT_SECRET}), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }

        try {
            const customer = await Customer.findOneAndUpdate({
                    _id: req.params.id
                },
                req.body
            );
            res.send(200);
            next();
        } catch (err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with the id of ${req.params.id}`
                )
            );
        }
    });





    //DELETE CUSTOMER
    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndRemove({
                _id: res.params.id
            });
            res.send(204);
            next();
        } catch (error) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with the id of ${res.params.id}`
                )
            );
        }
    })











}