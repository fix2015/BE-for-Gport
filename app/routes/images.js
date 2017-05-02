var models  = require('../models');
var express = require('express');
var multer  = require('multer');
var shell = require('shelljs');

module.exports = function(app) {
    app.options('/api'); // enable pre-flight request for DELETE request
    var upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, callback) {
                var type = req.body.type || '';
                var path = 'assets/images/' + type + '/' + (req.body.PlaceId ? req.body.PlaceId : req.body.RoomId);
                shell.mkdir('-p', path);
                callback(null, path);
            },
            filename: function (req, file, callback) {
                var filename = req.body.ico == 'true' ? 'ico.' + file.originalname.replace(/.*?\./, '') : file.originalname
                callback(null, filename);
            }
        }),
        limits: {fileSize: 2000000},
        maxCount: 8,
    });

    app.post('/upload', upload.any(), function (req, res) {
        if (!req.files) {
            res.statusCode = 200;
            res.json({
                title: 'cant get image from this id',
                message: 'cant get image from this id',
                errors: 'files is empty',
                status: 'error'
            });
        } else {
            var image = {
                RoomId: req.body.RoomId ? req.body.RoomId : '',
                PlaceId: req.body.PlaceId ? req.body.PlaceId : '',
                name: req.files[0].originalname,
            }
            models.Image.create(image).then(function (result) {
                res.statusCode = 200;
                res.json({
                    title: 'Get data success',
                    image: result,
                    status: 'success'
                });
            });
        }
    });
    
    app.delete('/image/:id', function (req, res) {
        var id = req.params.id;
        req.assert('id', 'id is required').isInt();
        var errors = req.validationErrors();
        if (!errors) {
            models.Image.destroy({where: {id: id}})
                .then(function (deletedRecord) {
                    if (deletedRecord === 1) {
                        res.statusCode = 200;
                        res.json({
                            title: 'image id -' + id + ' deleted',
                            image: '',
                            status: 'success'
                        });
                    }
                    else {
                        res.statusCode = 404;
                        res.json({
                            title: 'record not found',
                            image: '',
                            status: 'error'
                        });
                    }

                })
                .catch(function (error) {
                    res.statusCode = 404;
                    res.json({
                        title: error,
                        image: '',
                        status: 'error'
                    });
                });
        } else {
            res.statusCode = 400;
            res.json({
                title: 'cant delete image from this id',
                message: 'cant delete image from this id',
                errors: errors,
                status: 'error'
            });
        }
    });
}