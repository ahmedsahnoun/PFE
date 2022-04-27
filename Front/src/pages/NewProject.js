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
// components
import Page from "../components/Page";
import { useState } from "react";
import JobForm from "./JobForm";
// ----------------------------------------------------------------------

export default function Newproject({ Title }) {
  const job = [{ position: "", skills: [], location: "", about: "" }];

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [jobs, setJobs] = useState(job);
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
    dateD: dateD,
    dateF: dateF,
    about: about,
    jobs: jobs,
  };

  const access = (id) => {
    // window.location.href = "/NewJob";
    // let id = "62599b8a19f9482d5dc1fdf7";
    fetch("/Project/" + id, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => {
        if (res.ok) {
          console.log("sent");

          let response = res.text();

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            console.log(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/NewProject", {
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
          console.log(response);

          response.then((res) => {
            let result = JSON.parse(res)["result"];
            console.log(result);
            access(result);
          });
        } else {
          setError(true);
        }
      })
      .catch((_) => console.log("not sent"));
  };

  return (
    <div>
      <Page title={Title}>
        <Box sx={{ p: 5 }}>
          <Typography variant="h4">Details:</Typography>
        </Box>
        <Container maxWidth="xl">
          <Snackbar
            open={success}
            autoHideDuration={3000}
            onClose={() => setSuccess(false)}
          >
            <MuiAlert severity="success" sx={{ width: "100%" }}>
              Success
            </MuiAlert>
          </Snackbar>
          <Snackbar
            open={error}
            autoHideDuration={3000}
            onClose={() => setError(false)}
          >
            <MuiAlert severity="error" sx={{ width: "100%" }}>
              Error. Please retry
            </MuiAlert>
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
          template={jobs}
          setTemplate={setJobs}
          onSubmit={handleSubmit}
        />
      </Page>
    </div>
  );
}
