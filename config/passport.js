// load all the things we need
var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy;
var http = require('http');
var request = require('request');
var models  = require('../app/models');


// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        models.User.findById(id)
            .then(function (user) {
                done(null, user.dataValues);
            })
    });
    // =========================================================================
    // Vkontakte ================================================================
    // =========================================================================
    passport.use(new VKontakteStrategy(
        {
            clientID:     5646716, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: 'TO4UtLdwdpGrtnvPZlWn',
            callbackURL:  "http://localhost:8080/auth/vkontakte/callback",
            scope: ['email'],
            profileFields: ['email', 'picture.type(large)']
        },
        function(req, token, refreshToken, profile, done) {
            req.user ? req.logout() : ''
            // asynchronous
            process.nextTick(function() {

                request('https://api.vk.com/method/users.get?user_id='+profile.id+'&v=5.23&fields=photo_100', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // check if the user is already logged in
                        var photos = JSON.parse(body).response;
                        if (!req.user) {
                            models.User.findOne({where: {'id' : profile.id }})
                                .then(function (user) {
                                    if (user && user!=null) {
                                        return done(null, user.dataValues);
                                    }else{
                                        models.User.create({
                                            id: profile.id,
                                            token: token,
                                            photos: photos ? photos[0].photo_100 : '/images/icon/unknown-user-pic.jpg',
                                            name: profile.displayName,
                                            type: 'vk',
                                            email: null,
                                        }).then(function (user) {
                                            notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                                            return done(null, user.dataValues);
                                        });
                                    }
                                }).catch(function (err) {
                                console.log('====err=====')
                                console.log(err)
                            });

                        } else {
                            models.User.create({
                                id: profile.id,
                                token: token,
                                photos: photos ? photos[0].photo_100 : '/images/icon/unknown-user-pic.jpg',
                                name: profile.displayName,
                                type: 'vk',
                                email: null,
                            }).then(function (user) {
                                notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                                return done(null, user);
                            });
                        }
                    }
                })
            });

        }
    ));
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'picture.type(large)', 'email'],
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        req.user ? req.logout() : ''
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user) {
                models.User.findOne({where: {'id' : profile.id }})
                    .then(function (user) {
                        if (user && user!=null) {
                            return done(null, user.dataValues);
                        }else{
                            models.User.create({
                                id: profile.id,
                                token: token,
                                photos: profile.photos ? profile.photos[0].value : '/images/icon/unknown-user-pic.jpg',
                                name: profile.displayName,
                                type: 'facebook',
                                email: (profile.emails[0].value || '').toLowerCase(),
                            }).then(function (user) {
                                notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                                return done(null, user.dataValues);
                            });
                        }
                    }).catch(function (err) {
                        console.log('====err=====')
                        console.log(err)
                    });

            } else {
                models.User.create({
                    id: profile.id,
                    token: token,
                    photos: profile.photos ? profile.photos[0].value : '/images/icon/unknown-user-pic.jpg',
                    name: profile.displayName,
                    type: 'facebook',
                    email: (profile.emails[0].value || '').toLowerCase(),
                }).then(function (user) {
                    notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                    return done(null, user);
                });
            }
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, tokenSecret, profile, done) {
        req.user ? req.logout() : ''
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user) {
                models.User.findOne({where: {'id' : profile.id }})
                    .then(function (user) {
                        if (user && user!=null) {
                            return done(null, user.dataValues);
                        }else{
                            models.User.create({
                                id: profile.id,
                                token: token,
                                photos: profile._json.picture,
                                name: profile.displayName,
                                type: 'twitter',
                                email: null,
                            }).then(function (user) {
                                notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                                return done(null, user.dataValues);
                            });
                        }
                    }).catch(function (err) {
                    console.log('====err=====')
                    console.log(err)
                });
            } else {
                models.User.create({
                    id: profile.id,
                    token: token,
                    photos: profile._json.picture,
                    name: profile.displayName,
                    type: 'twitter',
                    email: null,
                }).then(function (user) {
                    notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                    return done(null, user);
                });
            }
        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        req.user ? req.logout() : ''
        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {
                models.User.findOne({where: {'id' : profile.id }})
                    .then(function (user) {
                        if (user && user!=null) {
                            return done(null, user.dataValues);
                        }else{
                            models.User.create({
                                id: profile.id,
                                token: token,
                                photos: profile._json.picture,
                                name: profile.displayName,
                                type: 'gmail',
                                email: (profile.emails[0].value || '').toLowerCase(),
                            }).then(function (user) {
                                notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                                return done(null, user.dataValues);
                            }).catch(function (err) {
                                console.log(err)
                            });
                        }
                    }).catch(function (err) {
                    console.log('====err=====')
                    console.log(err)
                });
            } else {
                models.User.create({
                    id: profile.id,
                    token: token,
                    photos: profile._json.picture,
                    name: profile.displayName,
                    type: 'gmail',
                    email: (profile.emails[0].value || '').toLowerCase(),
                }).then(function (user) {
                    notification.emit('user', {id: 1, text: 'Мы рады приветствовать нового юзера '+ profile.displayName, title: 'New user'});
                    return done(null, user);
                });
            }
        });

    }));
};





/*
// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            models.User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                models.User.findOne({ 'email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
                // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                models.User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));*/
