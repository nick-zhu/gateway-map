/* global window */
import React, { Component } from 'react';
import MapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';

import GatewayMarker from './marker';
import GatewayInfo from './info';

import GATEWAYS from './gateways.json';

const TOKEN = 'pk.eyJ1IjoiZ21yeXNrbyIsImEiOiJjaXUwaHB1dXQwMnFvMnpscDhic3Z1emh3In0.pQV-HLhyOJ3hNKpqERZRkA'; // Set your mapbox token here

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 36.85268299599549,
        longitude: -120.10515194664137,
        zoom: 7,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      },
      gateways: GATEWAYS,
      popupInfo: null
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  }

  _renderGatewayMarker = (gateway, index) => {
    return (
      <Marker key={`marker-${index}`}
        longitude={gateway.longitude}
        latitude={gateway.latitude} >
        <GatewayMarker size={20} onClick={() => this.setState({ popupInfo: gateway })} />
      </Marker>
    );
  }

  _renderPopup() {
    const { popupInfo } = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="bottom"
        offsetTop={-10}
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        onClose={() => this.setState({ popupInfo: null })} >
        <GatewayInfo info={popupInfo} />
      </Popup>
    );
  }

  _addGateway() {
    let { gateways } = this.state;
    let newRandomGateway = {
      longitude: -120 - Math.random() * 3,
      latitude: 36 + Math.random() * 2,
      name: `Gateway-${gateways.length + 1}`
    }

    gateways.push(newRandomGateway);
    this.setState({ gateways });
  }

  render() {
    const { viewport } = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN} >

        {this.state.gateways.map(this._renderGatewayMarker)}

        {this._renderPopup()}

        <button
          className="new-gateway-btn"
          onClick={e => this._addGateway()}
        >Add New Gateway</button>

        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._updateViewport} />
        </div>

      </MapGL>
    );
  }
}
