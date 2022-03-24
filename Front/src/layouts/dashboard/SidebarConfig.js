// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Home',
    path: '/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'New job',
    path: '/NewJob',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'New project',
    path: '/NewProject',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'Job list',
    path: '/JobList',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'Resume',
    path: '/Resume',
    icon: getIcon('eva:file-text-fill')
  }
];

export default sidebarConfig;
