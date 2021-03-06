import React, { Component } from 'react'
import { connect } from 'react-redux'

var Search = require('./../components/search/Search');
var Map = require('./../components/main/Map');
var CurrentLocation = require('./../components/main/CurrentLocation');
var helper = require('./../components/helper');
var Adsense = require('./../components/Adsense/Adsense');


import Social from "../components/social/social"
import Auth from "../components/auth/auth"
import LocationList from "../components/main/LocationList"
import SearchComponent from "../components/search/SearchComponent"
import SearchField from "../components/search/SearchField"
import MainNav from "../components/main/MainNav"
import ProfileBlock from "../components/Profile/ProfileBlock"
import { setUserParams } from "../actions/userActions"
import { fetchPlace } from "../actions/placeActions"
import { setFilterType, fetchFilter, setFilterText, clearFilter } from "../actions/filterActions"
import store from "../store"
import config from "../components/config"
import io from 'socket.io-client'
import Notifier from "react-desktop-notification"

window.gmarkers = [];

class MapPage extends Component {
    constructor(props) {
        super(props);

        fetchPlace(this.props.store.dispatch);

        this.props.store.dispatch(setUserParams(window.userSettings))
        this.state = {
            currentAddress: 'Zport',
            mapCoordinates: {
                lat: 46.12363029999999,
                lng: 32.29127140000003
            },
            filter: this.props.filter,
            listNav:true,
            mapNav:true
        };
    }
    componentDidMount () {
        this.socket = io('/')
        this.socket.on('user', data => {
            Notifier.start(data.title, data.text, config.domain, config.domain+"images/icon/logo.jpeg");
        })
    }
    filterFunc(data){
        this.props.store.dispatch(fetchFilter());
        this.state.filter = this.props.filter
    }
    searchForAddress(data){
        this.props.store.dispatch(setFilterText(data.title));
        this.state.filter = this.props.filter
        this.state.removeMarkers= true
        this.state.mapCoordinates= {
            lat: data.lat,
            lng: data.lng
        }
    }
    handleFilterText(filterText){
        this.props.store.dispatch(setFilterText(filterText));
        this.state.filter = this.props.filter
    }
    clearFilter(){
        this.props.store.dispatch(clearFilter());
        this.state.filter = this.props.filter
    }
    typeFilter(){
        if(this.props.params.type){
            this.props.store.dispatch(setFilterType(this.props.params.type));
            this.state.filter = this.props.filter
        }else{
            this.clearFilter();
        }

    }
    render(){
        var routeType = (this.props.params.type ? this.props.params.type : '');
        let filter = this.props.filter;

        return (
            <div className="main-page">
                <div className="col-md-12 header-img">
                    <Social></Social>
                    <img className="main-img" src={config.domain + 'site-images/header-img.jpg'}/>
                </div>
                <div className="col-md-12">
                    <MainNav type={routeType} typeFilter={this.typeFilter.bind(this)}></MainNav>
                </div>
                <div className="col-md-12 profile-img">
                    <ProfileBlock ></ProfileBlock>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5">
                        <Auth></Auth>
                        <div className="main-map-block">
                            <div className="col-md-12">
                                <h2>Поиск жилья</h2>
                                <SearchField locations={this.props.place} onSearch={this.searchForAddress.bind(this)} onFilterInput={this.handleFilterText.bind(this)} filterText={this.state.filterText}/>
                            </div>
                            <SearchComponent key="SearchComponent" filter={this.props.filter} store={this.props.store} type={routeType}/>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="map-block">
                        <Map filter= {filter} clearFilter={this.clearFilter.bind(this)} action={this.state.mapNav} filterText={this.state.filterText} locations={this.props.place.places} removeMarkers={this.state.removeMarkers} lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />
                    </div>
                    </div>
                </div>
            </div>
        );
    }

};

function mapStateToProps (state) {
    const { user, tweets, filter, place } = state.reducer;
    return {
        state: store.getState(),
        store: store,
        user: user,
        tweets: tweets,
        filter: filter,
        place: place,
    }
}

module.exports = connect(mapStateToProps)(MapPage);
