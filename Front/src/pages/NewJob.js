import Page from "../components/Page";
import JobForm from "./JobForm";
// ----------------------------------------------------------------------

export default function NewJob() {
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];
	const template = [
		{ id: 1 , position: ':D', skills:[':o'] },
		{ id: 2 , position: '>:('}
	]
  function onSubmit() {
    alert(JSON.stringify(template, null, 2));
  }
  return (
    <Page title="New job">
			<JobForm templates={template} onSubmit={onSubmit}/>
    </Page>
  );
}
