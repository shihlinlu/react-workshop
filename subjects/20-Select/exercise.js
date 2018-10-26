////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make this work like a normal <select> box!
////////////////////////////////////////////////////////////////////////////////
import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// select dropdown
class Select extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any
  };

  // called before the initial render
  // static getDerivedStateFromProps(nextProps) {
  //   if (
  //     nextProps.value !== null  && nextProps.value ! == nextState.value) {
  //     return { value: nexProps.value }
  //   }}
  //
  //   )
  // }

  state = { showOptions: false };

  toggleOptions = () => {
    this.setState({ showOptions: !this.state.showOptions });
  };

  componentDidMount() {
    if (this.isControlled() && !this.props.onChange) {
      console.warn('This <Select> is gonna be read-only');
    }
  }

  selectValue = value => {
    if (this.isControlled()) {
      this.props.onChange(value)
    } else {
      this.setState({ value });
    }
  };

  isControlled = () => this.props.value != null;


  render() {
    let { value } = this.isControlled() ? this.props : this.state;

    let label;
    React.Children.map(this.props.children, child => {
      if (child.props.value === value) {
        label = child.props.children;
      }
    });

    return (
      <div className="select" onClick={this.toggleOptions}>
        <div className="label">
          {value || defaultValue } <span className="arrow">▾</span>
        </div>
        {this.state.showOptions && (
          <div className="options">{React.Children.map(this.props.children , chld => React.cloneElement(child, {
            _onSelect: () => this.set
          }))}</div>
        )}
      </div>
    );
  }
}

// selected value
// class Option extends React.Component {
//   render() {
//     const { selectValue } = this.props;
//     return <div className="option" onClick={}>{this.props.children}</div>;
//   }
// }

class App extends React.Component {
  state = {
    selectValue: "dosa",
    inputValue: "",
  };

  setToMintChutney = () => {
    this.setState({ selectValue: "mint-chutney" });
  };

  _handleOnChange = (event) => {
    this.setState({ selectValue: event.target.value });
  };

  render() {
    return (
      <div>
        <h1>Select</h1>

        <h2>Uncontrolled</h2>

        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Controlled</h2>

        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <p>
          <button onClick={this.setToMintChutney}>
            Set to Mint Chutney
          </button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={value => this.setState({ selectValue: value })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
