import Page from "../components/Page";
import JobForm from "./JobForm";
import { useState } from "react";
// ----------------------------------------------------------------------

export default function NewJob() {
  const templates = [
    { position: 'data scientist', skills:['machine learning','python'], location:"location 1", about:""},
    { position: 'manager', skills:[], location:'', about:''},
    { position: '', skills:[], location:"location 2", about:""},
  ]
  
  const [template, setTemplate] = useState(templates);
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];

  const onSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/NewJob", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(template),
    })
      .then((res) => {
        if (res.ok) {
          console.log("sent")
          console.log(res)
        }
      })
      .catch((_) => console.log("not sent"))
  }

  return (
    <Page title="New job">
			<JobForm template={template} setTemplate={setTemplate} onSubmit={onSubmit}/>
    </Page>
  );
}
