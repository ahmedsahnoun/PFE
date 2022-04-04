import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Card,
} from "@mui/material";
import { Icon } from "@iconify/react";
import IconButton from "@mui/material/IconButton";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
// components
import Page from "../components/Page";
import { useState } from "react";
// ----------------------------------------------------------------------

export default function Newproject({ Title }) {
  const [inputFields, setInputFields] = useState([{ position: "", number: 1 }]);
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
    DateF: dateF,
    about: about,
    inputFields: inputFields,
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    alert(JSON.stringify(project, null, 2));
  };

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { position: "", number: 1 }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    if (values.length > 1) {
      values.splice(index, 1);
      setInputFields(values);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Page title={Title}>
        <Container maxWidth="xl">
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4">Hi, Welcome back</Typography>
          </Box>
          <Box sx={{ p: 3  }}>
            <Grid container spacing={3}>
              <Grid container spacing={3} item xs={6}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, boxShadow: 8}}>
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
              <Grid container spacing={3} item xs={6}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, boxShadow: 8}}>
                    <Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box sx={{ pb: 2, pt: 2 }}>
                            <Grid container>
                              <Grid item xs={10}>
                                <Typography variant="h5">
                                  <Icon icon="fluent:people-team-toolbox-20-filled" />{" "}
                                  Staffing:
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Button
                                  variant="contained"
                                  onClick={handleAddFields}
                                >
                                  ADD +
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                          {inputFields.map((inputField, index) => (
                            <Grid
                              container
                              spacing={3}
                              sx={{ pb: 2.5 }}
                              key={index}
                            >
                              <Grid item xs={7}>
                                <TextField
                                  fullWidth
                                  name="position"
                                  label="position"
                                  variant="outlined"
                                  value={inputField.position}
                                  onChange={(event) =>
                                    handleChangeInput(index, event)
                                  }
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  name="number"
                                  label="number"
                                  variant="outlined"
                                  inputProps={{ type: "number", min: 1 }}
                                  value={inputField.number}
                                  onChange={(event) =>
                                    handleChangeInput(index, event)
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton
                                  aria-label="delete"
                                  size="large"
                                  value={index}
                                  onClick={() => handleRemoveFields(index)}
                                >
                                  x
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Container>
          <Grid margin={6} style={{ textAlign: "center" }}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
            >
              CONFIRM
            </Button>
          </Grid>
        </Container>
      </Page>
    </form>
  );
}
