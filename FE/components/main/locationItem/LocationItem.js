import React, { Component } from 'react'
var Link = require('react-router').Link;
var helper = require('./../../helper');
var config = require('./../../config');


export default class LocationItem extends Component {
    constructor(props) {
        super(props);
        this.state={
            hover: true,
            mainImg: config.domain + 'images/icon/default.png'
        }
    }
    componentDidMount() {
        var img = new Image();
        var self = this;
        img.onload = function(){
            self.setState({
                mainImg : config.domain + 'images/zport/'+ self.props.data.id + '/ico.jpg'
            })
        };
        img.src = config.domain + 'images/zport/'+ self.props.data.id + '/ico.jpg';
    }
    mouseOver () {
        this.setState({hover: true});
    }
    mouseOut () {
        this.setState({hover: false});
    }
    handleClick() {
        this.props.onClick(this.props.data);
    }
    render(){
        var cn = "list-group-item";

        if(this.props.active){
            cn += " active-location";
        }
        if(this.state.hover==true){
            this.state.toogle = 'location-block-open'
        }else{
            this.state.toogle = 'location-block-close'
        }

        return (
            <div className="col-md-12 border-item">
                <Link to={'/place/'+this.props.data.id} className="location-title">
                    <h4 className="location-title">{this.props.data.title}</h4>
                </Link>
                <div className="col-md-6 p-0">
                        <a className="fancyimage" data-fancybox-group="group" href={this.state.mainImg}>
                            <img className='img-responsive' src={this.state.mainImg}/>
                        </a>
                    </div>
                    <div className="col-md-6 location-block-open" >
                        <ul className="list-group p-0">
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-home"></i> {this.props.data.title}
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-star"></i> Тип: {helper.type(this.props.data.type)}
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-send"></i> Дистанция: {this.props.data.distance} м.
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-shopping-cart"></i> Удобства: <i className={this.props.data.toilet==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove"}></i>
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-equalizer"></i> Душ:  <i className={this.props.data.dush==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove"}></i>
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-expand"></i> TV:  <i className={this.props.data.tv==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove"}></i>
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-folder-close"></i> Холодильник: <i className={this.props.data.refrigeter==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove"}></i>
                            </li>
                            <li className="list-group-item">
                                <i className="glyphicon glyphicon-globe"></i> Кондиционер: <i className={this.props.data.conditioner==true ? "glyphicon glyphicon-ok" : " glyphicon glyphicon-remove"}></i>
                            </li>
                        </ul>
                        <span className="glyphicon glyphicon-zoom-in"></span>
                    </div>
            </div>
        )

    }

};
