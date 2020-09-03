import React, { useContext } from "react";

import IconButton from "@material-ui/core/IconButton";

import IconDrawFree from "@material-ui/icons/Create";
import IconDrawRectangle from "@material-ui/icons/AspectRatio";
import IconDrawObstacle from "@material-ui/icons/TabUnselected";

import IconSave from "@material-ui/icons/GetApp";
import IconLoad from "@material-ui/icons/Publish";
import IconDust from "@material-ui/icons/BlurOn";
import IconMap from "@material-ui/icons/Map";
import IconWall from "@material-ui/icons/ViewQuilt";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

import GridContext from "../../Context/grid-context";
import InteractiveBattery from "../Tools/InteractiveBattery";
import BatterySlider from "./SliderBattery/BatterySlider";

import ToolsStyles from "./Tools.Styles";

const useStyles = ToolsStyles;

const Tools = (props) => {
  const context = useContext(GridContext);

  const { isRunning, isFinished } = context.state;
  const {
    setHighlightMapRequest,
    setDrawingMode,
    drawingMode,
    setDrawingElement,
    drawingElement,
  } = props;

  const [
    anchorElDrawingElementDust,
    setAnchorElDrawingElementDust,
  ] = React.useState(null);
  const [
    anchorElDrawingElementWall,
    setAnchorElDrawingElementWall,
  ] = React.useState(null);
  const [anchorElDrawFree, setAnchorElDrawFree] = React.useState(null);
  const [anchorElDrawRectangle, setAnchorElDrawRectangle] = React.useState(
    null
  );
  const [
    anchorElSaveConfiguration,
    setAnchorElSaveConfiguration,
  ] = React.useState(null);
  const [
    anchorElLoadConfiguration,
    setAnchorElLoadConfiguration,
  ] = React.useState(null);
  const [anchorElHighlightMap, setAnchorElHighlightMap] = React.useState(null);
  const [anchorElDrawObstacle, setAnchorElDrawObstacle] = React.useState(null);
  const [
    anchorElBatteryCapacityClick,
    setAnchorElBatteryCapacityClick,
  ] = React.useState(null);
  const [
    anchorElBatteryCapacityHover,
    setAnchorElBatteryCapacityHover,
  ] = React.useState(null);

  const handleBatteryCapacityButtonClicked = (event) => {
    setAnchorElBatteryCapacityClick(event.currentTarget);
  };

  const handleBatteryCapacityButtonClosed = (event) => {
    setAnchorElBatteryCapacityClick(null);
  };

  const handlePopoverOpen = (event) => {
    switch (event.currentTarget.id) {
      case "btn-free":
        setAnchorElDrawFree(event.currentTarget);
        break;
      case "btn-rectangle":
        setAnchorElDrawRectangle(event.currentTarget);
        break;
      case "btn-obstacle":
        setAnchorElDrawObstacle(event.currentTarget);
        break;
      case "btn-save":
        setAnchorElSaveConfiguration(event.currentTarget);
        break;
      case "btn-load":
        setAnchorElLoadConfiguration(event.currentTarget);
        break;
      case "btn-map":
        setAnchorElHighlightMap(event.currentTarget);
        break;
      case "btn-battery":
        setAnchorElBatteryCapacityHover(event.currentTarget);
        break;
      case "btn-dust":
        setAnchorElDrawingElementDust(event.currentTarget);
        break;
      case "btn-wall":
        setAnchorElDrawingElementWall(event.currentTarget);
        break;
      default:
        console.log("Default case entered in Tools.jsx: handlePopoverOpen");
    }
  };

  const handlePopoverClose = (event) => {
    switch (event.currentTarget.id) {
      case "btn-free":
        setAnchorElDrawFree(null);
        break;
      case "btn-rectangle":
        setAnchorElDrawRectangle(null);
        break;
      case "btn-obstacle":
        setAnchorElDrawObstacle(null);
        break;
      case "btn-save":
        setAnchorElSaveConfiguration(null);
        break;
      case "btn-load":
        setAnchorElLoadConfiguration(null);
        break;
      case "btn-map":
        setAnchorElHighlightMap(null);
        break;
      case "btn-battery":
        setAnchorElBatteryCapacityHover(null);
        break;
      case "btn-dust":
        setAnchorElDrawingElementDust(null);
        break;
      case "btn-wall":
        setAnchorElDrawingElementWall(null);
        break;
      default:
        console.log("Default case entered in Tools.jsx: handlePopoverClose");
    }
  };

  const handleDustButtonClicked = (event) => {
    setDrawingElement("wall");
    setAnchorElDrawingElementDust(null);
  };
  const handleWallButtonClicked = (event) => {
    setDrawingElement("dust");
    setAnchorElDrawingElementWall(null);
  };

  const handleDrawingModeButtonClicked = (event) => {
    setDrawingMode(
      event.currentTarget.id === "btn-free"
        ? "free"
        : event.currentTarget.id === "btn-rectangle"
        ? "rectangle"
        : "filled rectangle"
    );
  };

  const handleSaveConfiguration = async () => {
    context.saveConfiguration();
  };

  const handleLoadConfiguration = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newLayout = JSON.parse(reader.result);
      context.loadConfiguration(newLayout);
    };
    reader.readAsText(event.target.files[0]);
  };

  const handleMapButtonMouseDown = (event) => {
    setHighlightMapRequest(true);
    console.log(drawingMode);
  };

  /* change to mouse leave to avoid bugs? */
  const handleMapButtonMouseUp = (event) => {
    setHighlightMapRequest(false);
  };

  const classes = useStyles();
  return (
    <div className={classes.tools}>
      {drawingElement === "dust" ? (
        <IconButton
          id={"btn-dust"}
          className={classes.iconActive}
          onClick={handleDustButtonClicked}
          disabled={isRunning}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <IconDust />
        </IconButton>
      ) : (
        <IconButton
          id={"btn-wall"}
          className={classes.iconActive}
          onClick={handleWallButtonClicked}
          disabled={isRunning}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <IconWall />
        </IconButton>
      )}
      <IconButton
        id={"btn-free"}
        className={drawingMode === "free" ? classes.iconActive : classes.icon}
        onClick={handleDrawingModeButtonClicked}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning || isFinished}
      >
        <IconDrawFree />
      </IconButton>
      <IconButton
        id={"btn-rectangle"}
        className={
          drawingMode === "rectangle" ? classes.iconActive : classes.icon
        }
        onClick={handleDrawingModeButtonClicked}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        hidden={true}
        disabled={isRunning || isFinished}
      >
        <IconDrawRectangle />
      </IconButton>
      <IconButton
        id={"btn-obstacle"}
        className={
          drawingMode === "filled rectangle" && !isRunning
            ? classes.iconActive
            : classes.icon
        }
        onClick={handleDrawingModeButtonClicked}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning || isFinished}
      >
        <IconDrawObstacle />
      </IconButton>

      <input
        accept=".json"
        className={classes.input}
        id="icon-button-load-file"
        onChange={handleLoadConfiguration}
        onClick={(event) => {
          //to allow consecutive selection of same files, we need to clear input value after each click.
          event.target.value = "";
        }}
        type="file"
      />
      <label htmlFor="icon-button-load-file">
        <IconButton
          id={"btn-load"}
          className={classes.icon}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          disabled={isRunning}
          component={"span"}
          htmlFor="icon-button-load-file"
        >
          <IconLoad />
        </IconButton>
      </label>

      <IconButton
        id={"btn-save"}
        className={classes.icon}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning}
        onClick={handleSaveConfiguration}
      >
        <IconSave />
      </IconButton>

      <IconButton
        id={"btn-map"}
        className={classes.icon}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning}
        onMouseDown={handleMapButtonMouseDown}
        onMouseUp={handleMapButtonMouseUp}
      >
        <IconMap />
      </IconButton>

      <IconButton
        id={"btn-battery"}
        className={classes.icon}
        onClick={handleBatteryCapacityButtonClicked}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InteractiveBattery />
      </IconButton>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElSaveConfiguration)}
        anchorEl={anchorElSaveConfiguration}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>
          Save Configuration
        </Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElDrawingElementDust)}
        anchorEl={anchorElDrawingElementDust}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Dust</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElDrawingElementWall)}
        anchorEl={anchorElDrawingElementWall}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Wall</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElLoadConfiguration)}
        anchorEl={anchorElLoadConfiguration}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>
          Load Configuration
        </Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElDrawFree)}
        anchorEl={anchorElDrawFree}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Pen</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElDrawObstacle)}
        anchorEl={anchorElDrawObstacle}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>
          Filled Rectangle
        </Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElDrawRectangle)}
        anchorEl={anchorElDrawRectangle}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Rectangle</Typography>
      </Popover>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElHighlightMap)}
        anchorEl={anchorElHighlightMap}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>
          Highlight Robot Map
        </Typography>
      </Popover>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElBatteryCapacityHover)}
        anchorEl={anchorElBatteryCapacityHover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>
          Battery: {context.convertAvailableStepsToBatteryCapacity()}%
        </Typography>
      </Popover>

      <Popover
        id="simple-popover"
        open={Boolean(anchorElBatteryCapacityClick)}
        anchorEl={anchorElBatteryCapacityClick}
        onClose={handleBatteryCapacityButtonClosed}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <BatterySlider />
      </Popover>
    </div>
  );
};

export default Tools;
