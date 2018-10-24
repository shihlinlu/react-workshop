////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Make `withMouse` a "higher-order component" that sends the mouse position
//   to the component as props (hint: use `event.clientX` and `event.clientY`).
//
// Got extra time?
//
// - Make a `withCat` HOC that shows a cat chasing the mouse around the screen!
////////////////////////////////////////////////////////////////////////////////
import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// HOC component
function withMouse(Component) {
  return class AppWithMouse extends React.Component {
    state = {
      mouse: {
        x: 0,
        y: 0,
      }
    };

    onMouseMove = (e) => {
      // e.persist();
      this.setState({ mouse: { x: e.screenX, y: e.screenY } });
    };

    render () {
      return (
        <div onMouseMove={this.onMouseMove}>
          <Component mouse={this.state.mouse} />
        </div>
        )

    }
  }
}

// withCat HOC
function withCat(Component) {
  return class extends React.Component {

    render() {
      let { mouse } = this.props;
      let style = { top: mouse.y - 50, left: mouse.x - 50 };

      return (
        <React.Fragment>
          <div className="cat" style={style} />
          <Component {...this.props} />
        </React.Fragment>
      )
    }
  }
}

// main component
class App extends React.Component {
  static propTypes = {
    mouse: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    onMouseMove: PropTypes.func,
  };

  render() {
    const { mouse } = this.props;

    return (
      <div className="container" onMouseMove={this.props.onMouseMove}>
        {mouse ? (
          <h1>
            The mouse position is ({mouse.x}, {mouse.y})
          </h1>
        ) : (
          <h1>We don't know the mouse position yet :(</h1>
        )}
      </div>
    )
  }
}

// wrapped HOC
const AppWithMouse = withMouse(withCat(App));

ReactDOM.render(<AppWithMouse />, document.getElementById("app"));
