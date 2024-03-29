import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Card,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import linkedin from "../theme/linkedin_logo.png";
import talan from "../theme/logo-talan1.png";
import xing from "../theme/xing.png";
import indeed from "../theme/indeed.png";
import pjf from "../theme/pjf.png";
// components
import Page from "../components/Page";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./Page404";

import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot,
} from "@mui/lab";
// ----------------------------------------------------------------------

export function ResumePage(props) {
  let data = props.data;

  for (const [key] of Object.entries(data)) {
    data[key] = data[key] || "-";
  }

  if (!(data.experience.constructor === Array)) {
    data.experience = [
      { position: data.experience, company: "", duration: "", details: "" },
    ];
  }

  function OrderItem({ item, isLast, pos }) {
    return (
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot
            sx={{
              bgcolor: [
                "primary.main",
                "success.main",
                "info.main",
                "warning.main",
                "error.main",
              ][pos % 5],
            }}
          />
          {isLast ? null : <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2" sx={{ whiteSpace: "pre-wrap" }}>
            {item.position}
          </Typography>
          <Typography
            variant="caption"
            sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}
          >
            {item.company + "\n" + item.duration + "\n" + (item.details || "")}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    );
  }

  return (
    <Page title="Resume">
      <Typography
        variant="h3"
        align="right"
        sx={{ color: "white", pr: 8, pb: 5 }}
      >
        Resume
      </Typography>
      <Container maxWidth="xl">
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 8 }}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="emojione-monotone:name-badge" /> Name:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.name}
                        id="Name"
                        variant="outlined"
                      />
                      <Box sx={{ pb: 2, pt: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="carbon:email-new" /> Email:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.email}
                        id="Name"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="akar-icons:phone" /> Phone number:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.phone}
                        id="Location"
                        variant="outlined"
                      />
                      <Box sx={{ pb: 2, pt: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="arcticons:url-forwarder" /> URL:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.url}
                        id="Location"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="entypo:location-pin" /> Location:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.location}
                        id="Name"
                        variant="outlined"
                      />
                      <Box sx={{ pb: 2, pt: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="carbon:education" /> School:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.school}
                        id="Location"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="carbon:building-insights-1" /> Company:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.company}
                        id="Location"
                        variant="outlined"
                      />
                      <Box sx={{ pb: 2, pt: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="clarity:talk-bubbles-line" /> Languages:
                        </Typography>
                      </Box>
                      <TextField
                        disabled
                        fullWidth
                        value={data.langs}
                        id="Location"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="bi:ui-checks-grid" /> Source:
                        </Typography>
                      </Box>
                      <Autocomplete
                        freeSolo
                        disabled
                        multiple
                        id="tags-filled"
                        options={[]}
                        value={data.skills}
                        renderTags={(value) =>
                          value.map((option, index) => (
                            <Chip
                              key={index}
                              variant="outlined"
                              label={option}
                            />
                          ))
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <Box sx={{ p: 2, pl: 0 }}>
                        <Typography variant="h6">
                          <Icon icon="bi:arrow-bar-down" /> Source:
                        </Typography>
                      </Box>
                      <Grid
                        sx={{ pb: 1 }}
                        style={{ placeItems: "center", display: "grid" }}
                      >
                        {data.document && (
                          <a
                            href={
                              "data:application/pdf;base64," + data.document
                            }
                            download="file.pdf"
                          >
                            PDF
                          </a>
                        )}
                        <img
                          width={150}
                          src={
                            (data.source === "linkedin" && linkedin) ||
                            (data.source === "xing" && xing) ||
                            (data.source === "indeed" && indeed) ||
                            (data.source === "pjf" && pjf) ||
                            (data.source === "TALAN" && talan)
                          }
                          alt=""
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={8}>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="h6">
                          <Icon icon="bytesize:work" /> Experience:
                        </Typography>
                      </Box>
                      <Timeline
                        sx={{
                          "& .MuiTimelineItem-missingOppositeContent:before": {
                            display: "none",
                          },
                        }}
                      >
                        {data.experience.map((item, index) => (
                          <OrderItem
                            key={index}
                            pos={index}
                            item={item}
                            isLast={index === data.experience.length - 1}
                          />
                        ))}
                      </Timeline>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}

export default function Resume() {
  const { id } = useParams();
  const [res, setRes] = useState("not found");

  useEffect(() => {
    fetch("/Resume/" + id, {
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

  return res !== "not found" ? <ResumePage data={res} /> : <NotFound />;
}
