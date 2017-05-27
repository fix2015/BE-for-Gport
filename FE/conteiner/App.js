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

class App extends Component {
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
            mapNav:false,
            scroll: false,
        };
    }
    componentDidMount () {
        this.socket = io('/')
        this.socket.on('user', data => {
            Notifier.start(data.title, data.text, config.domain, config.domain+"images/icon/logo.jpeg");
        })
        const hashParts = window.location.hash.split('#');
        if(hashParts) this.changeAction(hashParts[1]);
        window.onscroll = function() {
            var scrolled = window.pageYOffset || document.documentElement.scrollTop;
            if(scrolled> 400){
                this.setState({
                    scroll: 'true'
                })
            }else{
                this.setState({
                    scroll: 'false'
                })
            };
        }.bind(this)
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
    changeAction(list){
        if(list=='maps'){
            this.setState({
                listNav:false,
                mapNav:true
            })
        }else{
            this.setState({
                listNav:true,
                mapNav:false
            })
        }

    }
	render(){
        let routeType = (this.props.params.type ? this.props.params.type : '');
        let filter = this.props.filter;
        let locations = this.props.place.places
            .filter(function(data){
                return (filter.textSearch==true) ? data.title.toLowerCase().indexOf(filter.filterText.toLowerCase()) > -1 : true;
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.type ? data.type.toLowerCase().indexOf(filter.type.toLowerCase()) > -1 : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ?  filter.toilet ? (data.toilet==filter.toilet)  : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.distance ? data.distance.toLowerCase().indexOf(filter.distance.toLowerCase()) > -1 : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.tv ? (data.tv==filter.tv) : true  : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.refrigeter ? (data.refrigeter==filter.refrigeter) : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.conditioner ? (data.conditioner==filter.conditioner) : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.wifi ? (data.wifi==filter.wifi) : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.eat ? (data.eat==filter.eat) : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.children ? filter.children : true : true
            })
            .filter(function(data){
                return (filter.filterSearch==true) ? filter.swiming ? filter.swiming : true : true
            })

        return (
			<div className="main-page">
                <div className="col-md-12 header-img">
                    <Social></Social>
                    <img className="main-img" src="site-images/header-img.jpg"/>
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
                        <div className={this.state.scroll=='true' ? 'main-map-block menu-fixed-block' : 'main-map-block'}>
                            <div className="col-md-12">
                                <h2>Поиск жилья</h2>
                                <SearchField locations={this.props.place} onSearch={this.searchForAddress.bind(this)} onFilterInput={this.handleFilterText.bind(this)} filterText={this.state.filterText}/>
                            </div>
                            <SearchComponent key="SearchComponent" filter={this.props.filter} store={this.props.store} type={routeType}/>
                        </div>
                    </div>
                    <div className="col-md-7 tabbable">
                        <ul className="nav nav-tabs">
                            <li className={this.state.listNav ? 'active' : ''} onClick={this.changeAction.bind(this, 'list')}><a data-toggle="tab" href="#list">Список {this.state.listNav}</a></li>
                            <li className={this.state.mapNav ? 'active' : ''} onClick={this.changeAction.bind(this, 'maps')}><a data-toggle="tab" href="#maps">Карта</a></li>
                        </ul>
                        <div className="tab-content">
                            <div id="list" className={this.state.listNav ? 'tab-pane active' : 'tab-pane'}>
                                <div>
                                    <span className="list-group-item list-group-item-first active">Результаты: {locations.length}</span>
                                    <span className="caption-of-result glyphicon glyphicon-remove" onClick={this.clearFilter.bind(this)}></span>
                                </div>
                                <div className="mark-map-block">
                                    <LocationList key="LocationList" filter= {filter} filterText={this.state.filterText} clearFilter={this.clearFilter.bind(this)} locations={locations} activeLocationAddress={this.state.currentAddress}
                                                  onClick={this.searchForAddress.bind(this)} />
                                </div>                            </div>
                            <div id="maps" className={this.state.mapNav ? 'tab-pane active' : 'tab-pane'}>
                                <div>
                                    <span className="list-group-item list-group-item-first active">Результаты: {locations.length}</span>
                                    <span className="caption-of-result glyphicon glyphicon-remove" onClick={this.clearFilter.bind(this)}></span>
                                </div>
                                <div className="map-block">
                                    <Map filter= {filter} key="Map" clearFilter={this.clearFilter.bind(this)} action={this.state.mapNav} filterText={this.state.filterText} locations={locations} removeMarkers={this.state.removeMarkers} lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />
                                </div>
                            </div>
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

module.exports = connect(mapStateToProps)(App);

/*
 <div className="col-md-12">
 <div className="main-map-block">
 <SearchComponent key="SearchComponent" type={routeType}/>
 </div>
 </div>
 <Adsense></Adsense>
 */
