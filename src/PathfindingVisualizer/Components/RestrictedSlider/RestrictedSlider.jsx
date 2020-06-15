import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "../Sliders/Base";

const MIN = 15;
const MAX = 35;

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

export default function DiscreteSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(25);
  const { disabled } = props;
  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.onGridSizeChange(newValue);
  };
  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-restrict" gutterBottom>
        Grid Size
      </Typography>
      <Slider
        defaultValue={25}
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
