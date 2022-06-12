import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Score from "./Score";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../components/Iconify";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import talanlogo from "../theme/logo-talan.png";
import weblogo from "../theme/logo-web.png";
import { useParams } from "react-router-dom";

export default function AlertDialog(props) {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState(5);
  // const [job, setJob] = useState();
  const [matches, setMatches] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch("/Matching/" + id, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(id),
    })
      .then((res) => {
        if (res.ok) {
          let response = res.text();

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            setMatches(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));
  }, [id]);

  function Views(props) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Score</TableCell>
              {props.source && <TableCell>Source</TableCell>}
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              backgroundImage: `url(${props.bg})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundOpacity: "0.4",
            }}
          >
            {props.row.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>
                  <Score value={row.score} />
                </TableCell>
                {props.source && <TableCell>{row.source}</TableCell>}
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    component={RouterLink}
                    to={"/Resume/" + row._id}
                    startIcon={<Iconify icon="fa-solid:sign-out-alt" />}
                  >
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        View matches
      </Button>
      {matches && (
        <Dialog
          maxWidth={false}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Matches:</DialogTitle>
          <Grid sx={{ alignSelf: "flex-end", pr: 3, pd: 2 }}>
            Number of rows:
            <Select
              defaultValue={number}
              onChange={(e) => setNumber(e.target.value)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </Grid>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Views
                  row={matches[props.index]["matches_talan"].slice(0, number)}
                  bg={talanlogo}
                />
              </Grid>
              <Grid item xs={6}>
                <Views
                  row={matches[props.index]["matches"].slice(0, number)}
                  bg={weblogo}
                  source={true}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
