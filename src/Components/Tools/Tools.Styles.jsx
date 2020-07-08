import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  input: {
    display: "none",
  },
  icon: {
    color: "white",
    "&:hover": {
      color: "#66FCF1 !important",
      background: "#1f2833",
      borderColor: "black !important",
      transition: "all 0.4s ease 0s",
    },
    "&:disabled": {
      color: "#C5C6C7",
      transition: "all 0.4s ease 0s",
    },
  },
  iconActive: {
    color: "#66FCF1 !important",
    background: "#1f2833",
    borderColor: "black !important",
    transition: "all 0.4s ease 0s",
    "&:disabled": {
      color: "#C5C6C7 !important",
      transition: "all 0.4s ease 0s",
    },
  },
  popover: {
    pointerEvents: "none",
  },
  popoverText: {
    padding: "5px",
  },
}));
