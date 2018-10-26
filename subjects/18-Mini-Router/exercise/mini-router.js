////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Implement the core components of React Router to make this app work:
//
// <Router>
// 1. Add some state w/ `location` as a key
// 2. Set `location`'s initial value to `this.history.location`
// 3. Listen to `history` and put the location into state
// 4. Use context to provide API to descendants
//
// <Route>
// 1. Get the location from context
// 2. Figure out if the path matches location.pathname
//    (hint: location.pathname.startsWith(...)
// 3. If there is a match, figure out which prop to render
//    `component` or `render`
// 4. If there is no match, render null
//
// <Link>
// 1. Get a "push" method from context
// 2. Use `push(...)` with the `to` prop
//
// Got extra time?
//
// - Implement <Redirect> or <Switch>
////////////////////////////////////////////////////////////////////////////////

import React from "react";
import PropTypes from "prop-types";
import { createHashHistory } from "history";

const RouteContext = React.createContext();

/*
How to use the history library:

// read the current URL
history.location

// listen for changes to the URL
history.listen(() => {
  history.location // is now different
})

// change the URL
history.push('/something')
*/

class Router extends React.Component {
  history = createHashHistory();

  state = {
    location: this.history.location,
  };

  componentDidMount() {
    this.history.listen(location => {
      this.setState({ location });
    });
  };

  handlePush = to => this.history.push(to);
  handleReplace = to => this.history.replace(to);

  render() {
    return (
      <RouteContext.Provider value={{location: this.state.location}}>
        {this.props.children}
      </RouteContext.Provider>
    );
  }
}

class Navigate extends React.Component {
  go() {
    if (this.props.location.pathname.startsWith(this.props.from)) {
      this.props.replace(this.props.to);
    }
  }
  componentDidMount() {
    this.go();
  }

  componentDidUpdate() {
    this.go();
  }

  render() {
    return null;
  }
}

class Route extends React.Component {
  render() {
    return (
      <RouteContext.Consumer>
        {context => {
          const { path, render, component: Component } = this.props;

          if (router.location.pathname.startsWith(path)) {
            if (render) return render();
            if (Component) return <Component />;
          }

          return null;
        }}
      </RouteContext.Consumer>
    );
  }
}

class Link extends React.Component {
  handleClick = (event, router) => {
    event.preventDefault();
    router.push(this.props.to);
  };

  render() {
    return (
      <RouterContext.Consumer>
        <a
          href={`#${this.props.to}`}
          onClick={event => this.handleClick(event, router)}
        >
          {this.props.children}
        </a>
      </RouterContext.Consumer>
    );
  }
}

class Redirect extends React.Component {
  render() {
    return <RouteContext.Consumer>
      {({ location }) => {
        
        if (location.pathname.startsWith(this.props.from)) {
          replace(this.props.to);
        }
      }}
    </RouteContext.Consumer>
  }
}

export { Router, Route, Link, Redirect };
