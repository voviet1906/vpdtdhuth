import classNames from 'classnames/bind';
import style from './DefaultLayout.module.scss';

import Header from './Header';
import { AdminSidebar, ManagerSidebar, UserSidebar } from './Sidebar';
import Footer from './Footer';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(style);

function DefaultLayout({ children }) {
    const { auth } = useAuth();

    return (
        <div>
            <Header />
            <div className={cx('container')}>
                {auth.role === 'A' ? <AdminSidebar /> : auth.role === 'M' ? <ManagerSidebar /> : <UserSidebar />}
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
