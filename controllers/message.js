const express = require('express');
const router = express.Router();

const db = require('../models');

router.post('/', async (req, res) => {
    const user = req.session.currentUser;

    if (!user) {
        res.render('sign-up', {
            myMessage: req.body.message
        });
    } else {
        try {
            req.body.user = user.id;
            const message = await db.Message.create(req.body);
            db.User.findByIdAndUpdate(
                req.body.user,
                {
                    $push: {
                        messages: message
                    }
                },
                (err, updatedItem) => {
                    if (err) {
                        return res.send(err);
                    }

                    res.redirect('/profile');
                });
        } catch (error) {
            console.log('Internal server error!');
        }
    }
});

module.exports = router;