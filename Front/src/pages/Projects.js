// material
import { Grid, Container } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ProjectTable from "./ProjectTable"
// components
import React from "react";
import Page from "../components/Page";
import { useState, useEffect } from "react";
// ----------------------------------------------------------------------

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >x
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="right">{row.about}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Staffing
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell align="right">Location</TableCell>
                    <TableCell align="right">about</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.jobs.map((job) => (
                    <TableRow key={job.position}>
                      <TableCell component="th" scope="row">
                        {job.skills}
                      </TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell align="right">{job.about}</TableCell>
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

export default function Projects() {
  const [frows, setFrows] = useState([]);

  useEffect(() => {
    fetch("/Projects", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: "",
    })
      .then((res) => {
        if (res.ok) {
          let response = res.text();

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            console.log(result);
            setFrows(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));
  }, []);

  useEffect(() => {
    fetch("/Matching", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: "",
    })
      .then((res) => {
        if (res.ok) {
          let response = res.text();

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            console.log(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));
    }, []);
    
  return (
    <Page title="Job list">
      <ProjectTable/>
      <Container maxWidth="xl">
        <Grid margin={5} style={{ textAlign: "center" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">About</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {frows.map((row) => (
                  <Row key={row._id} row={row} />
                ))}
                {/* {frows.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.about}</TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </Page>
  );
}
