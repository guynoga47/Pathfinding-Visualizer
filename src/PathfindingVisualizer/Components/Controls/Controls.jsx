import React from "react";
import SimpleSlider from "../SimpleSlider/SimpleSlider";
import RestrictedSlider from "../RestrictedSlider/RestrictedSlider";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayCircleFilledWhite";
import ResetIcon from "@material-ui/icons/RotateLeftTwoTone";
import Spinner from "../Spinner/Spinner";

const Controls = (props) => {
  const {
    isFinished,
    isRunning,
    resetButtonClicked,
    runActiveAlgorithm,
    handleSpeedChange,
    handleGridSizeChange,
  } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "2em",
        marginRight: "7.5em",
      }}
    >
      <RestrictedSlider
        onGridSizeChange={handleGridSizeChange}
        disabled={isRunning}
      />
      {isRunning ? (
        <IconButton disabled={isRunning}>
          <Spinner />
        </IconButton>
      ) : isFinished ? (
        <IconButton
          disabled={isRunning}
          color="primary"
          onClick={() => resetButtonClicked()}
        >
          <ResetIcon style={{ fontSize: "2em" }} />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={() => runActiveAlgorithm()}>
          <PlayIcon style={{ fontSize: "2em" }} />
        </IconButton>
      )}
      {/* {isRunning || isFinished ? (
        <IconButton
          disabled={isRunning}
          color="primary"
          onClick={() => resetButtonClicked()}
        >
          <ResetIcon style={{ fontSize: "2em" }} />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={() => visualizeDijkstra()}>
          <PlayIcon style={{ fontSize: "2em" }} />
        </IconButton>
      )} */}
      <SimpleSlider
        min={5}
        max={30}
        onSpeedChange={handleSpeedChange}
        disabled={isRunning}
      />
    </div>
  );
};

export default Controls;
