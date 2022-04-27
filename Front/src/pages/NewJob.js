import Page from "../components/Page";
import JobForm from "./JobForm";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// ----------------------------------------------------------------------

export default function NewJob() {
  
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const templates = [
    {
      position: "data scientist",
      skills: ["machine learning", "python"],
      location: "location 1",
      about: "",
    },
  ];

  const [template, setTemplate] = useState(templates);

  const onSubmit = (e) => {
    e.preventDefault();
    fetch("/NewJob", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(template[0]),
    })
      .then((res) => {
        if (res.ok) {
          setSuccess(true);

          let response = res.text();
          console.log(response);

          response.then((res) => {
            console.log(res);
          });
        } else {
          setError(true);
        }
      })
      .catch((_) => console.log("not sent"));
  };

  return (
    <Page title="New job">
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
      <JobForm
        template={template}
        setTemplate={setTemplate}
        onSubmit={onSubmit}
        hasAdd={false}
      />
    </Page>
  );
}
