var models  = require('../models');
var express = require('express');

module.exports = function(app) {

    app.post('/:room_id/price/create', function (req, res) {
        models.Price.create({
            price: req.body.price,
            RoomId: req.params.room_id
        }).then(function () {
            res.redirect('/');
        });
    });

    app.get('/:room_id/price/:price_id/destroy', function (req, res) {
        models.Price.destroy({
            where: {
                id: req.params.price_id
            }
        }).then(function () {
            res.redirect('/');
        });
    });

    app.put('/price/:id', function (req, res){
        var id = req.params.id;
        req.assert('id', 'id is required').isInt();
        var errors = req.validationErrors();
        if( !errors){
            models.Price.find(
                {where: {
                    id: id
                }})
                .then(function (price) {
                    price.updateAttributes(req.body)
                        .then(function (update_room) {
                            res.statusCode = 200;
                            res.json({
                                title: 'price id -' + id + ' update',
                                room: update_room,
                                status: 'success'
                            });
                        }).catch(function (error) {
                        res.statusCode = 404;
                        res.json({
                            title: error,
                            room: '',
                            status: 'error'
                        });
                    })


                });
        }else {
            res.statusCode = 400;
            res.json({
                title: 'cant update price from this id',
                message: 'cant update price from this id',
                errors: errors,
                status: 'error'
            });
        }

    });

    app.put('/room/:id', function (req, res){
        var id = req.params.id;
        req.assert('id', 'id is required').isInt();
        var errors = req.validationErrors();
        if( !errors){
            models.Room.find(
                {where: {
                    id: id
                }})
                .then(function (room) {
                    room.updateAttributes(req.body)
                        .then(function (update_room) {
                            res.statusCode = 200;
                            res.json({
                                title: 'room id -' + id + ' update',
                                room: update_room,
                                status: 'success'
                            });
                        }).catch(function (error) {
                        res.statusCode = 404;
                        res.json({
                            title: error,
                            room: '',
                            status: 'error'
                        });
                    })


                });
        }else {
            res.statusCode = 400;
            res.json({
                title: 'cant update room from this id',
                message: 'cant update room from this id',
                errors: errors,
                status: 'error'
            });
        }

    });
}
