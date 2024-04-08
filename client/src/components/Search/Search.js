import { useState, useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import useDebounce from '~/hooks/useDebouce';
import style from './Search.module.scss';

const cx = classNames.bind(style);

function Input({ onSearch }) {
    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);
    useEffect(() => {
        onSearch(debounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounce]);

    return (
        <div className={cx('form-group')}>
            <input className={cx('form-search')} onChange={(e) => setSearchValue(e.target.value)} />
            <div className={cx('form-icon')}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
        </div>
    );
}

export default memo(Input);
