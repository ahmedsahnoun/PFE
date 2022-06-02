import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Card,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../components/Iconify";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
// components
import Page from "../components/Page";
// components
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./Page404";
import JobForm from "./JobForm";
// ----------------------------------------------------------------------

function ProjectPage(props) {
  let data = props.data;
  const [title, setTitle] = useState(data.title);
  const [manager, setManager] = useState(data.manager);
  const [client, setClient] = useState(data.client);
  const [about, setAbout] = useState(data.about);
  const [dateD, setDateD] = useState(data.dateD);
  const [dateF, setDateF] = useState(data.dateF);
  const [jobs, setJobs] = useState(data.jobs);

  return (
    <div>
      <Page title="Project">
        <Typography variant="h3" align="right" sx={{ color: "white", pr: 8 }}>
          Project
        </Typography>
        <Box sx={{ pl: 3 }}>
          <Button
            align="left"
            variant="contained"
            component={RouterLink}
            to={"/Update/"+ props.id}
            startIcon={<Iconify icon="icon-park-twotone:write" />}
          >
            Update
          </Button>
        </Box>
        <Box sx={{ p: 5 }}>
          <Typography variant="h4">Details:</Typography>
        </Box>
        <Container maxWidth="xl">
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
                            disabled
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
                            disabled
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
                            disabled
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
                              disabled
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
                            disabled
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
                              disabled
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
          disabled={true}
          hasMatches
          template={jobs}
          setTemplate={setJobs}
        />
      </Page>
    </div>
  );
}

export default function Project() {
  const { id } = useParams();
  const [res, setRes] = useState("not found");

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
            setRes(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));
  }, [id]);

  return res !== "not found" ? <ProjectPage data={res} id={id} /> : <NotFound />;
}
