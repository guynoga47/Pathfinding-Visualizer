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
import controllerStyles from "./Controller.Styles";

import GridContext from "../../Context/grid-context";

import * as mappingAlgorithms from "../../Algorithms/mappingAlgorithms";
import * as cleaningAlgorithms from "../../Algorithms/cleaningAlgorithms";

const useStyles = controllerStyles;

const Controller = () => {
  const [anchorElMapAlgMenu, setAnchorElMapAlgMenu] = React.useState(null);
  const [anchorElCleanAlgMenu, setAnchorElCleanAlgMenu] = React.useState(null);
  const [
    anchorElSimulationTypeMenu,
    setAnchorElSimulationType,
  ] = React.useState(null);
  const [codeEditorOpen, setCodeEditorOpen] = React.useState(false);
  const context = useContext(GridContext);
  const classes = useStyles();
  const { drawItem } = context.state;

  const handleAlgorithmSelected = (event) => {
    if (context.state.simulationType === "map") {
      setAnchorElMapAlgMenu(event.currentTarget);
    } else {
      setAnchorElCleanAlgMenu(event.currentTarget);
    }
  };
  const handleMapMenuClose = () => {
    setAnchorElMapAlgMenu(null);
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
    context.updateState("request", "clearWalls");
  };
  const handleClearDustRequested = () => {
    context.updateState("request", "clearDust");
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
            {(context.state.simulationType === "map" ||
              context.state.simulationType === "sweep") && (
              <Button
                className={classes.navButton}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                disabled={context.state.isRunning}
                onClick={handleAlgorithmSelected}
              >
                {context.state.activeAlgorithm
                  ? context.state.activeAlgorithm.shortened
                  : context.state.userAlgorithmResult
                  ? "USER SCRIPT"
                  : "SELECT"}
              </Button>
            )}
            {drawItem === "wall" && (
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
            {drawItem === "dust" && (
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
            {mappingAlgorithms.data.map((algorithm) => (
              <MenuItem
                key={algorithm.name}
                className={classes.menuItem}
                onClick={() => {
                  context.updateState("activeAlgorithm", algorithm);
                  context.updateState("userAlgorithmResult", false);
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
            {cleaningAlgorithms.data.map((algorithm) => (
              <MenuItem
                key={algorithm.name}
                className={classes.menuItem}
                onClick={() => {
                  context.updateState("activeAlgorithm", algorithm);
                  context.updateState("userAlgorithmResult", false);
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
            <Tools />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Controller;
