import { useState, useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import style from './Select.module.scss';

import useAxiosPrivate from '~/hooks/useAxiosPrivate';

const cx = classNames.bind(style);

function Input({ name, lable, link, value, onSet }) {
    const axiosPrivate = useAxiosPrivate();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await axiosPrivate.get(`/${link}`);
            setOptions(response.data.results);
        }

        fetchMyAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [link]);
    return (
        <div className={cx('form-select')}>
            <label className={cx('label')}>{lable}</label>
            <select name={name} value={value} className={cx('select')} onChange={(e) => onSet(e.target.value)}>
                <option value="">-- Nội dung</option>
                {options.map((option, index) => (
                    <option key={index} value={option._id}>
                        {option.name ? option.name : option.content}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default memo(Input);
