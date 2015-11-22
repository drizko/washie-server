// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt');

mongoose.connect('mongodb://node:node@ds057244.mongolab.com:57244/washie-db'); // connect to our database

// Adding models that we're going to use
var User        = require('./app/models/user');
var Washer      = require('./app/models/washer');
var Job         = require('./app/models/job');
var Transaction = require('./app/models/transaction');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of the user model
        user.firstName  = req.body.firstName;       // set the users name (comes from the request)
        user.lastName   = req.body.lastName;        // set the users lastName (comes from the request)
        user.email      = req.body.email;           // set the users email (comes from the request)
        user.mobile     = req.body.mobile;          // set the users mobile (comes from the request)

        // password hashing
        bcrypt.genSalt(8, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                user.password = hash;
                // save the user and check for errors
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'User created!' });
                });
            });
        });
    })
    .get(function(req, res) {
        User.find(function(err, users) {
            if(err)
                res.send(err);

            res.json(users);
        });
    });

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);

            res.json(user);
        });
    })

    // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the users info

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' })
            });
        });
    })

    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted User' })
        });
    })

// on routes that end in /washers
// ----------------------------------------------------
router.route('/washers')

    // create a washer (accessed at POST http://localhost:8080/api/washers)
    .post(function(req, res) {

        var washer = new Washer();      // create a new instance of the washer model
        washer.firstName  = req.body.firstName;     // set the washers firstName (comes from the request)
        washer.lastName   = req.body.lastName;      // set the washers lastName (comes from the request)
        washer.email      = req.body.email;         // set the washers email (comes from the request)
        washer.mobile     = req.body.mobile;        // set the washers mobile (comes from the request)
        washer.password   = req.body.password;      // set the washers password (comes from the request)

        // save the washer and check for errors
        washer.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Washer created!' });
        });
    })
    .get(function(req, res) {
        Washer.find(function(err, washers) {
            if(err)
                res.send(err);

            res.json(washers);
        });
    });

// on routes that end in /washers/:washer_id
// ----------------------------------------------------
router.route('/washers/:washer_id')

    // get the washer with that id (accessed at GET http://localhost:8080/api/washers/:washer_id)
    .get(function(req, res) {
        Washer.findById(req.params.washer_id, function(err, washer) {
            if (err)
                res.send(err);

            res.json(washer);
        });
    })

    // update the washer with this id (accessed at PUT http://localhost:8080/api/washers/:washer_id)
    .put(function(req, res) {

        // use our washer model to find the washer we want
        Washer.findById(req.params.washer_id, function(err, washer) {

            if (err)
                res.send(err);

            washer.name = req.body.name;  // update the washers info

            // save the washer
            washer.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Washer updated!' })
            });
        });
    })

    .delete(function(req, res) {
        Washer.remove({
            _id: req.params.washer_id
        }, function(err, washer) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted Washer' })
        });
    })

// on routes that end in /jobs
// ----------------------------------------------------
router.route('/jobs')

    // create a job (accessed at POST http://localhost:8080/api/jobs)
    .post(function(req, res) {

        var job = new Job();        // create a new instance of the job model
        job.user_email      = req.body.user_email;    // set the jobs user_email (comes from the request)
        job.status          = req.body.status;        // set the jobs status (comes from the request)
        job.vehicle_type    = req.body.vehicle_type;  // set the jobs vehicle_type (comes from the request)
        job.location        = req.body.location;      // set the jobs location (comes from the request)
        job.zip_code        = req.body.zip_code;      // set the jobs zip_code (comes from the request)
        job.wash_level      = req.body.wash_level;    // set the jobs wash_level (comes from the request)
        job.price           = req.body.price;         // set the jobs price (comes from the request)

        // save the job and check for errors
        job.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Job created!' });
        });
    })
    .get(function(req, res) {
        Job.find(function(err, jobs) {
            if(err)
                res.send(err);

            res.json(jobs);
        });
    });

// on routes that end in /jobs/:job_id
// ----------------------------------------------------
router.route('/jobs/:job_id')

    // get the job with that id (accessed at GET http://localhost:8080/api/jobs/:job_id)
    .get(function(req, res) {
        Job.findById(req.params.job_id, function(err, job) {
            if (err)
                res.send(err);

            res.json(job);
        });
    })

    // update the job with this id (accessed at PUT http://localhost:8080/api/jobs/:job_id)
    .put(function(req, res) {

        // use our job model to find the job we want
        Job.findById(req.params.job_id, function(err, job) {

            if (err)
                res.send(err);

            job.name = req.body.name;  // update the jobs info

            // save the job
            job.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Job updated!' })
            });
        });
    })

    .delete(function(req, res) {
        Job.remove({
            _id: req.params.job_id
        }, function(err, job) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted Job' })
        });
    })


// on routes that end in /transactions
// ----------------------------------------------------
router.route('/transactions')

    // create a transaction (accessed at POST http://localhost:8080/api/transactions)
    .post(function(req, res) {

        var transaction = new Transaction();      // create a new instance of the transaction model
        transaction.user_email      = req.body.user_email;      // set the transaction user_email (comes from the request)
        transaction.washer_email    = req.body.washer_email;    // set the transaction washer_email (comes from the request)
        transaction.vehicle_type    = req.body.vehicle_type;    // set the transaction vehicle_type (comes from the request)
        transaction.price_paid      = req.body.price_paid;      // set the transaction price_paid (comes from the request)
        transaction.vehicle_type    = req.body.vehicle_type;    // set the transaction vehicle_type (comes from the request)
        transaction.location        = req.body.location;        // set the transaction location (comes from the request)
        transaction.wash_level      = req.body.wash_level;      // set the transaction wash_level (comes from the request)

        // save the transaction and check for errors
        transaction.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Transaction created!' });
        });
    })
    .get(function(req, res) {
        Transaction.find(function(err, transactions) {
            if(err)
                res.send(err);

            res.json(transactions);
        });
    });

// on routes that end in /transactions/:transaction_id
// ----------------------------------------------------
router.route('/transactions/:transaction_id')

    // get the transaction with that id (accessed at GET http://localhost:8080/api/transactions/:transaction_id)
    .get(function(req, res) {
        Transaction.findById(req.params.transaction_id, function(err, transaction) {
            if (err)
                res.send(err);

            res.json(transaction);
        });
    })

    // update the transaction with this id (accessed at PUT http://localhost:8080/api/transactions/:transaction_id)
    .put(function(req, res) {

        // use our transaction model to find the transaction we want
        Transaction.findById(req.params.transaction_id, function(err, transaction) {

            if (err)
                res.send(err);

            transaction.name = req.body.name;  // update the transactions info

            // save the transaction
            transaction.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Transaction updated!' })
            });
        });
    })

    .delete(function(req, res) {
        Transaction.remove({
            _id: req.params.transaction_id
        }, function(err, transaction) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted Transaction' })
        });
    })

// on routes that end in login
// on routes that end in /transactions
// ----------------------------------------------------
router.route('/login')

    // get the login info (accessed at GET http://localhost:8080/api/login)
    .post(function(req, res) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                res.send(err);
            }

            // Load hash from your password DB.
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result){
                    res.json({ message: "Authentication Passed!" })
                } else {
                    res.json({ message: "Authentication Failed" })
                }
            });
        })
    })



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
