import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import _ from 'lodash';

class Contents extends Component {

    inputEvent(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }

    componentDidMount() {
        this.renderAutoComplete();
    }

    componentDidUpdate(prevProps) {
        const {map} = this.props;
        if (map !== prevProps.map) {
            this.renderAutoComplete();
        }
    }

    renderAutoComplete() {
        const {google, map} = this.props;

        if (!google || !map) return;

        const aref = this.refs.autocomplete;
        const node = ReactDOM.findDOMNode(aref);
        var autocomplete = new google.maps.places.Autocomplete(node);
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            this.setState({
                place: place,
                position: place.geometry.location
            });

            if(_.isFunction(this.props.handleChaneLocation)){
                this.props.handleChaneLocation(place.formatted_address);
            }
        })
    }

    render() {
        const props = this.props;
        return (
            <div className="address col-sm-12 col-md-12 col-lg-12">
                <div>
                    <div className="form-group">
                        <input
                            name="address"
                            ref='autocomplete'
                            type="text"
                            placeholder="Address"
                            style={{width: '100%'}}
                            onKeyPress={this.inputEvent}
                            defaultValue={this.props.address}/>
                    </div>
                    <div className="form-group">
                        <Map {...props}
                             containerStyle={{
                                 position: 'relative',
                                 height: '200px',
                                 width: '100%'
                             }}
                             initialCenter={this.props.currentLocation}
                             centerAroundCurrentLocation={false}
                             clickableIcons={false}>
                        </Map>
                        <Marker position={this.props.currentLocation} initialCenter={this.props.currentLocation}/>
                    </div>

                </div>
                <div style={{marginBottom: '16px'}}>
                    <input name="postalCode" placeholder="Postal Code" defaultValue={this.props.postalCode}/>
                </div>
            </div>
        )
    }
}

class MapContainer extends Component{
    render(){
        const props = this.props;
        const {google} = this.props;
        return (
            <Map google={google}
                 className={'map'}
                 visible={false}
                 clickableIcons={false}>
                <Contents {...props}  />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCc-EsvzIi-fvx3sZLYUML659aIzodUQhE',
    libraries: ['places'],
    version: '3.28'
})(MapContainer)