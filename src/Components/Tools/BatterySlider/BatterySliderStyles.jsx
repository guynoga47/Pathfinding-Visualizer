import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
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

export const prettoSliderStyles = {
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
};
