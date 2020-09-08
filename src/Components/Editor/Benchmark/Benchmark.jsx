import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import Row from "./Row";

function createData(name, runtime, efficiency, config) {
  return {
    name,
    runtime,
    efficiency,
    configs: [
      { date: "2020-01-05", customerId: "11091700", amount: 3 },
      { date: "2020-01-02", customerId: "Anonymous", amount: 1 },
    ],
  };
}

const data = [
  createData("User Script", 159, 6.0),
  createData("Depth Traversal", 237, 9.0),
  createData("Spiral Traversal", 262, 16.0),
  createData("Random Traversal", 305, 3.7),
  createData("Best First Traversal", 356, 16.0),
];

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Algorithm</TableCell>
            <TableCell align="center">Runtime</TableCell>
            <TableCell align="center">Efficiency</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((algStats) => (
            <Row key={algStats.name} configurationStats={algStats} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
