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
import Tools from "../Tools/Tools";

const useStyles = makeStyles((theme) => ({
  navButton: {
    color: "white !important",
    fontSize: "14px",
    textTransform: "uppercase",
    background: "#1F2833",
    width: "12em",
    textAlign: "center",
    padding: "10",
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
  const [anchorElAlgMenu, setAnchorElAlgMenu] = React.useState(null);

  const classes = useStyles();
  const {
    algorithms,
    activeAlgorithm,
    setActiveAlgorithm,
    setClearWallsRequest,
    setSaveLayoutRequest,
    drawingMode,
    setDrawingMode,
    isRunning,
    isFinished,
  } = props;

  const handleAlgorithmSelectionClicked = (event) => {
    setAnchorElAlgMenu(event.currentTarget);
  };

  const handleClearWallsRequested = () => {
    setClearWallsRequest({ cleared: false, requested: true });
  };

  const handleClose = () => {
    setAnchorElAlgMenu(null);
  };

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {/* <img className={classes.logo} src={logo} alt="pathfinding logo" /> */}
        <Typography variant="h4" className={classes.logoPlaceholder}>
          Pathfinder
        </Typography>
        <Button
          className={classes.navButton}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          onClick={handleAlgorithmSelectionClicked}
        >
          {activeAlgorithm ? activeAlgorithm.shortened : "select"}
        </Button>
        <Button
          className={classes.navButton}
          aria-haspopup="true"
          disabled={isRunning}
          variant="contained"
          onClick={handleClearWallsRequested}
        >
          Clear Walls
        </Button>
        <StyledMenu
          className={classes.menu}
          id="customized-menu"
          anchorEl={anchorElAlgMenu}
          keepMounted
          open={Boolean(anchorElAlgMenu)}
          onClose={handleClose}
        >
          {algorithms.map((algorithm) => (
            <MenuItem
              key={algorithm.name}
              className={classes.menuItem}
              onClick={() => {
                setActiveAlgorithm(algorithm);
                handleClose();
              }}
            >
              <ListItemText
                primary={algorithm.name}
                className={classes.menuItemText}
              />
            </MenuItem>
          ))}
        </StyledMenu>
        <Tools
          isRunning={isRunning}
          isFinished={isFinished}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          setSaveLayoutRequest={setSaveLayoutRequest}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
/* 
TODO:

1. Move some styling to theme.js.
 */
