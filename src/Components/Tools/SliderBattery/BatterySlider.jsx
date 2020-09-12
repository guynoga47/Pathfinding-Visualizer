import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import PowerIcon from "@material-ui/icons/Power";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import GridContext from "../../../Context/grid-context";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
    textAlign: "center",
    marginTop: "0.5em",
    paddingLeft: "2em",
    paddingRight: "2em",
    marginBottom: "0.5em",
  },
  margin: {
    height: theme.spacing(3),
  },
}));

function ValueLabelComponent({ children, open, value }) {
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const PrettoSlider = withStyles({
  root: {
    color: "#1f2833",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default function CustomizedSlider() {
  const classes = useStyles();
  const context = useContext(GridContext);

  const [value, setValue] = useState(
    context.convertAvailableStepsToBatteryCapacity()
  );

  const handleChange = (event, newValue) => {
    if (context.state.isRunning) return;
    setValue(newValue);
  };

  const handleSetBatteryButtonClicked = () => {
    const steps = context.convertBatteryCapacityToAvailableSteps(value);
    context.updateState("availableSteps", steps);
  };

  useEffect(() => {
    const newValue = context.convertAvailableStepsToBatteryCapacity();
    setValue(newValue);
  }, [context]);

  return (
    <div className={classes.root}>
      <Typography gutterBottom>Set Battery</Typography>
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        value={value}
        onChange={handleChange}
      />
      <IconButton
        color="primary"
        onClick={handleSetBatteryButtonClicked}
        disabled={context.state.isRunning}
      >
        <PowerIcon
          style={{
            fontSize: "32px",
          }}
        />
      </IconButton>
    </div>
  );
}
