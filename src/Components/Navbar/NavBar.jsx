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
  const [anchorElMapAlgMenu, setAnchorElMapAlgMenu] = React.useState(null);
  const [anchorElPathAlgMenu, setAnchorElPathAlgMenu] = React.useState(null);
  const [
    anchorElSimulationTypeMenu,
    setAnchorElSimulationType,
  ] = React.useState(null);
  const context = useContext(GridContext);
  const classes = useStyles();
  const {
    mappingAlgorithms,
    pathfindingAlgorithms,
    setClearWallsRequest,
    setHighlightMapRequest,
    drawingMode,
    setDrawingMode,
  } = props;

  const handleMapAlgorithmSelectionClicked = (event) => {
    setAnchorElMapAlgMenu(event.currentTarget);
  };
  const handleMapMenuClose = () => {
    setAnchorElMapAlgMenu(null);
  };
  const handlePathfindingAlgorithmSelectionClicked = (event) => {
    setAnchorElPathAlgMenu(event.currentTarget);
  };
  const handlePathMenuClose = () => {
    setAnchorElPathAlgMenu(null);
  };
  const handleSimulationTypeSelectionClicked = (event) => {
    setAnchorElSimulationType(event.currentTarget);
  };
  const handleSimulationTypeMenuClose = () => {
    setAnchorElSimulationType(null);
  };

  const handleClearWallsRequested = () => {
    setClearWallsRequest({ cleared: false, requested: true });
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
              onClick={handleSimulationTypeSelectionClicked}
            >
              {context.state.simulationType
                ? context.state.simulationType
                : "SIMULATION TYPE"}
            </Button>
            <Button
              className={classes.navButton}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              disabled={
                context.state.isRunning ||
                !(context.state.simulationType === "map")
              }
              onClick={handleMapAlgorithmSelectionClicked}
            >
              {context.state.activeMappingAlgorithm
                ? context.state.activeMappingAlgorithm.shortened
                : "SELECT MAP"}
            </Button>
            <Button
              className={classes.navButton}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              disabled={
                context.state.isRunning ||
                !(context.state.simulationType === "sweep")
              }
              onClick={handlePathfindingAlgorithmSelectionClicked}
            >
              {context.state.activePathfindingAlgorithm
                ? context.state.activePathfindingAlgorithm.shortened
                : "SELECT SWEEP"}
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
            anchorEl={anchorElSimulationTypeMenu}
            keepMounted
            open={Boolean(anchorElSimulationTypeMenu)}
            onClose={handleSimulationTypeMenuClose}
          >
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                context.updateState("simulationType", "map");
                handleSimulationTypeMenuClose();
              }}
            >
              <ListItemText primary="MAP" className={classes.menuItemText} />
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                context.updateState("simulationType", "sweep");
                handleSimulationTypeMenuClose();
              }}
            >
              <ListItemText primary="SWEEP" className={classes.menuItemText} />
            </MenuItem>
          </StyledMenu>
          <StyledMenu
            className={classes.menu}
            id="customized-menu"
            anchorEl={anchorElMapAlgMenu}
            keepMounted
            open={Boolean(anchorElMapAlgMenu)}
            onClose={handleMapMenuClose}
          >
            {mappingAlgorithms.map((algorithm) => (
              <MenuItem
                key={algorithm.name}
                className={classes.menuItem}
                onClick={() => {
                  context.updateState("activeMappingAlgorithm", algorithm);
                  handleMapMenuClose();
                }}
              >
                <ListItemText
                  primary={algorithm.name}
                  className={classes.menuItemText}
                />
              </MenuItem>
            ))}
          </StyledMenu>
          <StyledMenu
            className={classes.menu}
            id="customized-menu"
            anchorEl={anchorElPathAlgMenu}
            keepMounted
            open={Boolean(anchorElPathAlgMenu)}
            onClose={handlePathMenuClose}
          >
            {pathfindingAlgorithms.map((algorithm) => (
              <MenuItem
                key={algorithm.name}
                className={classes.menuItem}
                onClick={() => {
                  context.updateState("activePathfindingAlgorithm", algorithm);
                  handlePathMenuClose();
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
              setHighlightMapRequest={setHighlightMapRequest}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
