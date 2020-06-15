import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import { dfs, bfs } from "../../Algorithms/unweightedAlgorithms";

const useStyles = makeStyles((theme) => ({
  btnSelectAlgorithm: {
    color: "white !important",
    fontFamily: "Orbitron",
    textTransform: "uppercase",
    textDecoration: "none",
    background: "#1F2833",
    width: "7em",
    textAlign: "center",
    padding: "10px",
    border: "2px solid #66FCF1 !important",
    display: "inline-block",
    transition: "all 0.4s ease 0s",
    "&:hover": {
      color: "black !important",
      background: "#66FCF1",
      borderColor: "black !important",
      transition: "all 0.4s ease 0s",
    },
  },
  listItemTxt: {
    textDecoration: "none",
  },
  menuItem: {
    backgroundColor: "#1F2833",
    color: "white",
    "&:hover": {
      backgroundColor: "#1f2833",
      color: "#66FCF1",
    },
  },
  toolbar: {
    display: "flex",
    backgroundColor: "#1F2833",
    height: "6em",
    justifyContent: "flex-start",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    height: "6em",
  },
  logoPlaceholder: {
    fontWeight: 500,
    marginRight: "2em",
    fontStyle: "italic",
  },
  appBar: {
    zIndex: "0",
    marginBottom: "2em",
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    backgroundColor: "#1F2833",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const Nav = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const { activeAlgorithm, setActiveAlgorithm } = props;
  const algorithms = [
    { name: "Depth-first Search", function: dfs },
    { name: "Breadth-first Search", function: bfs },
  ];
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {/* <img className={classes.logo} src={logo} alt="pathfinding logo" /> */}
        <Typography variant="h4" className={classes.logoPlaceholder}>
          Pathfinder
        </Typography>
        <Button
          className={classes.btnSelectAlgorithm}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          onClick={handleClick}
        >
          {activeAlgorithm === "Depth-first Search"
            ? "DFS"
            : activeAlgorithm === "Breadth-first Search"
            ? "BFS"
            : "Select"}
        </Button>
        <StyledMenu
          className={classes.menu}
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {algorithms.map((algorithm) => (
            <MenuItem
              key={algorithm.name}
              className={classes.menuItem}
              onClick={() => {
                setActiveAlgorithm({
                  name: algorithm.name,
                  function: algorithm.function,
                });
                handleClose();
              }}
            >
              <ListItemText primary={algorithm.name} />
            </MenuItem>
          ))}
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
