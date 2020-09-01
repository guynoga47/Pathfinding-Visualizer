import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "pre-line",
  },
  paper: {
    boxShadow: theme.shadows[5],
  },
}));
