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
    state = { x: 0, y: 0 };

    onMouseMove = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY
      });
    };

    render () {
      return (
        <div onMouseMove={this.onMouseMove}>
          <Component {...this.props} mouse={this.state} />
        </div>
        )

    }
  }
}

// withCat HOC
function withCat(Component) {
  return class extends React.Component {
    state = { top: 0, left: 0 };

    componentDidUpdate(prevProps) {
      const { mouse } = this.props;

      if (
        mouse.x !== prevProps.mouse.x ||
        mouse.y !== prevProps.mouse.y
      ) {
        this.setState({
          top: mouse.y - Math.round(this.node.offsetHeight / 3),
          left: mouse.x - Math.round(this.node.offsetWidth / 3)
        });
      }
    }

    render() {
      return (
        <div>
          <div
            ref={node => (this.node = node)}
            className="cat"
            style={this.state}
          />
          <Component {...this.props} />
        </div>
      );
    }
  };
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
