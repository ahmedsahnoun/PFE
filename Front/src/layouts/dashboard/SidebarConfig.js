// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Home',
    path: '/app',
    icon: getIcon('ant-design:home-outlined')
  },
  // {
  //   title: 'New job',
  //   path: '/NewJob',
  //   icon: getIcon('eva:people-fill')
  // },
  {
    title: 'New project',
    path: '/NewProject',
    icon: getIcon('codicon:new-file')
  },
  // {
  //   title: 'Job list',
  //   path: '/JobList',
  //   icon: getIcon('eva:shopping-bag-fill')
  // },
  {
    title: 'Projects',
    path: '/Projects',
    icon: getIcon('icomoon-free:files-empty')
  },
  {
    title: 'Resumes',
    path: '/Resumes',
    icon: getIcon('bi:file-earmark-person')
  },
];

export default sidebarConfig;
