import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Training from '~/pages/Training';
import Year from '~/pages/Year';
import Semester from '~/pages/Semester';
import User from '~/pages/User';
import Student from '~/pages/Student';
import Activity from '~/pages/Activity';
import Approve from '~/pages/Approve';
import Certification from '~/pages/Certification';
import SearchCertification from '~/pages/SearchCertification';
import Setting from '~/pages/Setting';
import Password from '~/pages/Password';

const publicRoutes = [
    { path: '/dang-nhap', component: Login, layout: null },
    { path: '/tra-cuu', component: SearchCertification, layout: null },
];

const privateRoutes = [
    { path: '/', allowedRoles: ['A', 'M', 'U'], component: Home },
    { path: '/doi-mat-khau', allowedRoles: ['A', 'M', 'U'], component: Password },
    { path: '/ren-luyen', allowedRoles: ['A'], component: Training },
    { path: '/nam-hoc', allowedRoles: ['A'], component: Year },
    { path: '/hoc-ky', allowedRoles: ['A'], component: Semester },
    { path: '/tai-khoan', allowedRoles: ['A'], component: User },
    { path: '/hoi-vien', allowedRoles: ['A'], component: Student },
    { path: '/cai-dat', allowedRoles: ['A'], component: Setting },
    { path: '/duyet-hoat-dong', allowedRoles: ['M'], component: Approve },
    { path: '/hoat-dong', allowedRoles: ['U'], component: Activity },
    { path: '/chung-nhan', allowedRoles: ['U'], component: Certification },
];

export { publicRoutes, privateRoutes };
