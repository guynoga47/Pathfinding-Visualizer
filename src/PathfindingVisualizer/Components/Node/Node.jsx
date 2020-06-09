import React, { PureComponent } from "react";
import StartNodeIcon from "@material-ui/icons/KeyboardArrowRight";
import FinishNodeIcon from "@material-ui/icons/TrackChanges";
import "./Node.css";

export default class Node extends PureComponent {
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = this.props;
    const extraClassName = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : "";
    const nodeJSX = (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseLeave={() => onMouseLeave(row, col)}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* {isStart ? <StartNodeIcon /> : isFinish ? <FinishNodeIcon /> : ""*/}
      </div>
    );
    return nodeJSX;
  }
}
