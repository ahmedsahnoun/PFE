// material
import {
  Button,
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Card,
} from "@mui/material";
// components
import Page from "../components/Page";
import DisplayBox from "../components/DisplayBox";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState, forwardRef } from "react";
import talan from "../theme/linkedin_logo.png";
import parseImage from "../theme/parse.png";
// ----------------------------------------------------------------------

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DashboardApp() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [base, setbase] = useState("");

  const [totalRes, setTotalRes] = useState(0);
  const [search, setSearch] = useState("");
  const [number, setNumber] = useState(1);
  const [url, setUrl] = useState("");

  const parse = () => {
    //Read File
    let selectedFile = document.getElementById("inputFile").files;
    let base64 = "";
    //Check File is not Empty
    if (selectedFile.length > 0) {
      // Select the very first file from list
      let fileToLoad = selectedFile[0];
      // FileReader function for read the file.
      let fileReader = new FileReader();
      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent) {
        base64 = fileLoadedEvent.target.result;
        fetch("/Parse", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(base64.split(",")[1]),
        })
          .then((res) => {
            if (res.ok) {
              setSuccess(true);
              let response = res.text();

              response.then((res) => {
                let result = JSON.parse(res)["result"];
                console.log(result);
                setbase(result["document"]);
              });
            } else {
              setError(true);
            }
          })
          .catch((_) => console.log("not sent"));
      };
      // execution
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  fetch("/TotalResumes", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: "",
  })
    .then((res) => {
      let response = res.text();

      response.then((res) => {
        let result = JSON.parse(res)["result"];
        setTotalRes(result);
      });
    })
    .catch((_) => console.log("not sent"));

  const scrape = (e) => {
    e.preventDefault();
    fetch("/WebScraping", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ search: search, number: number }),
    })
      .then((res) => {
        if (res.ok) {
          setSuccess(true);
          let response = res.text();

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            console.log(result);
          });
        } else {
          setError(true);
        }
      })
      .catch((_) => console.log("not sent"));
  };

  const scrapeURL = (e) => {
    e.preventDefault();
    fetch("/URLScraping", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(url),
    })
      .then((res) => {
        if (res.ok) {
          setSuccess(true);
          let response = res.text();

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            console.log(result);
          });
        } else {
          setError(true);
        }
      })
      .catch((_) => console.log("not sent"));
  };

  return (
    <Page title="Homepage">
      <Container maxWidth="xl">
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Success
          </Alert>
        </Snackbar>
        <Snackbar
          open={error}
          autoHideDuration={3000}
          onClose={() => setError(false)}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            Error. Please retry
          </Alert>
        </Snackbar>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DisplayBox name={"Total Resumes"} value={totalRes} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 238, p: 3, boxShadow: 8 }}>
                  <Grid
                    sx={{ pb: 2 }}
                    style={{ placeItems: "center", display: "grid" }}
                  >
                    <img width={150} src={parseImage} alt="" />
                  </Grid>
                  <Box>
                    <Box sx={{ pb: 3 }}>
                      <Typography variant="h5">Parse document:</Typography>
                    </Box>
                    <Grid style={{ textAlign: "center" }}>
                      <Button variant="contained" component="label">
                        Upload File
                        <input
                          id="inputFile"
                          type="file"
                          hidden
                          onChange={parse}
                        />
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 410, p: 3, boxShadow: 8 }}>
                  <Grid
                    sx={{ pb: 2 }}
                    style={{ placeItems: "center", display: "grid" }}
                  >
                    <img width={200} src={talan} alt="" />
                  </Grid>
                  <Box>
                    <Box>
                      <Typography variant="h5">Search:</Typography>
                    </Box>
                    <TextField
                      sx={{ pb: 4, pt: 1 }}
                      fullWidth
                      variant="outlined"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Box>
                      <Typography variant="h5">Number of profiles:</Typography>
                    </Box>
                    <TextField
                      type="number"
                      InputProps={{ inputProps: { min: 1 } }}
                      sx={{ pb: 3, pt: 1 }}
                      fullWidth
                      variant="outlined"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                    <Grid style={{ textAlign: "center" }}>
                      <Button size="large" variant="contained" onClick={scrape}>
                        Start
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 410, p: 3, boxShadow: 8 }}>
                  <Grid
                    sx={{ pb: 2 }}
                    style={{ placeItems: "center", display: "grid" }}
                  >
                    <img width={200} src={talan} alt="" />
                  </Grid>
                  <Box>
                    <Box>
                      <Typography variant="h5">URL:</Typography>
                    </Box>
                    <TextField
                      sx={{ pb: 2, pt: 1 }}
                      fullWidth
                      variant="outlined"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Grid style={{ textAlign: "center" }}>
                      <Button
                        size="large"
                        variant="contained"
                        onClick={scrapeURL}
                      >
                        Start
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          {base && (<Grid item xs={12} md={6}>
            <Card sx={{ height: 672, p: 3, boxShadow: 8 }}>
              <embed
                width="100%"
                height="100%"
                src={"data:application/pdf;base64," + base}
                type="application/pdf"
              />
            </Card>
          </Grid>)}
        </Grid>
      </Container>
    </Page>
  );
}
