import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isStart, isFinish } = this.props;
    const extraClassName = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : "";
    return <div className={`node ${extraClassName}`}></div>;
  }
}
