var express = require('express');

module.exports = (User) => {
    var router = express.Router();

    /* GET users listing. */
    router.get('/', function(req, res, next) {
        res.send('respond with a resource');
    });

    /* POST user creation */
    router.post('/', async (req, res) => {
        console.log('Received POST request:', req.body);
        try {
            if (!req.body.firstName || !req.body.lastName) {
                return res.status(400).json({ error: 'firstName and lastName are required' });
            }
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
            console.log('Created user:', user.toJSON());
            res.status(201).json(user);
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(400).json({ error: err.message });
        }
    });

    return router;
};
