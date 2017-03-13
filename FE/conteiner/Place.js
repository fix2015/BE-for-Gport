/**
 * Created by semianchuk on 07.04.16.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
var helper = require('./../components/helper');
var config = require('./../components/config');
var Link = require('react-router').Link;
import FotoFolder from "../components/place/FotoFolder"
import MainTable from "../components/main/mainTable"
import Comments from "../components/comments/Comments"
import store from "../store"
import SmallInformationBoard from "../components/Place/smallInformationBoard"
import { setPlaceProfileUrl, setPlaceId, setPlaceParams } from "../actions/placeActions"
import { setUserParams } from "../actions/userActions"
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var Steps = require('./../components/guides/steps');
import  Guidelist  from './../components/guides/guide'

var endPoint = helper.endPoint

class Place extends Component {
    constructor(props) {
        super(props);

        this.props.store.dispatch(setUserParams(window.userSettings));
        this.state={
            main:true,
            comments:false,
            foto:false,
            maps:false,
            fulldata: {},
            legs: {},
            url: '',
            description: '',
            destination: '',
            endPoint:endPoint,
            mainImg:config.domain + 'images/default.png',
        }
    }
    getDataFromJSON(){
        var url =  config.domain + 'place/get/'+this.props.params.placeId,
            self=this;
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            success: function (obj) {
                if(obj.status == 'success'){
                    var dataHouse = obj.place;
                    var placeParams = {
                        place:dataHouse,
                        description:dataHouse.description,
                    }
                    self.setState({
                        fulldata:dataHouse,

                    })
                    setTimeout(function(){
                        self.calcRoute({target: {value: 'bazarNew'}})
                    },200)
                    self.props.store.dispatch(setPlaceParams(placeParams));
                }else{
                    console.log(obj.errors)
                }
            }
        })
    }
    componentDidMount() {
        this.props.store.dispatch(setPlaceId(this.props.params.placeId));
        this.getDataFromJSON();
        const hashParts = window.location.hash.split('#');
        if(hashParts) this.changeAction(hashParts[1]);
        let img = new Image();
        img.onload = function(){
            this.setState({
                mainImg : config.domain + 'images/zport/'+ this.props.params.placeId + '/ico.jpg'
            })
        }.bind(this);
        img.src = config.domain + 'images/zport/'+ this.props.params.placeId + '/ico.jpg';
    }
    changeAction(list){
        if(list=='maps'){
            this.setState({
                main:false,
                comments:false,
                foto:false,
                maps:true
            })
        }else if(list=='comments'){
            this.setState({
                main:false,
                comments:true,
                foto:false,
                maps:false
            })
        }else if(list=='foto'){
            this.setState({
                main:false,
                comments:false,
                foto:true,
                maps:false
            })
        }else{
            this.setState({
                main:true,
                comments:false,
                foto:false,
                maps:false
            })
        }

    }
    initMap() {
        var self = this;
        setTimeout(function(){
            var map = new google.maps.Map(document.getElementById('map'),{
                zoom: 14,
                center: {
                    lat: Number(self.state.fulldata.lat),
                    lng: Number(self.state.fulldata.lng)
                }
            });
            directionsDisplay.setMap(map);
        },100)
    }
    calculateAndDisplayRoute(end) {
        var lat = Number(this.state.fulldata.lat),
            lng = Number(this.state.fulldata.lng),
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
                //window.alert('Directions request failed due to ' + status);
            }
        });
    }
    calcRoute(event){
        var end = this.state.endPoint;
        for(var i=0; i<end.length; i++){
            if(end[i].name == event.target.value){
                this.calculateAndDisplayRoute(end[i]);
            }
        }
    }
    render() {
        let place = this.props.place;
        let end = this.state.endPoint
            .map(function(data){
                return   <option value={data.name}>{data.label}</option>
            })
        let distance = this.state.legs.distance ? this.state.legs.distance.value : '';

        return (
            <div>
                <div className="col-md-12 place-title">
                    <ol className="breadcrumb text-left" onClick={this.handleSubmit}>
                        <li className="active">
                            <Link to={'/'}>
                                Главная
                            </Link>
                        </li>
                        <li>
                            <Link to={'/place/'+place.id}>
                                {place.title}
                            </Link>
                        </li>
                    </ol>
                </div>
                <div className="location-block col-md-12">
                    <div className="col-md-4">
                            <a className="fancyimage" data-fancybox-group="group" href={this.state.mainImg}>
                                <img className='img-responsive' src={this.state.mainImg}/>
                            </a>
                    </div>
                    <div className="col-md-8">
                        <SmallInformationBoard data={place} edit="false"></SmallInformationBoard>
                    </div>
                </div>
                <div className="col-md-12 text-left">
                    {place.description}

                </div>
                <div className="col-md-12 tabbable">
                    <ul className="nav nav-tabs">
                        <li className={this.state.main ? 'active' : ''} onClick={this.changeAction.bind(this, 'main')}><a data-toggle="tab" href="#main">Главная {this.state.listNav}</a></li>
                        <li className={this.state.comments ? 'active' : ''} onClick={this.changeAction.bind(this, 'comments')}><a data-toggle="tab" href="#comments">Коментарии</a></li>
                        <li className={this.state.foto ? 'active' : ''} onClick={this.changeAction.bind(this, 'foto')}><a data-toggle="tab" href="#foto">Фотоальбом</a></li>
                        <li className={this.state.maps ? 'active' : ''} onClick={this.changeAction.bind(this, 'maps')}><a data-toggle="tab" href="#maps">Путеводитель</a></li>
                    </ul>
                    <div className="tab-content">
                        <div id="main" className={this.state.main ? 'tab-pane active' : 'tab-pane'}>
                            <MainTable key={'mainTable-'+place.id} place={place}></MainTable>
                        </div>
                        <div id="comments" className={this.state.comments ? 'tab-pane active' : 'tab-pane'}>
                            <Comments user={this.props.user} placeId={place.id}></Comments>
                        </div>
                        <div id="foto" className={this.state.foto ? 'tab-pane active location-block-description' : 'tab-pane location-block-description'}>
                            {
                                !place.Images ?
                                    <span>Загрузки...</span>
                                    :
                                    <FotoFolder key={place.id} data={place} type="zport" id={place.id}></FotoFolder>
                            }
                        </div>
                        <div id="maps" className={this.state.maps ? 'tab-pane active' : 'tab-pane'}>
                            <Guidelist fulldata={place}></Guidelist>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps (state) {
    const { user, place } = state.reducer;
    return {
        store: store,
        user: user,
        place: place.place
    }
}

module.exports = connect(mapStateToProps)(Place);

