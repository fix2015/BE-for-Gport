var models  = require('../models');
var express = require('express');

module.exports = function(app) {

    app.get('/edit/:id', function(req, res) {
        req.user ? res.locals.userSettings = req.user : res.locals.userSettings = { type: 'guest', name:'guest', email:'guest', id:'guest'};
        res.statusCode = 200;
        res.render('index.ejs');
    });

    app.post('/edit/get/:place_id', function (req, res) {
        var id = req.params.place_id;
        models.Place.findById(id,{
            include: [
                {model: models.Room,
                    include: [
                        {model: models.Price},
                        {model: models.Image},
                    ]
                },
                {model: models.Comment},
                {model: models.Image}
            ]
        })
            .then(function (place) {
                res.statusCode = 200;
                res.json({
                    title: 'Get data by id',
                    place: place,
                    status: 'success'
                });
            });
    })

}
