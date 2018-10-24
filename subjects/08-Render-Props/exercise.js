////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Create a <GeoPosition> component that encapsulates the geo state and
//   watching logic and uses a render prop to pass the coordinates back to
//   the <App>
//
// Got extra time?
//
// - Create a <GeoAddress> component that translates the geo coordinates to a
//   physical address and prints it to the screen (hint: use
//   `getAddressFromCoords`)
// - You should be able to compose <GeoPosition> and <GeoAddress> beneath it to
//   naturally compose both the UI and the state needed to render it
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import getAddressFromCoords from "./utils/getAddressFromCoords";
import LoadingDots from "./LoadingDots";

// handles all logic to determine geoposition
class GeoPosition extends React.Component {
  state = {
    coords: {
      latitude: null,
      longitude: null
    },
    error: null
  };

  componentDidMount() {
    this.geoId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      error => {
        this.setState({ error });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId);
  }

  render() {
    const { children } = this.props;
    const { coords, error } = this.state;
    return (
      children(coords, error)
    )
  }
}

// requires google maps geocoding api key
class GeoAddress extends React.Component {
  state = { address: null };

  fetchAddress() {
    let { lat, long} = this.props;

    if (lat && long ) {
      getAddressFromCoords(lat, long).then(address => {
        this.setState({ address });
      });
    }
  }

  componentDidMount() {
    this.fetchAddress();
  }

  componentDidUpdate(prevProps) {
    let { lat: prevLat, long: prevLong } = prevProps;
    let { lat: nextLat, long: nextLong } = this.props;

    if (prevLat !== nextLat || prevLong !== nextLong) {
      this.fetchAddress();
    }

  }

  render() {
    return this.props.children(this.state.address);

  }
}

class App extends React.Component {
  // takes coordinates and error and returns component
  renderDefinitionList = (coords, error) => (
    <div>
      <h1>Geolocation</h1>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <React.Fragment>
          <dl>
            <dt>Latitude</dt>
            <dd>{coords.latitude || <LoadingDots />}</dd>
            <dt>Longitude</dt>
            <dd>{coords.longitude || <LoadingDots />}</dd>
          </dl>

          <GeoAddress
            lat={coords.latitude}
            long={coords.longitude}
          >
            {address => (
              <marquee> The address is {address || <LoadingDots />}
              </marquee>
            )}
          </GeoAddress>
        </React.Fragment>
      )}
    </div>
  );

  render() {
    return (
      <GeoPosition>
        {this.renderDefinitionList}
      </GeoPosition>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
