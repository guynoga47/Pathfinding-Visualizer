import React, { useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";

import Tools from "../Tools/Tools";

import StyledMenu from "./StyledMenu";
import NavBarStyles from "./NavBar.Styles";

import GridContext from "../../Context/grid-context";

const useStyles = NavBarStyles;

const Nav = (props) => {
  const [anchorElAlgMenu, setAnchorElAlgMenu] = React.useState(null);
  const context = useContext(GridContext);
  const classes = useStyles();
  const {
    algorithms,
    setClearWallsRequest,
    setSaveLayoutRequest,
    drawingMode,
    setDrawingMode,
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
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" className={classes.logoPlaceholder}>
              Pathfinder
            </Typography>
          </Grid>
          <Grid item>
            <Button
              className={classes.navButton}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleAlgorithmSelectionClicked}
            >
              {context.state.activeAlgorithm
                ? context.state.activeAlgorithm.shortened
                : "select"}
            </Button>
            <Button
              className={classes.navButton}
              aria-haspopup="true"
              disabled={context.state.isRunning}
              variant="contained"
              onClick={handleClearWallsRequested}
            >
              Clear Walls
            </Button>
          </Grid>

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
                  context.updateState("activeAlgorithm", algorithm);
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
          <Grid item>
            <Tools
              isRunning={context.state.isRunning}
              isFinished={context.state.isFinished}
              drawingMode={drawingMode}
              setDrawingMode={setDrawingMode}
              setSaveLayoutRequest={setSaveLayoutRequest}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
/* 
TODO:

1. Move some styling to theme.js.
 */
