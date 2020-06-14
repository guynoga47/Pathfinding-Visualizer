import React from "react";
import SimpleSlider from "../SimpleSlider/SimpleSlider";
import RestrictedSlider from "../RestrictedSlider/RestrictedSlider";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayCircleFilledWhite";
import ResetIcon from "@material-ui/icons/RotateLeftTwoTone";
import Spinner from "../Spinner/Spinner";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  controls: {
    color: "#1F2833",
  },
  btnRunAlgorithm: {
    /*     backgroundColor: "#1F2833",
    borderColor: "#1F2833", */
    color: "#1F2833",
  },
}));

const Controls = (props) => {
  const classes = useStyles();
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
          color="secondary"
          onClick={() => resetButtonClicked()}
        >
          <ResetIcon style={{ fontSize: "2em" }} />
        </IconButton>
      ) : (
        <IconButton
          className={classes.btnRunAlgorithm}
          onClick={() => runActiveAlgorithm()}
        >
          <PlayIcon style={{ fontSize: "2em" }} />
        </IconButton>
      )}
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
