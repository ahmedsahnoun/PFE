import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import DashboardApp from './pages/DashboardApp';
import JobList from './pages/JobList';
import NewJob from './pages/NewJob';
import Resume from './pages/Resume';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Products from './pages/Products';
// import Blog from './pages/Blog';
import User from './pages/User'; 
import NotFound from './pages/Page404';
import Newproject from './pages/NewProject';
import Project from './pages/Project';
import Projects from './pages/Projects';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        // { path: '/', element: <Navigate to="/dashboard/app" /> },
        // { path: 'login', element: <Login /> },
        // { path: 'register', element: <Register /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'JobList', element: <JobList /> },
        { path: '404', element: <NotFound /> },
        { path: 'NewJob', element: <NewJob /> },
        { path: 'User', element: <User /> },
        { path: 'NewProject', element: <Newproject Title="New Project" /> },
        { path: 'Project', element: <Project Title="Project" /> },
        { path: 'Projects', element: <Projects Title="Project" /> },
        { path: 'Resume', element: <Resume /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
