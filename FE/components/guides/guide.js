/**
 * Created by semianchuk on 25.12.16.
 */

import React, { Component } from 'react'
import config from './../config'
var Steps = require('./steps');
var helper = require('./../helper');
var endPoint = helper.endPoint
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;

export default class Guidelist extends Component {
    constructor(props) {
        super(props);
        this.state= {
            legs: {},
            url: '',
            description: '',
            destination: '',
            endPoint:endPoint
        }
    }
    calcRoute(event){
        var end = this.state.endPoint;
        for(var i=0; i<end.length; i++){
            if(end[i].name == event.target.value){
                this.calculateAndDisplayRoute(end[i]);
            }
        }
    }
    initMap() {
        var self = this;
        setTimeout(function(){
            var map = new google.maps.Map(document.getElementById('map'),{
                zoom: 14,
                center: {
                    lat: Number(self.props.fulldata.lat),
                    lng: Number(self.props.fulldata.lng)
                }
            });
            directionsDisplay.setMap(map);
        },100)
    }
    calculateAndDisplayRoute(end) {
        var lat = Number(this.props.fulldata.lat),
            lng = Number(this.props.fulldata.lng),
            self=this;
        directionsService.route({
            origin: {lat: lat, lng: lng},  // Haight.
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                self.setState({
                    legs : response.routes[0].legs[0],
                    url : end.url,
                    description :  end.description,
                    destination : end
                })
                directionsDisplay.setDirections(response);
            } else {
                // window.alert('Directions request failed due to ' + status);
            }
        });
    }
    componentDidMount(){
        setTimeout(()=>{
            this.calcRoute({target: {value: 'bazarNew'}})
        },200)
    }
    render() {
        this.initMap();
        var end = this.state.endPoint
            .map(function(data){
                return   <option value={data.name}>{data.label}</option>
            })
        var distance = this.state.legs.distance ? this.state.legs.distance.value : ''
        var put =  <h4>Дорога до - {distance}</h4>
        return (
            <div>
                <div className="col-md-12" id="floating-panel">
                    <div  className="col-md-6">
                        <b>Начало: </b>
                        <select id="start" onChange={this.calcRoute.bind(this)}>
                            <option value="chicago, il">{this.props.fulldata.title}</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <b>Конечная точка: </b>
                        <select id="end" onChange={this.calcRoute.bind(this)}>
                            {end}
                        </select>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-6">
                        <h4>{ this.state.destination ? this.state.destination.label : ''} находится на расстоянии -{ this.state.legs.distance ? this.state.legs.distance.value : ''} м от {this.props.fulldata.title}</h4>
                        <Steps step={this.state.legs}></Steps>
                    </div>
                    <div className="col-md-6" id="map"></div>
                </div>
                <div className="col-md-12">
                    <hr/>
                </div>
                <div className="col-md-12">
                    <div className="col-md-6"><img src={config.domain + 'site-images/'+ this.state.url}/></div>
                    <div className="col-md-6">{this.state.description}</div>
                </div>
            </div>
        );
    }
};
