const express = require('express');
const morgan = require('morgan');
const db_interaction = require('./db_interaction.js');
const {check, validationResult} = require('express-validator');
const jwtSecret = require('./secretString.js');
const moment = require('moment');

const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = 3001;
app = new express();
// Logger
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('client'));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

// GET /api/vehicles
// Gives all the vehicles in the database
app.get('/api/vehicles', (req, res) => {
    db_interaction.getAllVehicles()
        .then((vehicles) => { res.json(vehicles); })
        .catch(() => { res.status(500).end(); });
});

// POST /api/login {username: , password: }
// Login from username and password
const expireTime = 60*60*24*7;//Seconds
app.post("/api/login", [check('username').notEmpty(), check('password').notEmpty()],
    (req, res)=>{
        let flag = 1;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        db_interaction.checkUserPassword(req.body.username, req.body.password)
            .then((tokenObj) => {
                const cookieStart= {id: tokenObj.userId, username: tokenObj.userName};
                const cookieObj = jsonwebtoken.sign(cookieStart, jwtSecret.secretString, {expiresIn: expireTime});
                res.cookie('token', cookieObj, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                //res.json(cookieStart);
                res.end()
            }).catch(
            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            () => new Promise((resolve) => {
                setTimeout(resolve, 1000)
            }).then(
                () => {res.status(401).end()}
            )
        );
    });

/* From now on, all API calls need a jwt token */
app.use(
    jwt({
        secret: jwtSecret.secretString,
        getToken: req => req.cookies.token
    })
);

// GET /api/user
// Checks if the user is authenticated
app.get("/api/user", (req, res)=>{
    res.json(
        req.user
    );
});
// POST /api/logout
// Logs a user out
app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// GET /api/rentals
// Gives all the rentals of an authenticated user
app.get('/api/rentals', (req, res) => {
    // req.user = { id: , username: , iat: , exp:  }

    db_interaction.getAllRentals(req.user.id)
        .then((rentals) => { res.json(rentals); })
        .catch(() => { res.status(500).end(); });
});

// Delete an existing rental, given its id
// Delete only if the rental belongs to the user, and
//             if it's a future one, so the start date is after the current

// DELETE /api/rentals/:id
app.delete("/api/rentals/:id", [check('id').notEmpty()],
    (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        db_interaction.rentalFromId(req.params.id)
            .then((result) => {
                let startDay = moment(result.startDay);

                // Checks on the rental
                if(result.userId !== req.user.id ||
                    moment().isSameOrAfter(startDay, "day")){
                    res.status(500).end();
                }
                else{
                    db_interaction.deleteRental(req.params.id)
                        .then(()=>{res.end();})
                        .catch(()=>{res.status(500).end();})
                }
                res.end();
            })
            .catch(() => { res.status(500).end(); });
});

// GET /api/rentals/past
// Gives the number of past rentals, to compute the discount
// Only fully finished rentals count
app.get('/api/rentals/past', (req, res) => {
    // req.user = { id: , username: , iat: , exp:  }

    db_interaction.getPastRentalsNumber(req.user.id)
        .then((rentals) => { res.json(rentals); })
        .catch(() => { res.status(500).end(); });
});
