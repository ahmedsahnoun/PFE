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
import Iconify from '../components/Iconify';
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
// components
// ----------------------------------------------------------------------

export default function JobForm({ template, setTemplate, onSubmit, hasAdd=true, hasConfirm=true }) {
  const handleChangeInput = (index, event) => {
    const values = [...template];
    values[index][event.target.name] = event.target.value;
    setTemplate(values);
  };

  const handleAdd = () => {
    const values = [
      ...template,
      { position: "", skills: [], about: "", location: "" },
    ];
    setTemplate(values);
  };

  const handleDelete = (index, event) => {
    const values = [...template];
    if (values.length > 1) {
      values.splice(index, 1);
      setTemplate(values);
    }
  };

  const handleChangeSkills = (index, value) => {
    const values = [...template];
    values[index].skills = value;
    setTemplate(values);
  };

  const confirm = () => {
    return (
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
    );
  };
  
  const add = () => {
    return (
      <Grid container spacing={1} padding={3}>
        <Grid item xs={1}>
          <Button variant="contained" aria-label="delete" onClick={handleAdd} 
            startIcon={<Iconify icon="eva:plus-fill" />}>
            ADD
          </Button>
        </Grid>
      </Grid>
    );
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
                  <Card sx={{ p: 3, boxShadow: 8 }}>
                    <Box>
                      <Grid style={{ textAlign: "right" }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={(event) => handleDelete(index, event)}
                        >
                          delete
                        </Button>
                      </Grid>
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
                          <Autocomplete
                            multiple
                            id="tags-filled"
                            options={skills.map((option) => option)}
                            value={skills}
                            freeSolo
                            onChange={(event, value) =>
                              handleChangeSkills(index, value)
                            }
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  variant="outlined"
                                  label={option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Skills" />
                            )}
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
                              handleChangeInput(index, event)
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
      {hasAdd && add()}
      {hasConfirm && confirm()}
    </form>
  );
}
