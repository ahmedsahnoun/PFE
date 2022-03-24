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
// components
import Page from "../components/Page";
// ----------------------------------------------------------------------

export default function Project({ Title }) {
  return (
    <Page title={Title}>
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid container spacing={3} item xs={6}>
              <Grid item xs={12}>
                <Card>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Box>
                          <Typography variant="h5">
                            <Icon icon="system-uicons:document-words" /> Title:
                          </Typography>
                        </Box>
                        <TextField
                          disabled
                          sx={{ pb: 4, pt: 1 }}
                          fullWidth
                          id="Name"
                          variant="outlined"
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
                          id="Location"
                          variant="outlined"
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
                          id="Location"
                          variant="outlined"
                        />
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
                          rows={14}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={3} item xs={6}>
              <Grid item xs={12}>
                <Card>
                  <Box sx={{ p: 3 }}>
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
                          </Grid>
                        </Box>
                        <Grid container spacing={3} sx={{ pb: 2.5 }}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              name="position"
                              label="position"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              name="number"
                              label="best matches"
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
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
          <Button size="large" variant="contained" color="primary">
            CONFIRM
          </Button>
        </Grid>
      </Container>
    </Page>
  );
}
