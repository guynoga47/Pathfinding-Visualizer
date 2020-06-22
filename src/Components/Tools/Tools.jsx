import React from "react";
import IconButton from "@material-ui/core/IconButton";
import IconDrawFree from "@material-ui/icons/Create";
import IconDrawRectangle from "@material-ui/icons/AspectRatio";
import IconDrawObstacle from "@material-ui/icons/TabUnselected";
import IconSave from "@material-ui/icons/GetApp";
import IconLoad from "@material-ui/icons/Publish";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  icon: {
    color: "white",
    "&:hover": {
      color: "#66FCF1 !important",
      background: "#1f2833",
      borderColor: "black !important",
      transition: "all 0.4s ease 0s",
    },
    "&:disabled": {
      color: "#C5C6C7 !important",
      transition: "all 0.4s ease 0s",
    },
  },
  iconActive: {
    color: "#66FCF1 !important",
    background: "#1f2833",
    borderColor: "black !important",
    transition: "all 0.4s ease 0s",
    "&:disabled": {
      color: "#C5C6C7 !important",
      transition: "all 0.4s ease 0s",
    },
  },
  popover: {
    pointerEvents: "none",
  },
  popoverText: {
    padding: "5px",
  },
  tools: {
    marginLeft: "59.95em",
  },
}));

const Tools = (props) => {
  const {
    setDrawingMode,
    drawingMode,
    setSaveLayoutRequest,
    isRunning,
    isFinished,
  } = props;

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
    /*     console.log(JSON.stringify(grid)); */
    setSaveLayoutRequest({ requested: true });
  };

  const handleLoadLayoutButtonClicked = (params) => {
    //a place holder for load layout implementation.
    fetch(`${params.fileName}.json`)
      .then((response) => response.json())
      .then((data) => console.log(data));
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
