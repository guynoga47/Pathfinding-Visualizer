import React from "react";
import SpeedSlider from "../SliderContinuous/ContinuousSlider";
import GridSizeSlider from "../SliderRestricted/RestrictedSlider";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayCircleFilledWhite";
import ResetIcon from "@material-ui/icons/RotateLeftTwoTone";
import Spinner from "../Spinner/Spinner";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    color: "#1F2833",
  },
}));

const Controls = (props) => {
  const classes = useStyles();
  const {
    isFinished,
    isRunning,
    isAlgorithmSelected,
    resetButtonClicked,
    playButtonClicked,
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
      <GridSizeSlider
        onGridSizeChange={handleGridSizeChange}
        disabled={isRunning}
      />
      {isRunning ? (
        <IconButton disabled>
          <Spinner />
        </IconButton>
      ) : isFinished ? (
        <IconButton className={classes.button} onClick={resetButtonClicked}>
          <ResetIcon style={{ fontSize: "2em" }} />
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          onClick={playButtonClicked}
          disabled={!isAlgorithmSelected}
        >
          <PlayIcon style={{ fontSize: "2em" }} />
        </IconButton>
      )}
      <SpeedSlider
        min={20}
        max={40}
        onSpeedChange={handleSpeedChange}
        disabled={isRunning || !isAlgorithmSelected}
      />
    </div>
  );
};

export default Controls;

/*
TODO
1. Centralize styles
*/
