import Page from "../components/Page";
import JobForm from "./JobForm";
import { useState } from "react";
// ----------------------------------------------------------------------

export default function NewJob() {
  const templates = [
    { position: ':D', skills:[':o',':D',':('], location:":) location", about:":)"},
    { position: '>:(', skills:['>:o'], location:":( location", about:":("}
  ]
  
  const [template, setTemplate] = useState(templates);
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];
  function onSubmit() {
    console.log(template)
    alert(JSON.stringify(template, null, 2));
  }
  return (
    <Page title="New job">
			<JobForm template={template} setTemplate={setTemplate} onSubmit={onSubmit}/>
    </Page>
  );
}
