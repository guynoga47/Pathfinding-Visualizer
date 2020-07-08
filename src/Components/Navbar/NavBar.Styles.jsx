import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  navButton: {
    color: "white !important",
    fontSize: "14px",
    textTransform: "uppercase",
    background: "#1F2833",
    width: "12em",
    textAlign: "center",
    padding: "5px",
    border: "2px solid #66FCF1 !important",
    transition: "all 0.4s ease 0s",
    "&:hover": {
      color: "black !important",
      background: "#66FCF1",
      borderColor: "black !important",
      transition: "all 0.4s ease 0s",
    },
    "&:disabled": {
      color: "#C5C6C7 !important",
      borderColor: "#C5C6C7 !important",
      transition: "all 0.4s ease 0s",
    },
  },
  listItemTxt: {
    textDecoration: "none",
  },
  menuItem: {
    backgroundColor: "#1F2833",
    color: "white",
    fontSize: "4px",
    "&:hover": {
      backgroundColor: "#1f2833",
      color: "#66FCF1",
    },
  },
  toolbar: {
    backgroundColor: "#1F2833",
    height: "6em",
    padding: "0 10px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    height: "6em",
  },
  logoPlaceholder: {
    fontWeight: 500,
    fontStyle: "italic",
  },
  appBar: {
    zIndex: "0",
    marginBottom: "2em",
  },
}));
