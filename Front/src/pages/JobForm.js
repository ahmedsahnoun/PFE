import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Card,
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { Icon } from "@iconify/react";
import { useState } from "react";
// components
// ----------------------------------------------------------------------

export default function JobForm({ templates, onSubmit }) {
  const [template, setTemplate] = useState(templates);

  const handleChangeInput = (index, event) => {
    const values = [...template];
    values[index][event.target.name] = event.target.value;
    console.log(values);
    setTemplate(values);
  };
  const handleChangeskill = (index, event) => {
    const values = [...template];
    values[index].skills = event.map(a => a.value);
    setTemplate(values);
    console.log(template);
  };

  const renderer = ({ template }) => {
    return template.map((temp, index) => {
      let { position, skills, about, location } = temp;
      return (
        <Container maxWidth="xl" key={index}>
          <Box sx={{ p: 3, pt: 0 }}>
            <Grid container spacing={3}>
              <Grid container spacing={3} item xs={12}>
                <Grid item xs={12}>
                  <Card>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <Box sx={{ pb: 2 }}>
                            <Typography variant="h5">
                              <Icon icon="foundation:torso-business" />
                              Position:
                            </Typography>
                          </Box>
                          <TextField
                            name="position"
                            label="Position"
                            fullWidth
                            variant="outlined"
                            value={position}
                            onChange={(event) =>
                              handleChangeInput(index, event)
                            }
                          />
                          <Box sx={{ pb: 2, pt: 2 }}>
                            <Typography variant="h5">
                              <Icon icon="entypo:location-pin" /> Location:
                            </Typography>
                          </Box>
                          <TextField
                            name="location"
                            label="Location"
                            fullWidth
                            variant="outlined"
                            value={location}
                            onChange={(event) =>
                              handleChangeInput(index, event)
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ pb: 2 }}>
                            <Typography variant="h5">
                              <Icon icon="bi:ui-checks-grid" /> Skills:
                            </Typography>
                          </Box>
                          <CreatableSelect
                            name="skills"
                            placeholder="Skills"
                            isMulti
                            value={skills.map((s) => ({ value: s, label: s }))}
                            setValue
                            onChange={(event) =>
                              handleChangeskill(index, event)
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ pb: 2 }}>
                            <Typography variant="h5">
                              <Icon icon="akar-icons:info" /> About:
                            </Typography>
                          </Box>
                          <TextField
                            name="about"
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            value={about}
                            onChange={(event) =>
                              handleChangeskill(index, event)
                            }
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      );
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {renderer({ template })}
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
    </form>
  );
}
