import { createMuiTheme } from "@material-ui/core/styles";
import handPointer from "./assets/cursors/link.cur";

export default createMuiTheme({
  overrides: {
    MuiSlider: {
      root: {
        cursor: `url(${handPointer}), auto`,
      },
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiButtonBase: {
      root: {
        cursor: `url(${handPointer}), auto`,
      },
    },
  },
  typography: {
    fontFamily: "Orbitron",
    h2: {
      fontWeight: "500",
    },
    subtitle1: {
      fontWeight: "400",
      fontSize: "15px",
      letterSpacing: "1px",
    },
    subtitle2: {
      fontWeight: "500",
    },
  },
});
