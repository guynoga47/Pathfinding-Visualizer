import React, { useContext } from "react";

import IconButton from "@material-ui/core/IconButton";
import IconDrawFree from "@material-ui/icons/Create";
import IconDrawRectangle from "@material-ui/icons/AspectRatio";
import IconDrawObstacle from "@material-ui/icons/TabUnselected";
import IconSave from "@material-ui/icons/GetApp";
import IconLoad from "@material-ui/icons/Publish";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { saveAs } from "file-saver";

import GridContext from "../../Context/grid-context";
import ToolsStyles from "./Tools.Styles";

const useStyles = ToolsStyles;

const Tools = (props) => {
  const context = useContext(GridContext);

  const { setDrawingMode, drawingMode } = props;
  const { isRunning, isFinished } = context.state;

  const [anchorElDrawFree, setAnchorElDrawFree] = React.useState(null);
  const [anchorElDrawRectangle, setAnchorElDrawRectangle] = React.useState(
    null
  );
  const [anchorElSaveLayout, setAnchorElSaveLayout] = React.useState(null);
  const [anchorElLoadLayout, setAnchorElLoadLayout] = React.useState(null);
  const [anchorElDrawObstacle, setAnchorElDrawObstacle] = React.useState(null);

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
        setAnchorElSaveLayout(event.currentTarget);
        break;
      case "btn-load":
        setAnchorElLoadLayout(event.currentTarget);
        break;
      default:
        console.log("default case entered in Tools.jsx: handlePopoverOpen");
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
        setAnchorElSaveLayout(null);
        break;
      case "btn-load":
        setAnchorElLoadLayout(null);
        break;
      default:
        console.log("default case entered in Tools.jsx: handlePopoverClose");
    }
  };

  const handleDrawingModeButtonClicked = (event) => {
    setDrawingMode(
      event.currentTarget.id === "btn-free"
        ? "free"
        : event.currentTarget.id === "btn-rectangle"
        ? "rectangle"
        : "obstacle"
    );
  };

  const handleSaveLayoutButtonClicked = async () => {
    const blob = new Blob([JSON.stringify(context.state.grid)]);
    saveAs(
      blob,
      `Grid Snapshot ${new Date()
        .toLocaleDateString()
        .replace(/\./g, "-")} at ${new Date()
        .toLocaleTimeString()
        .replace(/:/g, ".")}.json`
    );
  };

  const handleLoadLayoutButtonClicked = (event) => {
    //a place holder for load layout implementation.
    console.log(event.currentTarget);
    console.log(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      const newGrid = JSON.parse(reader.result);
      console.log(context.state.grid);
      console.log(newGrid);
      context.updateState("grid", newGrid);
    };
    reader.readAsText(event.target.files[0]);
  };

  const classes = useStyles();
  return (
    <div className={classes.tools}>
      <IconButton
        id={"btn-free"}
        className={drawingMode === "free" ? classes.iconActive : classes.icon}
        onClick={handleDrawingModeButtonClicked}
        onMouseEnter={handlePopoverOpen}
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
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning || isFinished}
      >
        <IconDrawRectangle />
      </IconButton>
      <IconButton
        id={"btn-obstacle"}
        className={
          drawingMode === "obstacle" && !isRunning
            ? classes.iconActive
            : classes.icon
        }
        onClick={handleDrawingModeButtonClicked}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning || isFinished}
      >
        <IconDrawObstacle />
      </IconButton>

      <input
        accept=".json"
        className={classes.input}
        id="icon-button-load-file"
        onChange={handleLoadLayoutButtonClicked}
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
          onMouseEnter={handlePopoverOpen}
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
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={isRunning}
        onClick={handleSaveLayoutButtonClicked}
      >
        <IconSave />
      </IconButton>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElSaveLayout)}
        anchorEl={anchorElSaveLayout}
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
        <Typography className={classes.popoverText}>Save Layout</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElLoadLayout)}
        anchorEl={anchorElLoadLayout}
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
        <Typography className={classes.popoverText}>Load Layout</Typography>
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
        <Typography className={classes.popoverText}>Obstacle</Typography>
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
    </div>
  );
};

export default Tools;
