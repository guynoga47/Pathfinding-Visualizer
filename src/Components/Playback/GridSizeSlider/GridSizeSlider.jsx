import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "../Sliders/Base";

import GridContext from "../../../Context/grid-context";

const MIN = 15;
const MAX = 35;
const DEFAULT_VALUE = 25;

const useStyles = makeStyles({
  root: {
    width: 300,
    marginRight: "2em",
    textAlign: "center",
  },
});

const marks = [
  {
    value: 15,
    label: "15x30",
  },
  {
    value: 20,
    label: "20x40",
  },
  {
    value: 25,
    label: "25x50",
  },
  {
    value: 30,
    label: "30x60",
  },
  {
    value: 35,
    label: "35x70",
  },
];

function valuetext(value) {
  return `${value}x${value * 2}`;
}

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

export default function GridSizeSlider({ disabled, onGridSizeChange }) {
  const context = useContext(GridContext);
  const classes = useStyles();
  const [value, setValue] = useState(DEFAULT_VALUE);

  useEffect(() => {
    if (context.state.configLoaded) {
      console.log("layout loaded in restrictedSlider");
      if (context.state.grid.length !== value) {
        setValue(context.state.grid.length);
      }
    }
  }, [context.state.configLoaded, context.state.grid.length, value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onGridSizeChange(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-restrict" gutterBottom>
        Grid Size
      </Typography>
      <Slider
        value={value}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-restrict"
        onChange={handleChange}
        disabled={disabled}
        step={null}
        min={MIN}
        max={MAX}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </div>
  );
}
