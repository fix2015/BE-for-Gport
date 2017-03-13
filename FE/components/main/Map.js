var React = require('react');
var helper = require('./../helper');
import config from "../config"

var Map = React.createClass({
    getInitialState() {
        return { num: 0 };
    },
    infoWindow(data){
        return '<div class="col-md-12 map-list-preview" style="text-align: left">'+
            '<h4><a href="/place/'+data.id+'">'+data.title+'</a></h4>'+
            '<ul class="list-group" style="padding: 0; margin-top: 0px;">'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-star"></i> Тип: '+helper.type(data.type)+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-send"></i> Дистанция: '+data.distance+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-shopping-cart"></i> Удобства: <i class="'+ (data.toilet==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-equalizer"></i> Душ: <i class="'+ (data.dush==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-expand"></i> TV: <i class="'+ (data.tv==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-folder-close"></i> Холодильник: <i class="'+ (data.refrigeter==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-globe"></i> Кондиционер: <i class="'+ (data.conditioner==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-cd"></i> Wifi: <i class="'+ (data.wifi==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '<li class="list-group-item">'+
            '<i class="glyphicon glyphicon-apple"></i> Питание:  <i class="'+ (data.eat==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove") +'"></i>'+
            '</li>'+
            '</ul>'+
        '</div>'
    },
	componentDidUpdate(){
        if(!this.props.action) return ;
		if(this.lastLat == this.props.lat && this.lastLng == this.props.lng){
			return;
		}
        var map = new GMaps({
            el: '#map',
             lat: 46.12363029999999,
             lng: 32.29127140000003,
            markerClusterer: function(map) {
               let options = {
                    gridSize: 40
                }

                return new MarkerClusterer(map, [], options);
            }
        });
        map.removeMarkers();
        this.addMarkers(map, this.props)
	},
    componentWillReceiveProps(){
        if(!this.props.action) return ;
        if(this.lastLat == this.props.lat && this.lastLng == this.props.lng){
            return;
        }
        var map = new GMaps({
            el: '#map',
            lat: 46.12363029999999,
            lng: 32.29127140000003,
            markerClusterer: function(map) {
                let options = {
                    gridSize: 40
                }

                return new MarkerClusterer(map, [], options);
            }
        });
        map.removeMarkers();
        var self=this;
        setTimeout(function(){
            self.addMarkers(map, self.props)
        },200)
    },
    addMarkers(map, props){
        var self = this,
            num=0;
        var locations = this.props.locations
            .map(function(data){
                num++;
                var icon = config.domain + 'images/icon/green-icon.png'
                switch(data.type){
                    case 'chast':
                        icon = config.domain + 'images/icon/chast.png'
                        break;
                    case 'pansionat':
                        icon = config.domain + 'images/icon/pansionat.png'
                        break;
                    case 'hotel':
                        icon = config.domain + 'images/icon/hotel.png'
                        break;
                    case 'sanatoriy':
                        icon = config.domain + 'images/icon/sanatoriy.png'
                        break;
                    case 'otel':
                        icon = config.domain + 'images/icon/otel.png'
                        break;
                    case 'children':
                        icon = config.domain + 'images/icon/children.png'
                        break;
                    case 'basi':
                        icon = config.domain + 'images/icon/basi.png'
                        break;
                    case 'room':
                        icon = config.domain + 'images/icon/room.png'
                        break;
                    default:

                }
                var marker = map.addMarker({
                        lat: data.lat,
                        lng: data.lng,
                    click: function(e) {
                        //alert('You clicked in this marker');
                    },
                    infoWindow: {
                        content: self.infoWindow(data)
                    }
                }).setIcon(icon);
                gmarkers.push(marker);
        })

        new MarkerClusterer(map, gmarkers);
    },
    clearFilter(){
        this.props.clearFilter();
    },
	render(){
        return (
			<div className="map-holder">
				<p>Loading...</p>
				<div id="map"></div>
			</div>
		);
	}

});

module.exports = Map;