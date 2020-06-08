import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

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
        step={null}
        min={15}
        max={35}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </div>
  );
}
