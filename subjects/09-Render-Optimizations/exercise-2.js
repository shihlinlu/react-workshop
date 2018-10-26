////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Modify <ListView> so that it only renders the list items that are visible!
//
// Got extra time?
//
// - Render fewer rows as the size of the window changes (hint: Listen
//   for the window's "resize" event)
// - Remember the scroll position when you refresh the page (preserve the scroll position
////////////////////////////////////////////////////////////////////////////////
import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import * as RainbowListDelegate from "./RainbowListDelegate";
import {rowHeight} from "./RainbowListDelegate";

const pageSize = 100;

class ListView extends React.Component {
  static propTypes = {
    numRows: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    renderRowAtIndex: PropTypes.func.isRequired
  };

  state = {
    availableHeight: window.innerHeight,
    scrollPosition: localStorage.scrollPosition ? parseInt(localStorage.scrollPosition) : 0,
  };

  // lastItemRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      lastIndex: Math.min(props.numRows, pageSize),
      page: 1,
    }
  }

  onScroll = (e) => {
    const { rowHeight } = this.props;
    const { lastIndex } = this.state;
    if (e.target.scrollTop > ((lastIndex / 2) * rowHeight)) {
      this.setState({
        lastIndex: Math.min(this.props.numRows, (pageSize * (this.state.page + 1))),
        page: this.state.page + 1,
      });
    }
  };

  handleScroll = event => {
    this.setState({ scrollPosition: event.target.scrollTop });
  };

  handleBeforeUnload = () => {
    localStorage.scrollposition - this.state.scrollPosition;
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    if (this.state.scrollPosition !== this.scroller.scrollTop) {
      this.scroller.scrollTop = this.state.scrollPosition;
    }
  };

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.state )
  }

  render() {
    const { availableHeight, scrollPosition } = this.state;
    const { numRows, rowHeight, renderRowAtIndex } = this.props;
    const { lastIndex } = this.state;
    const totalHeight = numRows * rowHeight;

    const items = [];

    let startingIndex = Math.floor(scrollPosition / rowHeight);
    let endingIndex = Math.min(
      numRows,
      Math.ceil((scrollPosition + availableHeight) / rowHeight));

    let index = startingIndex;
    while (index < endingIndex) {
      items.push(<li key={index}>{renderRowAtIndex(index)}</li>);
      index++;
    }

    const scrollControl = numRows > lastIndex;

    return (
      <div style={{ height: "100vh", overflowY: "scroll" }} onScroll={scrollControl ? this.onScroll : undefined}>
        <div style={{ height: totalHeight }}>
          <ol>{items}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ListView
    numRows={5000}
    rowHeight={RainbowListDelegate.rowHeight}
    renderRowAtIndex={RainbowListDelegate.renderRowAtIndex}
  />,
  document.getElementById("app")
);
