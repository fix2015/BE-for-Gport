/**
 * Created by semianchuk on 01.06.16.
 */

import React, { Component } from 'react'
import Timestamp from 'react-timestamp';

class CommentsArea extends Component {
    constructor(props) {
        super(props);
        this.state={
            mainImg: config.domain  + 'images/icon/unknown-user-pic.png'
        }
    }
    componentDidMount() {
        var avatar  = this.props.comment.User ?  this.props.comment.User.photos : config.domain  + 'images/icon/unknown-user-pic.png';
        var img = new Image();
        var self = this;
        img.onload = function(){
            self.setState({
                mainImg : avatar
            })
        };
        img.src = avatar;
    }
    render() {
        var data = this.props.comment,
            editPermission = ((this.props.comment.User && this.props.comment.User.id == this.props.user.id) ? true : false);
        return (
            <div className="row">
                <div className="col-sm-1">
                    <div className="thumbnail">
                        <img className="img-responsive user-photo" src={this.state.mainImg} />
                    </div>
                </div>
                <div className="col-sm-11">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <strong>{data.name}</strong> <span className="text-muted"> <Timestamp time={data.dateCreated} format='full' /></span>
                            <i onClick={this.props.edit} className={editPermission ? 'fa fa-pencil-square-o comment-edit hide-block' : 'fa fa-pencil-square-o edit-remove hide-block'}
                               aria-hidden="true"></i>
                            <i onClick={this.props.remove} className={editPermission ? 'fa fa-times comment-remove show-block' : 'fa fa-times comment-remove hide-block'}
                               aria-hidden="true"></i>
                        </div>
                        <div className="panel-body">
                             {data.data}
                        </div>
                    </div>
                </div>
            </div>
            );
    }
};

module.exports = CommentsArea;