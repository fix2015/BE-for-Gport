import React, { Component } from 'react'
import { connect } from 'react-redux'

var Search = require('./Search');
var Map = require('./Map');
var CurrentLocation = require('./CurrentLocation');
var LocationList = require('./LocationList');
var SearchField = require('./SearchField');
var SearchComponent = require('./SearchComponent');
import restaurants from "../restaurants"
window.restaurants = restaurants;
var helper = require('./helper');

var MainNav = require('./MainNav');
var Auth = require('./auth/Auth');
var Social = require('./social/social');
var Adsense = require('./Adsense/Adsense');

import { setUserParams } from "../actions/userActions"
import { setFilterType, fetchFilter, setFilterText, clearFilter } from "../actions/filterActions"
import store from "../store"

window.gmarkers = [];

class App extends Component {
    constructor(props) {
        super(props);
        this.props.store.dispatch(setUserParams(userSettings));
        var type = (this.props.params.type ? this.props.params.type : '');
		var favorites = [];
        favorites = restaurants;
        this.state = {
			favorites: favorites,
			currentAddress: 'Zport',
			mapCoordinates: {
                lat: 46.12363029999999,
                lng: 32.29127140000003
            },
            filter: this.props.filter
        };
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
                    <img className="main-img" src="site-images/header-img.jpg"/>
                </div>
                <div className="col-md-12">
                    <MainNav type={routeType} typeFilter={this.typeFilter.bind(this)}></MainNav>
                </div>
                <div className="col-md-12 main-label">
				    <h1>Поиск жилья в железном порту</h1>
                </div>
                <div className="col-md-12">
                    <SearchField onSearch={this.searchForAddress.bind(this)} onFilterInput={this.handleFilterText.bind(this)} filterText={this.state.filterText}/>
                </div>
                <div className="col-md-12">
                    <div className="col-md-7">
                        <Auth></Auth>
                        <Map filter= {filter} filterText={this.state.filterText} locations={this.state.favorites} removeMarkers={this.state.removeMarkers} lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />
                    <Adsense></Adsense>
                    </div>
                    <div className="mark-map-block col-md-5">
                        <LocationList filter= {filter} filterText={this.state.filterText} clearFilter={this.clearFilter.bind(this)} locations={this.state.favorites} activeLocationAddress={this.state.currentAddress}
                        onClick={this.searchForAddress.bind(this)} />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="main-map-block">
                        <SearchComponent type={routeType}/>
                    </div>
                </div>
			</div>
		);
	}

};

function mapStateToProps (state) {
    console.log('mapStateToProps APP')
    console.log(state.reducer)
    const { user, tweets, filter } = state.reducer;
    return {
        state: store.getState(),
        store: store,
        user: user,
        tweets: tweets,
        filter: filter
    }
}

module.exports = connect(mapStateToProps)(App);