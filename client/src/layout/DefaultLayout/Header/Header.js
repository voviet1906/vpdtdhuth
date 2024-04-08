import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import style from './Header.module.scss';
import useAuth from '~/hooks/useAuth';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';

import logo from '~/assets/images/logo.png';

const cx = classNames.bind(style);

function Header() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const { auth, setAuth } = useAuth();

    const handleClick = async () => {
        try {
            await axiosPrivate.delete('/auth/logout');
            localStorage.removeItem('auth');
            setAuth({});
            navigate('/dang-nhap');
        } catch (err) {}
    };

    return (
        <header className={cx('wapper')}>
            <div className={cx('header-left')}>
                <div className={cx('header-logo')}>
                    <img src={logo} alt="logo" />
                </div>
                <div className={cx('header-content')}>
                    <p className={cx('header-title')}>HỆ THỐNG VĂN PHÒNG ĐIỆN TỬ</p>
                    <p className={cx('header-sub-title')}>ĐOÀN - HỘI UTH</p>
                </div>
            </div>
            <div className={cx('header-right')}>
                <p>{auth.name}</p>
                <p onClick={handleClick}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </p>
            </div>
        </header>
    );
}

export default Header;
