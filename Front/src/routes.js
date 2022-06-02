import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
// import DashboardApp from './pages/DashboardApp';
// import JobList from './pages/JobList';
// import NewJob from './pages/NewJob';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Products from './pages/Products';
// import Blog from './pages/Blog';
// import User from './pages/User'; 
import Update from './pages/ModifyProject';
import Resume from './pages/Resume';
import Resumes from './pages/Resumes';
import Homepage from './pages/Homepage'
import NotFound from './pages/Page404';
import Newproject from './pages/NewProject';
import Project from './pages/Project';
import ProjectTable from './pages/ProjectTable';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/Homepage" /> },
        // { path: 'login', element: <Login /> },
        // { path: 'register', element: <Register /> },
        // { path: 'User', element: <User /> },
        // { path: 'JobList', element: <JobList /> },
        // { path: 'NewJob', element: <NewJob /> },
        // { path: 'app', element: <DashboardApp /> },
        { path: 'Homepage', element: <Homepage /> },
        { path: '404', element: <NotFound /> },
        { path: 'NewProject', element: <Newproject/> },
        { path: 'Update/:id', element: <Update/> },
        { path: 'Project/:id', element: <Project/> },
        { path: 'Projects', element: <ProjectTable /> },
        { path: 'Resume/:id', element: <Resume /> },
        { path: 'Resumes', element: <Resumes /> },
        { path: '*', element: <NotFound/> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
