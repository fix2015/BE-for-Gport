/**
 * Created by semianchuk on 06.06.16.
 */


var React = require('react');
var config = require('./../config');
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var helper = require('../helper');
var endPoint = helper.endPoint;
import MainNav from "../main/MainNav"
import Social from "../social/social"

var Infrastructure = React.createClass({
    getInitialState(){
        return {}
    },
    initMap() {
        var self = this;
        setTimeout(function () {
            var map = new GMaps({
                el: '#map',
                lat: 46.12363029999999,
                lng: 32.29127140000003
            });
            map.removeMarkers();
            self.addMarkers(map, helper.endPoint);
        }, 1000)

    },
    addMarkers(map, endPoints) {
        var self = this;
        var endPoint = endPoints
            .filter(function (data) {
                return true
            })
            .map(function (data) {
                var marker = map.addMarker({
                    lat: data.lat,
                    lng: data.lng,
                    click: function (e) {
                        //alert('You clicked in this marker');
                    },
                    infoWindow: {
                        content: self.infoWindow(data)
                    }
                }).setIcon(config.domain + 'images/icon/' + data.icon);
                gmarkers.push(marker);
            })
        //new MarkerClusterer(map, gmarkers);
    },
    infoWindow(data){
        return '<div class="col-md-12 map-list-preview" style="text-align: left">' +
            '<h4>' + data.label + '</h4>' +
            '<span>' + data.description + '</span>' +
            '</div>'
    },
    componentDidMount(){

    },
    render() {
        this.initMap();
        return (
            <div className="infrustractura">
                <div className="col-md-12 header-img">
                    <Social></Social>
                    <img className="main-img" src={config.domain + 'site-images/header-img.jpg'}/>
                </div>
                <div className="col-md-12">
                    <MainNav type="" typeFilter=""></MainNav>
                </div>
                <div className="col-md-12  map-infrustractura">
                    <div id="map"></div>
                </div>
            </div>
        );
    }
});

module.exports = Infrastructure;