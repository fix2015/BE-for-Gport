/**
 * Created by semianchuk on 23.04.16.
 */

import React, { Component } from 'react'
import config from './../config'

export default class FotoFolder extends Component {

    constructor(props) {
        super(props)
    }

    handleClick(){
        this.props.onClick(this.props.data).bind(this);
    }

    render() {
        const id = this.props.id;
        const typeHouse = this.props.type;

        return (
            <div className="row">
                {
                    !this.props.data.Images ?
                        "Загрузка..."
                        :
                        this.props.data.Images.map((val, index) =>
                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-4 img-thumbnail thumb">
                                <a className="fancyimage" data-fancybox-group="group" href={config.domain + 'images/'+typeHouse+'/'+ id + '/' + val.name}>
                                    <img className='img-responsive' src={config.domain + 'images/'+typeHouse+'/'+ id + '/' + val.name}/>
                                </a>
                                <button className={this.props.edit=='true' ? 'show-block' : 'hide-block'} onClick = {this.props.remove} data-id={val.id}>Remove</button>
                            </div>
                        )
                }
            </div>
            );
    }
};
