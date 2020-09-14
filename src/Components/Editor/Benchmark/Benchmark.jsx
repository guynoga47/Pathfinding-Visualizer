import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import DialogContainer from "../DialogContainer/DialogContainer";

import Row from "./DataRow";

const Benchmark = ({ showBenchmark, setShowBenchmark }) => {
  /* renaming for readibility, this variable behaves as a conditional for displaying the benchmark, 
  and contains the data itself when Benchmark is requested. */
  const data = showBenchmark;
  return (
    <DialogContainer
      showDialog={showBenchmark}
      setShowDialog={setShowBenchmark}
      title={`Benchmark`}
    >
      <TableContainer component="div">
        <Table size="medium" aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Algorithm</TableCell>
              <TableCell align="right">Average Runtime</TableCell>
              <TableCell align="right">Average Efficiency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((algData) => (
              <Row key={`${algData.name}`} row={algData} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContainer>
  );
};

export default Benchmark;
