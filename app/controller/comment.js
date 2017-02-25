/**
 * Created by semianchuk on 30.09.16.
 */
var Comment    = require('../models/comment.js'),
    User       = require('../models/user'),
    async      = require('async'),
    helper = require('../../config/helper.js');

var comments ={};

comments.getbyplaceid = function (obj, done) {
    Comment.find(obj, function(err, comment) {

        var calls = [];

        comment.forEach(function(data,index){
            calls.push(function(callback) {
                    if(data.type) {
                        User.findOne(helper.queryForMongo(data), function(err, user) {
                            var userObj = {
                                _id: data._id,
                                type: data.type,
                                email: data.email,
                                placeid: data.placeid,
                                dateModified: data.dateModified,
                                dateCreated: data.dateCreated,
                                data: data.data,
                                user: helper.queryForReturnUser(data, user)
                            }
                            callback(null, userObj);
                        });
                    }else{
                        callback(null, data);
                    }
                }
            )});

        async.parallel(calls, function(err, result) {
            if (err)
                return console.log(err);

            done(err, result);
        });


    }).sort( { dateCreated: -1 } );
}

comments.add = function (data, done) {
    var newComment      = new Comment();
    newComment.placeid  = data.placeid;
    newComment.userid   = data.userid;
    newComment.email    = data.email;
    newComment.data     = data.data;
    newComment.type     = data.type;
    newComment.save(function(err) {
        if (err)
            return done(null, err);

        return done(null, newComment);
    });
}
comments.remove = function (obj, done) {
    var obj = {_id: obj.data._id}
    Comment.remove(obj, function(err, comment) {
        if (!err) {
            return done(null, err);
        }
        else {
            return done(null, comment);
        }
    })
}

module.exports = comments;