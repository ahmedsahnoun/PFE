import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Card,
} from "@mui/material";
import { Icon } from "@iconify/react";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Iconify from "../components/Iconify";
// components
import Page from "../components/Page";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
// import { useNavigate } from "react-router-dom";
import JobForm from "./JobForm";
import Fab from "@mui/material/Fab";
// ----------------------------------------------------------------------

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Update() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/Project/" + id, {
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
            setJobs(result.jobs);
            setTitle(result.title);
            setManager(result.manager);
            setClient(result.client);
            setAbout(result.about);
            setDateD(new Date(Date.parse(result.dateD)));
            setDateF(new Date(Date.parse(result.dateF)));
          });
        }
      })
      .catch((_) => console.log("not sent"));
  }, [id]);

  const [jobs, setJobs] = useState([
    { position: "", skills: [], location: "", about: "", languages: [] },
  ]);
  const [title, setTitle] = useState("");
  const [manager, setManager] = useState("");
  const [client, setClient] = useState("");
  const [about, setAbout] = useState("");
  const [dateD, setDateD] = useState(new Date());
  const [dateF, setDateF] = useState(new Date());

  let project = {
    title: title,
    client: client,
    manager: manager,
    dateD: dateD.toISOString().split("T")[0],
    dateF: dateF.toISOString().split("T")[0],
    about: about,
    jobs: jobs,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/Update/" + id, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => {
        if (res.ok) {
          setSuccess(true);

          let response = res.text();

          response.then((res) => {
            // let result = JSON.parse(res)["result"];
            // console.log(result);
            // if (result !=='fail') {navigate("../Project/"+result, { replace: true })}
          });
        } else {
          setError(true);
        }
      })
      .catch((_) => console.log("not sent"));
  };

  return (
    <div>
      <Page title="New project">
        <Box sx={{ pr: 8 }}>
          <Typography variant="h3" align="right" sx={{ color: "white" }}>
            Update
          </Typography>
        </Box>
        <Box sx={{ p: 5 }}>
          <Typography variant="h4">Details:</Typography>
        </Box>
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
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid container spacing={3} item xs={12}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, boxShadow: 8 }}>
                    <Box>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Box>
                            <Typography variant="h5">
                              <Icon icon="system-uicons:document-words" />{" "}
                              Title:
                            </Typography>
                          </Box>
                          <TextField
                            sx={{ pb: 4, pt: 1 }}
                            fullWidth
                            variant="outlined"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <Box>
                            <Typography variant="h5">
                              <Icon icon="ic:outline-work-outline" /> Client:
                            </Typography>
                          </Box>
                          <TextField
                            sx={{ pb: 4, pt: 1 }}
                            fullWidth
                            variant="outlined"
                            name="client"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                          />
                          <Box>
                            <Typography variant="h5">
                              <Icon icon="foundation:torso-business" /> Manager:
                            </Typography>
                          </Box>
                          <TextField
                            sx={{ pb: 4, pt: 1 }}
                            fullWidth
                            variant="outlined"
                            name="manager"
                            value={manager}
                            onChange={(e) => setManager(e.target.value)}
                          />
                          <Box sx={{ pb: 1 }}>
                            <Typography variant="h5">
                              <Icon icon="foundation:torso-business" /> Starting
                              date:
                            </Typography>
                          </Box>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                              inputFormat="dd/MM/yyyy"
                              value={dateD}
                              format="YYYY-MM-DD"
                              onChange={(e) => setDateD(e)}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ pb: 1 }}>
                            <Typography variant="h5">
                              <Icon icon="akar-icons:info" /> About:
                            </Typography>
                          </Box>
                          <TextField
                            fullWidth
                            multiline
                            rows={12}
                            variant="outlined"
                            name="about"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                          />
                          <Box sx={{ pb: 1, pt: 4 }}>
                            <Typography variant="h5">
                              <Icon icon="foundation:torso-business" />{" "}
                              Finishing date:
                            </Typography>
                          </Box>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                              inputFormat="dd/MM/yyyy"
                              value={dateF}
                              onChange={(e) => setDateF(e)}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Box sx={{ p: 5 }}>
          <Typography variant="h4">Staffing:</Typography>
        </Box>
        <JobForm
          hasDelete
          hasConfirm
          template={jobs}
          setTemplate={setJobs}
          onSubmit={handleSubmit}
        />
      </Page>

      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          fontSize: "5",
        }}
        color="primary"
        aria-label="add"
        onClick={() =>
          setJobs([
            ...jobs,
            { position: "", skills: [], about: "", location: "" },
          ])
        }
      >
        <Iconify icon="eva:plus-fill" /> ADD
      </Fab>
    </div>
  );
}
