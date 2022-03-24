import { Box, Grid, Container, Typography, TextField, Card } from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { Icon } from '@iconify/react';
// components
import Page from '../components/Page';
// ----------------------------------------------------------------------

export default function Resume() {
   const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
   ]

   return (
      <Page title="Resume">
         <Container maxWidth="xl">
            <Box sx={{ pb: 5 }}>
               <Typography variant="h4">Hi, Welcome back</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
               <Grid container spacing={3}>
                  <Grid container spacing={3} item xs={6}>
                     <Grid item xs={12}>
                        <Card sx={{height:1}}>
                           <Box sx={{ p: 3 }}>
                              <Grid container spacing={3}>
                                 <Grid item xs={6}>
                                    <Box sx={{ pb: 2 }}>
                                       <Typography variant="h5"><Icon icon="emojione-monotone:name-badge"/> Name:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth 
                                       value={'test'}
                                       id="Name"
                                       variant="outlined"
                                    />
                                    <Box sx={{ pb: 2, pt:2  }}>
                                       <Typography variant="h5"><Icon icon="carbon:email-new"/> Email:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       value={'test'}
                                       id="Location"
                                       variant="outlined"
                                    />
                                    <Box sx={{ pb: 2, pt:2  }}>
                                       <Typography variant="h5"><Icon icon="akar-icons:phone"/> Phone number:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       value={'test'}
                                       id="Location"
                                       variant="outlined"
                                    />
                                    <Box sx={{ pb: 2, pt:2  }}>
                                       <Typography variant="h5"><Icon icon="arcticons:url-forwarder"/> URL:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       value={'test'}
                                       id="Location"
                                       variant="outlined"
                                    />
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Box sx={{ pb: 2 }}>
                                       <Typography variant="h5"><Icon icon="entypo:location-pin"/> Location:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth 
                                       value={'test'}
                                       id="Name"
                                       variant="outlined"
                                    />
                                    <Box sx={{ pb: 2, pt:2  }}>
                                       <Typography variant="h5"><Icon icon="carbon:education"/> Education:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       value={'test'}
                                       id="Location"
                                       variant="outlined"
                                    />
                                    <Box sx={{ pb: 2, pt:2  }}>
                                       <Typography variant="h5"><Icon icon="carbon:building-insights-1"/> Company:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       value={'test'}
                                       id="Location"
                                       variant="outlined"
                                    />
                                    <Box sx={{ pb: 2, pt:2  }}>
                                       <Typography variant="h5"><Icon icon="clarity:talk-bubbles-line"/> Languages:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       value={'test'}
                                       id="Location"
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
                                 <Grid item xs={6}>
                                    <Box sx={{ pb: 2 }}>
                                       <Typography variant="h5"><Icon icon="bi:ui-checks-grid"/> Skills:</Typography>
                                    </Box>
                                    <CreatableSelect placeholder="Skills" isMulti options={options} />
                                 </Grid>
                                 <Grid item xs={6}>
                                    <Box sx={{ pb: 1 }}>
                                       <Typography variant="h5"><Icon icon="akar-icons:info"/> About:</Typography>
                                    </Box>
                                    <TextField
                                       fullWidth
                                       multiline
                                       rows={17}
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
                                    <Box sx={{ pb: 2 }}>
                                       <Typography variant="h5"><Icon icon="bytesize:work"/> Experience:</Typography>
                                    </Box>
                                    <TextField
                                       disabled
                                       fullWidth
                                       multiline
                                       rows={18}
                                       variant="outlined"
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
      </Page>
   );
}
