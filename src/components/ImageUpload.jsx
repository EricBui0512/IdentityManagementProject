import React, { Component } from 'react';
import _ from 'lodash';

class ImageUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: ''
        };
        this._changeEvent = this._changeEvent.bind(this);
    }

    _changeEvent(e){
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0]
        reader.onloadend = () => {
            //this.refs.preview.innerHTML=(<img src="{reader.result}/" />);
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });

            if(_.isFunction(this.props.handleChangePictureLink)) {
                this.props.handleChangePictureLink(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }

    render(){
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<div className="col-lg-7"><div className="x_panel"><div className="x_content"><div className="bike-thumbnail"><img style={{width: '100%', display: 'block'}} src={imagePreviewUrl} /></div></div></div></div>);
        }
        return(
            <div>
                <input type="file" onChange={this._changeEvent} />
                {$imagePreview}
                {/*<div ref="preview"></div>*/}
            </div>
        )
    }
}

export default ImageUpload;