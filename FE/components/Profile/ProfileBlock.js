/**
 * Created by semianchuk on 27.09.16.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from "../../store"
var config = require('../../components/config');

class ProfileBlock extends Component {
    constructor(props) {
        super(props);
        this.state={
            mainImg: config.domain + 'images/icon/unknown-user-pic.png'
        }
    }
    componentDidMount() {
        var image = this.props.user.photos ? this.props.user.photos :  config.domain  + 'images/icon/unknown-user-pic.png';
        var img = new Image();
        var self = this;
        img.onload = function(){
            self.setState({
                mainImg : image
            })
        };
        img.src = image;
    }
    render(){
        var profile = this.props.user;
        return (
            <div className="profile-block">
                <div className="profile-block-img">
                    <img className="profile-block-image" src={this.state.mainImg}/>
                </div>
                <span className="profile-block-name">{profile.name}</span>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { user } = state.reducer;
    return {
        store: store,
        user: user,
    }
}
module.exports = connect(mapStateToProps)(ProfileBlock);