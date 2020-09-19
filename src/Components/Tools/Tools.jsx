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
//prettier-ignore
const Tools = () => {
  const context = useContext(GridContext);

  const { isRunning, isFinished, drawItem, drawMethod } = context.state;

  const [anchorElDrawingItemDust, setAnchorElDrawingItemDust] = React.useState(null);
  const [anchorElDrawingItemWall, setAnchorElDrawingItemWall] = React.useState(null);
  const [anchorElDrawFree, setAnchorElDrawFree] = React.useState(null);
  const [anchorElDrawRectangle, setAnchorElDrawRectangle] = React.useState(null);
  const [anchorElSaveConfiguration,setAnchorElSaveConfiguration] = React.useState(null);
  const [anchorElLoadConfiguration,setAnchorElLoadConfiguration] = React.useState(null);
  const [anchorElHighlightMap, setAnchorElHighlightMap] = React.useState(null);
  const [anchorElDrawObstacle, setAnchorElDrawObstacle] = React.useState(null);
  const [anchorElBatteryCapacityClick,setAnchorElBatteryCapacityClick] = React.useState(null);
  const [anchorElBatteryCapacityHover,setAnchorElBatteryCapacityHover] = React.useState(null);

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
      case "btn-saveConfig":
        setAnchorElSaveConfiguration(event.currentTarget);
        break;
      case "btn-loadConfig":
        setAnchorElLoadConfiguration(event.currentTarget);
        break;
      case "btn-map":
        setAnchorElHighlightMap(event.currentTarget);
        break;
      case "btn-battery":
        setAnchorElBatteryCapacityHover(event.currentTarget);
        break;
      case "btn-dust":
        setAnchorElDrawingItemDust(event.currentTarget);
        break;
      case "btn-wall":
        setAnchorElDrawingItemWall(event.currentTarget);
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
      case "btn-saveConfig":
        setAnchorElSaveConfiguration(null);
        break;
      case "btn-loadConfig":
        setAnchorElLoadConfiguration(null);
        break;
      case "btn-map":
        setAnchorElHighlightMap(null);
        break;
      case "btn-battery":
        setAnchorElBatteryCapacityHover(null);
        break;
      case "btn-dust":
        setAnchorElDrawingItemDust(null);
        break;
      case "btn-wall":
        setAnchorElDrawingItemWall(null);
        break;
      default:
        console.log("Default case entered in Tools.jsx: handlePopoverClose");
    }
  };

  const handleDrawingItemButtonClicked = (event) => {
    context.updateState(
      "drawItem",
      event.currentTarget.id === "btn-wall" ? "dust" : "wall"
    );
    event.currentTarget.id === "btn-wall" && setAnchorElDrawingItemWall(null);
    event.currentTarget.id === "btn-dust" && setAnchorElDrawingItemDust(null);
  };

  const handleDrawingMethodButtonClicked = (event) => {
    context.updateState(
      "drawMethod",
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
    context.updateState("request", "highlightMap");
  };

  /* change to mouse leave to avoid bugs? */
  const handleMapButtonMouseUp = (event) => {
    context.updateState("request", "removeHighlightMap");
  };

  const classes = useStyles();
  return (
    <div className={classes.tools}>
      {drawItem === "dust" ? (
        <IconButton
          id={"btn-dust"}
          className={classes.iconActive}
          onClick={handleDrawingItemButtonClicked}
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
          onClick={handleDrawingItemButtonClicked}
          disabled={isRunning}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <IconWall />
        </IconButton>
      )}
      <IconButton
        id={"btn-free"}
        className={drawMethod === "free" ? classes.iconActive : classes.icon}
        onClick={handleDrawingMethodButtonClicked}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning || isFinished}
      >
        <IconDrawFree />
      </IconButton>
      <IconButton
        id={"btn-rectangle"}
        className={
          drawMethod === "rectangle" ? classes.iconActive : classes.icon
        }
        onClick={handleDrawingMethodButtonClicked}
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
          drawMethod === "filled rectangle" && !isRunning
            ? classes.iconActive
            : classes.icon
        }
        onClick={handleDrawingMethodButtonClicked}
        onMouseOver={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning || isFinished}
      >
        <IconDrawObstacle />
      </IconButton>

      <input
        accept=".json"
        className={classes.input}
        id="icon-button-load-config"
        onChange={handleLoadConfiguration}
        onClick={(event) => {
          //to allow consecutive selection of same files, we need to clear input value after each click.
          event.target.value = "";
        }}
        type="file"
      />
      <label htmlFor="icon-button-load-config">
        <IconButton
          id={"btn-loadConfig"}
          className={classes.icon}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          disabled={isRunning}
          component={!isRunning ? "span" : undefined}
          htmlFor="icon-button-load-config"
        >
          <IconLoad />
        </IconButton>
      </label>

      <IconButton
        id={"btn-saveConfig"}
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
        classes={{paper: classes.paper}}
        open={Boolean(anchorElSaveConfiguration)}
        anchorEl={anchorElSaveConfiguration}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
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
        classes={{paper: classes.paper,}}
        open={Boolean(anchorElDrawingItemDust)}
        anchorEl={anchorElDrawingItemDust}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Dust</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{paper: classes.paper}}
        open={Boolean(anchorElDrawingItemWall)}
        anchorEl={anchorElDrawingItemWall}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Wall</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{paper: classes.paper,}}
        open={Boolean(anchorElLoadConfiguration)}
        anchorEl={anchorElLoadConfiguration}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
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
        classes={{paper: classes.paper}}
        open={Boolean(anchorElDrawFree)}
        anchorEl={anchorElDrawFree}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Pen</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{paper: classes.paper}}
        open={Boolean(anchorElDrawObstacle)}
        anchorEl={anchorElDrawObstacle}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
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
        classes={{paper: classes.paper}}
        open={Boolean(anchorElDrawRectangle)}
        anchorEl={anchorElDrawRectangle}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Rectangle</Typography>
      </Popover>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{paper: classes.paper}}
        open={Boolean(anchorElHighlightMap)}
        anchorEl={anchorElHighlightMap}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <Typography className={classes.popoverText}>
          Highlight Robot Map
        </Typography>
      </Popover>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{paper: classes.paper,}}
        open={Boolean(anchorElBatteryCapacityHover)}
        anchorEl={anchorElBatteryCapacityHover}
        anchorOrigin={{vertical: "bottom",horizontal: "left"}}
        transformOrigin={{vertical: "top",horizontal: "left"}}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <Typography className={classes.popoverText}>
          Battery: {context.convertAvailableStepsToBatteryCapacity()}%
        </Typography>
      </Popover>

      <Popover
        id="simple-popover"
        open={Boolean(anchorElBatteryCapacityClick)}
        anchorEl={anchorElBatteryCapacityClick}
        onClose={handleBatteryCapacityButtonClosed}
        anchorOrigin={{vertical: "bottom",horizontal: "center"}}
        transformOrigin={{vertical: "top",horizontal: "center"}}>
        <BatterySlider />
      </Popover>
    </div>
  );
};

export default Tools;
