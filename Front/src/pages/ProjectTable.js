import { filter } from "lodash";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Page from "../components/Page";
// import { sentenceCase } from "change-case";
// import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import SearchNotFound from "../components/SearchNotFound";
import CircularProgress from "@mui/material/CircularProgress";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../sections/@dashboard/user";
import { useEffect } from "react";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: "Title", alignRight: false },
  { id: "dateD", label: "Start date", alignRight: false },
  { id: "datef", label: "Finish date", alignRight: false },
  { id: "client", label: "Client", alignRight: false },
  { id: "manager", label: "Manager", alignRight: false },
  // { id: "status", label: "Status", alignRight: false },
  { id: "" },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProjectTable() {
  const [USERLIST, setUSERLIST] = useState([]);
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("title");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const refreshTable = () => {
    setloading(true);
    fetch("/Projects", {
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
            setUSERLIST(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));
      setloading(false);
  };

  useEffect(() => {
    refreshTable();
  }, []);

  const Delete = (input) => {
    fetch("/DeleteProjects", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (res.ok) {
          let response = res.text();

          response.then((res) => {
            // let result = JSON.parse(res)["result"];
            // console.log(result);
          });
        }
      })
      .catch((_) => console.log("not sent"));

    refreshTable();
    setSelected([]);
  };
  return (
    <div>
      <Page title="Projects">
        <Typography variant="h3" align="right" sx={{ color: "white", pr: 8 }}>
          Projects
        </Typography>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Button
              align="left"
              variant="contained"
              component={RouterLink}
              to="/NewProject"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Project
            </Button>
          </Stack>
          <Card sx={{ boxShadow: 8 }}>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              onDeleteMany={() => Delete(selected)}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  {loading ? (
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan="100%">
                          <CircularProgress
                            sx={{
                              position: "relative",
                              left: "50%",
                              top: "50%",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const isItemSelected =
                            selected.indexOf(row._id) !== -1;
                          return (
                            <TableRow
                              key={row._id}
                              hover
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) =>
                                    handleClick(event, row._id)
                                  }
                                />
                              </TableCell>
                              <TableCell align="left">{row.title}</TableCell>
                              <TableCell align="left">
                                {row.dateD}
                              </TableCell>
                              <TableCell align="left">
                                {row.dateF}
                              </TableCell>
                              <TableCell align="left">{row.client}</TableCell>
                              <TableCell align="left">{row.manager}</TableCell>
                              {/* <TableCell align="left">
                                <Label
                                  variant="ghost"
                                  color={
                                    ("help" === "banned" && "error") ||
                                    "success"
                                  }
                                >
                                  {sentenceCase("heeelp")}
                                </Label>
                              </TableCell> */}
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  component={RouterLink}
                                  to={"/Project/" + row._id}
                                  startIcon={
                                    <Iconify icon="fa-solid:sign-out-alt" />
                                  }
                                >
                                  Access
                                </Button>
                              </TableCell>
                              <TableCell align="right">
                                <UserMoreMenu
                                  onDelete={() => Delete([row._id])}
                                  update={"Update/" + row._id }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Page>
    </div>
  );
}
