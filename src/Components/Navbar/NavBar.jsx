import React, { useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import CodeIcon from "@material-ui/icons/Code";

import Editor from "../Editor/Editor";

import Tools from "../Tools/Tools";

import StyledMenu from "./StyledMenu";
import NavBarStyles from "./NavBar.Styles";

import GridContext from "../../Context/grid-context";

const useStyles = NavBarStyles;

const Nav = (props) => {
  const [anchorElMapAlgMenu, setAnchorElMapAlgMenu] = React.useState(null);
  const [anchorElCleanAlgMenu, setAnchorElCleanAlgMenu] = React.useState(null);
  const [
    anchorElSimulationTypeMenu,
    setAnchorElSimulationType,
  ] = React.useState(null);
  const [codeEditorOpen, setCodeEditorOpen] = React.useState(false);
  const context = useContext(GridContext);
  const classes = useStyles();
  const {
    mappingAlgorithms,
    cleaningAlgorithms,
    setClearWallsRequest,
    setClearDustRequest,
    setHighlightMapRequest,
    drawingMode,
    setDrawingMode,
    setDrawingElement,
    drawingElement,
  } = props;

  const handleMapAlgorithmSelectionClicked = (event) => {
    setAnchorElMapAlgMenu(event.currentTarget);
  };
  const handleMapMenuClose = () => {
    setAnchorElMapAlgMenu(null);
  };
  const handleCleaningAlgorithSelectionClicked = (event) => {
    setAnchorElCleanAlgMenu(event.currentTarget);
  };
  const handleCleanAlgMenuClose = () => {
    setAnchorElCleanAlgMenu(null);
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
  const handleClearDustRequested = () => {
    setClearDustRequest({ cleared: false, requested: true });
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
              style={{ marginLeft: "10em" }}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleSimulationTypeSelectionClicked}
            >
              {context.state.simulationType
                ? context.state.simulationType
                : "SIMULATION TYPE"}
            </Button>
            {context.state.simulationType !== "map" &&
              context.state.simulationType !== "sweep" && (
                <Button
                  className={classes.navButton}
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                  variant="contained"
                  disabled={true}
                >
                  SELECT
                </Button>
              )}
            {context.state.simulationType === "map" && (
              <Button
                className={classes.navButton}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                disabled={context.state.isRunning}
                onClick={handleMapAlgorithmSelectionClicked}
              >
                {context.state.activeMappingAlgorithm
                  ? context.state.activeMappingAlgorithm.shortened
                  : context.state.userRun
                  ? "USER SCRIPT"
                  : "SELECT"}
              </Button>
            )}
            {context.state.simulationType === "sweep" && (
              <Button
                className={classes.navButton}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                disabled={
                  context.state.isRunning ||
                  !(context.state.simulationType === "sweep")
                }
                onClick={handleCleaningAlgorithSelectionClicked}
              >
                {context.state.activeCleaningAlgorithm
                  ? context.state.activeCleaningAlgorithm.shortened
                  : context.state.userRun
                  ? "USER SCRIPT"
                  : "SELECT"}
              </Button>
            )}
            {drawingElement === "wall" && (
              <Button
                className={classes.navButton}
                aria-haspopup="true"
                disabled={context.state.isRunning}
                variant="contained"
                onClick={handleClearWallsRequested}
              >
                Clear Walls
              </Button>
            )}
            {drawingElement === "dust" && (
              <Button
                className={classes.navButton}
                aria-haspopup="true"
                disabled={context.state.isRunning}
                variant="contained"
                onClick={handleClearDustRequested}
              >
                Clear Dust
              </Button>
            )}
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
                  context.updateState("userRun", false);
                  handleMapMenuClose();
                }}
              >
                <ListItemText
                  primary={algorithm.name}
                  className={classes.menuItemText}
                />
              </MenuItem>
            ))}
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                setCodeEditorOpen(true);
                handleMapMenuClose();
              }}
            >
              <ListItemText
                primary="Try it yourself!"
                className={classes.menuItemText}
              />
              <CodeIcon />
            </MenuItem>
          </StyledMenu>
          <StyledMenu
            className={classes.menu}
            id="customized-menu"
            anchorEl={anchorElCleanAlgMenu}
            keepMounted
            open={Boolean(anchorElCleanAlgMenu)}
            onClose={handleCleanAlgMenuClose}
          >
            {cleaningAlgorithms.map((algorithm) => (
              <MenuItem
                key={algorithm.name}
                className={classes.menuItem}
                onClick={() => {
                  context.updateState("activeCleaningAlgorithm", algorithm);
                  context.updateState("userRun", false);
                  handleCleanAlgMenuClose();
                }}
              >
                <ListItemText
                  primary={algorithm.name}
                  className={classes.menuItemText}
                />
              </MenuItem>
            ))}
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                setCodeEditorOpen(true);
                handleMapMenuClose();
              }}
            >
              <ListItemText
                primary="Try it yourself!"
                className={classes.menuItemText}
              />
            </MenuItem>
          </StyledMenu>
          <Grid item hidden>
            <Editor
              setCodeEditorOpen={setCodeEditorOpen}
              open={codeEditorOpen}
            />
          </Grid>
          <Grid item>
            <Tools
              isRunning={context.state.isRunning}
              isFinished={context.state.isFinished}
              drawingMode={drawingMode}
              setDrawingMode={setDrawingMode}
              setHighlightMapRequest={setHighlightMapRequest}
              drawingElement={drawingElement}
              setDrawingElement={setDrawingElement}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
