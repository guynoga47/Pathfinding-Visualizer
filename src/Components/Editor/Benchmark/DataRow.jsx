import React, { useState, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import GlobalContext from "../../../Context/global-context";

const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

//prettier-ignore
const DataRow = ({ row, onBenchmarkReplay }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const context = useContext(GlobalContext);
  const {convertAvailableStepsToBatteryCapacity} = context;

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" component="th" scope="row">{row.name}</TableCell>
        <TableCell align="right">{row.avgRuntime}ms</TableCell>
        <TableCell align="right">{row.avgEfficiency}%</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Configurations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">NAME</TableCell>
                    <TableCell align="left">DIMENSIONS</TableCell>
                    <TableCell align="right">BATTERY</TableCell>
                    <TableCell align="right">RUNTIME</TableCell>
                    <TableCell align="right">EFFICIENCY</TableCell>
                    <TableCell align="right">REPLAY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.configs.map(({configName, dimensions, runtime, efficiency,path, battery, config}) => (
                    <TableRow key={configName}>
                      <TableCell align="left">{configName}</TableCell>
                      <TableCell align="left">{dimensions}</TableCell>
                      <TableCell align="right">{convertAvailableStepsToBatteryCapacity(config.grid,battery)}%</TableCell>
                      <TableCell align="right">{runtime}</TableCell>
                      <TableCell align="right">{efficiency}%</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={()=>{onBenchmarkReplay(path, config)}}>
                          <PlayCircleOutlineIcon/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default DataRow;
