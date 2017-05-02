/**
 * Created by semianchuk on 07.04.16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
var helper = require('./../components/helper');
var config = require('./../components/config');
var Link = require('react-router').Link;
import FotoFolder from "../components/place/FotoFolder";
import MainTable from "../components/main/mainTable";
import Comments from "../components/comments/Comments";
import store from "../store";
import SmallInformationBoard from "../components/Place/smallInformationBoard";
import { setPlaceProfileUrl, setPlaceId, setPlaceParams } from "../actions/placeActions";
import { setUserParams } from "../actions/userActions";
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var Steps = require('./../components/guides/steps');
import  Guidelist  from './../components/guides/guide';
var Dropzone = require('react-dropzone');
import update from 'react-addons-update';

var endPoint = helper.endPoint

class Edit extends Component {
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
            data:{
                title: "",
                type: "",
                folder: "",
                distance: "",
                phone: "",
                address: "",
                description: "",
                children: false,
                conditioner: false,
                dush: false,
                eat: false,
                toilet: false,
                tv: false,
                wifi: false,
                refrigeter: false,
                swiming: false,
                lat: '',
                lng: '',
                Rooms: [],
                Images: []
            },
            mainImg:''
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
        this.updateDate();
    }
    updateDate(){
        this.props.store.dispatch(setPlaceId(this.props.params.placeId));
        this.getDataFromJSON();
        const hashParts = window.location.hash.split('#');
        if(hashParts) this.changeAction(hashParts[1]);
        setTimeout(function(){
            this.setState({data: this.props.place});
        }.bind(this),1000)
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
                // window.alert('Directions request failed due to ' + status);
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
    handleTitleChange(e){
        this.setState({
            data: update(this.state.data, {title: {$set: e.target.value}})
        })
    }
    handleLatChange(){
        this.setState({
            data: update(this.state.data, {lat: {$set: e.target.value}})
        })
    }
    handleLngChange(){
        this.setState({
            data: update(this.state.data, {lng: {$set: e.target.value}})
        })
    }
    handleTypeChange(e){
        this.setState({
            data: update(this.state.data, {type: {$set: e.target.value}})
        })
    }
    handleDistanceChange(e){
        this.setState({
            data: update(this.state.data, {distance: {$set: e.target.value}})
        })
    }
    handlePhoneChange(e){
        this.setState({
            data: update(this.state.data, {phone: {$set: e.target.value}})
        })
    }
    handleAddressChange(e){
        this.setState({
            data: update(this.state.data, {address: {$set: e.target.value}})
        })
    }
    handleDescriptionChange(e){
        this.setState({
            data: update(this.state.data, {description: {$set: e.target.value}})
        })
    }
    handleChildrenChange(e){
        this.setState({
            data: update(this.state.data, {children: {$set: e.target.value}})
        })
    }
    handleConditionerChange(e){
        this.setState({
            data: update(this.state.data, {conditioner: {$set: e.target.value}})
        })
    }
    handleDushChange(e){
        this.setState({
            data: update(this.state.data, {dush: {$set: e.target.value}})
        })
    }
    handleEatChange(e){
        this.setState({
            data: update(this.state.data, {eat: {$set: e.target.value}})
        })
    }
    handleToiletChange(e){
        this.setState({
            data: update(this.state.data, {toilet: {$set: e.target.value}})
        })
    }
    handleTvChange(e){
        this.setState({
            data: update(this.state.data, {tv: {$set: e.target.value}})
        })
    }
    handleWifiChange(e){
        this.setState({
            data: update(this.state.data, {wifi: {$set: e.target.value}})
        })
    }
    handleRefrigeterChange(e){
        this.setState({
            data: update(this.state.data, {refrigeter: {$set: e.target.value}})
        })
    }
    handleSwimingChange(e){
        this.setState({
            data: update(this.state.data, {swiming: {$set: e.target.value}})
        })
    }
    handleLatChange(e){
        this.setState({
            data: update(this.state.data, {lat: {$set: e.target.value}})
        })
    }
    handleLngChange(e){
        this.setState({
            data: update(this.state.data, {lng: {$set: e.target.value}})
        })
    }
    updatePlace(){
        var url =  config.domain + 'place/'+this.props.params.placeId,
            self=this;
        $.ajax({
            type: "PUT",
            url: url,
            data: this.state.data,
            dataType: "json",
            success: function (obj) {
                if(obj.status == 'success'){
                    self.updateDate();
                }else{
                    console.log(obj.errors)
                }
            }
        })
    }
    handleRoomTitleChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.title = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    handleRoomConditionerChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.conditioner = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    handleRoomDushChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.dush = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    handleRoomToiletChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.toilet = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    handleRoomTvChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.tv = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    handleRoomWifiChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.wifi = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    handleRoomRefrigeterChange(e){
        this.props.place.Rooms.map(function (data) {
            if(data.id == e.target.id){
                data.refrigeter = e.target.value
            }
        })
        this.setState({data:this.props.place});
    }
    updateRoom(e){
        var id = e.target.id,
            url =  config.domain + 'room/'+id,
            room = {},
            self=this;
        this.state.data.Rooms.map(function (data) {
            if(data.id == id){
                room = data;
            }
        })
        $.ajax({
            type: "PUT",
            url: url,
            data: room,
            dataType: "json",
            success: function (obj) {
                if(obj.status == 'success'){
                    self.updateDate();
                }else{
                    console.log(obj.errors)
                }
            }
        })
    }
    updatePrice(e){
        var id = e.target.id,
            url =  config.domain + 'price/'+id,
            price = {
                price: e.target.value
            },
            self=this;

        this.state.data.Rooms.map(function (data) {
            data.Prices.map(function (price) {
                if(price.id == id){
                    price.price = e.target.value;
                }
            });
        })

        $.ajax({
            type: "PUT",
            url: url,
            data: price,
            dataType: "json",
            success: function (obj) {
                if(obj.status == 'success'){
                    self.updateDate();
                }else{
                    console.log(obj.errors)
                }
            }
        })
    }
    onDrop(id, typePlace, dataEmpty,  files) {

        const type = typePlace == 'ico' ? 'zport' : typePlace;
        const ico = typePlace == 'ico' ? 'true' : 'false'
        const RoomId = type == 'room' ? id : '' ;
        const PlaceId = type == 'zport' ? id : '' ;

        let formData = new FormData();
        formData.append("RoomId", RoomId);
        formData.append("PlaceId", PlaceId);
        formData.append("type", type);
        formData.append("ico", ico);
        formData.append("file", files[0]);
        let self = this;

        $.ajax({
            method: 'POST',
            data: formData,
            url: config.be + 'upload',
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string reque
            success: function(data){
                dataEmpty.updateDate();
            }
        });
        // if (files && files[0]) {
        //     var reader = new FileReader();
        //     reader.onload = function (e) {
        //         dataEmpty.setState({
        //             mainImg: e.target.result
        //         });
        //     }.bind(this);
        //
        //     reader.readAsDataURL(files[0]);
        // }
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    removeFoto() {
        const id = arguments[0].target.dataset.id,
              url =  config.domain + 'image/'+id,
              self=this;
        $.ajax({
            type: "DELETE",
            url: url,
            data: JSON.stringify({id}),
            dataType: "json",
            success: function (obj) {
                if(obj.status == 'success'){
                    self.updateDate();
                }else{
                    console.log(obj.errors)
                }
            }
        })
    }

    render() {
        var place = this.state.data;
        var end = this.state.endPoint
            .map(function(data){
                return   <option value={data.name}>{data.label}</option>
            })
        var distance = this.state.legs.distance ? this.state.legs.distance.value : '';
        const data = place;
        const buttonsInstance = (
            <ul className="list-group">
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-home"></i>
                    <Input type="text" name="type" id="type" placeholder="with a placeholder" value={data.title} onChange={this.handleTitleChange.bind(this)}/>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-star"></i> Тип: {helper.type(data.type)}
                    <select type="select" name="type" id="type" value={data.type} onChange={this.handleTypeChange.bind(this)}>
                        {helper.filterData.type.map((val)=>{
                            return <option value={val}>{helper.type(val)}</option>
                        })}
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-send"></i> Дистанция: {data.distance} м.
                    <select type="select" name="type" id="distance" value={data.distance} onChange={this.handleDistanceChange.bind(this)}>
                        {helper.filterData.distance.map((val)=>{
                            return <option value={val}>{val}</option>
                        })}
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-shopping-cart"></i> Удобства:
                    <select type="select" name="type" id="toilet" value={data.toilet} onChange={this.handleToiletChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-equalizer"></i> Душ:
                    <select type="select" name="type" id="dush" value={data.dush} onChange={this.handleDushChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-expand"></i> TV:
                    <select type="select" name="type" id="tv" value={data.tv} onChange={this.handleTvChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-folder-close"></i> Холодильник:
                    <select type="select" name="type" id="refrigeter" value={data.refrigeter} onChange={this.handleRefrigeterChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-cloud"></i> Басейн:
                    <select type="select" name="type" id="swiming" value={data.swiming} onChange={this.handleSwimingChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-cd"></i> Wifi:
                    <select type="select" name="type" id="wifi" value={data.wifi} onChange={this.handleWifiChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-apple"></i> Кухня:
                    <select type="select" name="type" id="eat" value={data.eat} onChange={this.handleEatChange.bind(this)}>
                        <option value="true">Есть</option>
                        <option value="false">Нет</option>
                    </select>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-phone-alt"></i> Контакты:
                    <Input type="text" name="type" id="type" placeholder="with a placeholder" value={data.phone} onChange={this.handlePhoneChange.bind(this)}/>
                </li>
                <li className="list-group-item">
                    <i className="glyphicon glyphicon-map-marker"></i> Адрес:
                    <Input type="text" name="type" id="type" placeholder="with a placeholder" value={data.address} onChange={this.handleAddressChange.bind(this)}/>
                </li>
                <li className="list-group-item">
                    Описания:
                    <textarea rows="10" cols="80" type="text" name="type" id="type" placeholder="with a placeholder" value={data.description} onChange={this.handleDescriptionChange.bind(this)}/>
                </li>
                <li className="list-group-item">
                    Lat
                    <Input type="text" name="type" id="type" placeholder="with a placeholder" value={data.lat} onChange={this.handleLatChange.bind(this)}/>
                </li>
                <li className="list-group-item">
                    Lng
                    <Input type="text" name="type" id="type" placeholder="with a placeholder" value={data.lng} onChange={this.handleLngChange.bind(this)}/>
                </li>
                <li className="list-group-item">
                    <button className="btn-success" onClick={this.updatePlace.bind(this)}>Update</button>
                </li>
            </ul>
        );

        const roomBlock = this.state.data.Rooms ? this.state.data.Rooms.map((data, index) =>
                <div className="col-md-12 main-block">
                    <div className="col-md-12">
                        <Input type="text" name="type" placeholder="with a placeholder" value={data.title} id={data.id} onChange={this.handleRoomTitleChange.bind(this)}/>
                    </div>
                    <div className="col-md-12 price-table-block">
                        <div className="col-md-2"></div>
                        <div className="col-md-4" >
                            <table className="table price-table table-bordered table-striped" data-id={data.type}>
                                <thead>
                                <tr>
                                    <th>Месяц</th>
                                    <th>Цена</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    !data.Prices ?
                                        <p>Загрузка...</p>
                                        :
                                        data.Prices.map((data, index) =>
                                            <tr key={index}>
                                                <td>{data.mounth}</td>
                                                <td>
                                                    <Input type="text" name="type" id="type" placeholder="with a placeholder" value={data.price} id={data.id} onChange={this.updatePrice.bind(this)}/>
                                                </td>
                                            </tr>
                                        )
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-4">
                            <table className="table price-table table-bordered table-striped" data-id={data.type}>
                                <tbody>
                                <tr>
                                    <td><i className="glyphicon glyphicon-globe"></i> Кондиционер</td>
                                    <td>
                                        <select type="select" name="type" id="conditioner" value={data.conditioner} id={data.id} onChange={this.handleRoomConditionerChange.bind(this)}>
                                            <option value="true">Есть</option>
                                            <option value="false">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><i className="glyphicon glyphicon-equalizer"></i> Душ в номере</td>
                                    <td>
                                        <select type="select" name="type" id="dush" value={data.dush}  id={data.id} onChange={this.handleRoomDushChange.bind(this)}>
                                            <option value="true">Есть</option>
                                            <option value="false">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><i className="glyphicon glyphicon-shopping-cart"></i> Удобства в номере</td>
                                    <td>
                                        <select type="select" name="type" id="toilet" value={data.toilet} id={data.id} onChange={this.handleRoomToiletChange.bind(this)}>
                                            <option value="true">Есть</option>
                                            <option value="false">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><i className="glyphicon glyphicon-folder-close"></i> Телевизор</td>
                                    <td>
                                        <select type="select" name="type" id="tv" value={data.tv}  id={data.id} onChange={this.handleRoomTvChange.bind(this)}>
                                            <option value="true">Есть</option>
                                            <option value="false">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><i className="glyphicon glyphicon-cd"></i> WIFI</td>
                                    <td>
                                        <select type="select" name="type" id="wifi" value={data.wifi}  id={data.id} onChange={this.handleRoomWifiChange.bind(this)}>
                                            <option value="true">Есть</option>
                                            <option value="false">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><i className="glyphicon glyphicon-folder-close"></i> Холодильник</td>
                                    <td>
                                        <select type="select" name="type" id="refrigeter" value={data.refrigeter}  id={data.id} onChange={this.handleRoomRefrigeterChange.bind(this)}>
                                            <option value="true">Есть</option>
                                            <option value="false">Нет</option>
                                        </select>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-12">
                            <div className="uploadFileZone col-xs-12">
                                <Dropzone ref="dropzone" data-id={data.id} data-type='room' onDrop={this.onDrop.bind( null, data.id, 'room', this)} >
                                    <img className="dropzone-img" src={config.domain + 'images/icon/plus.png'} />
                                </Dropzone>
                            </div>
                            <FotoFolder key={data.id} data={data} edit="true" type="room" id={data.id} remove = {this.removeFoto.bind(this)}></FotoFolder>
                        </div>
                        <div className="col-md-12">
                            <button className="btn-success pull-right" id={data.id}  onClick={this.updateRoom.bind(this)}>Update</button>
                        </div>
                    </div>
                </div>
            ) : '';

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
                        <div className="uploadFileZone">
                            <Dropzone ref="dropzone" data-id={this.state.data.id} data-type='ico' onDrop={this.onDrop.bind(null, this.state.data.id, 'ico', this)} >
                                {this.state.mainImg ? <div>
                                    <img src={this.state.mainImg}/>
                                </div> : <div><img src={config.domain + 'images/zport/'+ this.state.data.id + '/ico.jpg'}/></div>}
                            </Dropzone>
                        </div>
                    </div>
                    <div className="col-md-8">
                        {buttonsInstance}
                    </div>
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
                            {roomBlock}
                        </div>
                        <div id="comments" className={this.state.comments ? 'tab-pane active' : 'tab-pane'}>
                            <Comments user={this.props.user} placeId={place.id}></Comments>
                        </div>
                        <div id="foto" className={this.state.foto ? 'tab-pane active location-block-description' : 'tab-pane location-block-description'}>
                            {
                                !place.Images ?
                                    <span>Загрузки...</span>
                                    :
                                    <div className="">
                                        <div className="uploadFileZone col-xs-12">
                                            <Dropzone ref="dropzone" data-id={place.id} data-type='zport' onDrop={this.onDrop.bind(null, place.id, 'zport', this)} >
                                                <img className="dropzone-img text-center" src={config.domain + 'images/icon/plus.png'} />
                                            </Dropzone>
                                        </div>
                                        <FotoFolder key={place.id} data={place} edit="true" type="zport" id={place.id} remove = {this.removeFoto.bind(this)}></FotoFolder>
                                    </div>
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

module.exports = connect(mapStateToProps)(Edit);

/*
 <SmallInformationBoard data={place} edit="true"></SmallInformationBoard>



 <Form>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-star"></i><Label for="type">Type</Label></div>
 <div className="col-md-9"><Input type="text" name="type" id="type" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-send"></i><Label for="distance">Дистанция</Label></div>
 <div className="col-md-9"><Input type="text" name="distance" id="distance" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-shopping-cart"></i><Label for="toilet">Удобства</Label></div>
 <div className="col-md-9"><Input type="text" name="toilet" id="toilet" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-equalizer"></i><Label for="dush">Душ</Label></div>
 <div className="col-md-9"><Input type="text" name="dush" id="dush" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-expand"></i><Label for="tv">TV</Label></div>
 <div className="col-md-9"><Input type="text" name="tv" id="tv" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-folder-close"></i><Label for="refrigeter">Холодильник</Label></div>
 <div className="col-md-9"><Input type="text" name="refrigeter" id="refrigeter" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-cloud"></i><Label for="swiming">Басейн</Label></div>
 <div className="col-md-9"><Input type="text" name="swiming" id="swiming" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-cd"></i><Label for="wifi">Wifi</Label></div>
 <div className="col-md-9"><Input type="text" name="wifi" id="wifi" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-apple"></i><Label for="eat">Кухня</Label></div>
 <div className="col-md-9"><Input type="text" name="eat" id="eat" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-phone-alt"></i><Label for="phone">Контакты</Label></div>
 <div className="col-md-9"><Input type="text" name="phone" id="phone" placeholder="with a placeholder" /></div>
 </FormGroup>
 <FormGroup>
 <div className="col-md-3"><i className="glyphicon glyphicon-map-marker"></i><Label for="address">Адрес</Label></div>
 <div className="col-md-9"><Input type="text" name="address" id="address" placeholder="with a placeholder" /></div>
 </FormGroup>
 <Button>Submit</Button>
 </Form>
 */

