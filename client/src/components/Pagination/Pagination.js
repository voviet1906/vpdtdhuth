import classNames from 'classnames/bind';
import style from './Pagination.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button';

const cx = classNames.bind(style);

const Pagination = ({ page, pages, changePage }) => {
    let middlePagination;

    if (pages <= 5) {
        middlePagination = [...Array(pages)].map((_, idx) => (
            <Button primary tiny key={idx + 1} onClick={() => changePage(idx + 1)} disabled={page === idx + 1}>
                {idx + 1}
            </Button>
        ));
    } else {
        const startValue = Math.floor((page - 1) / 5) * 5;

        middlePagination = (
            <>
                {[...Array(5)].map((_, idx) => (
                    <Button
                        primary
                        tiny
                        key={startValue + idx + 1}
                        disabled={page === startValue + idx + 1}
                        onClick={() => changePage(startValue + idx + 1)}
                    >
                        {startValue + idx + 1}
                    </Button>
                ))}
                <Button primary tiny>
                    ...
                </Button>
                <Button primary tiny onClick={() => changePage(pages)}>
                    {pages}
                </Button>
            </>
        );

        if (page > 3) {
            if (pages - page >= 3) {
                const startValue = page - 3;

                middlePagination = (
                    <>
                        <Button primary tiny onClick={() => changePage(1)}>
                            1
                        </Button>
                        <Button primary tiny>
                            ...
                        </Button>
                        {[...Array(5)].map((_, idx) => (
                            <Button
                                primary
                                tiny
                                key={startValue + idx + 1}
                                disabled={page === startValue + idx + 1}
                                onClick={() => changePage(startValue + idx + 1)}
                            >
                                {startValue + idx + 1}
                            </Button>
                        ))}
                        <Button primary tiny>
                            ...
                        </Button>
                        <Button primary tiny onClick={() => changePage(pages)}>
                            {pages}
                        </Button>
                    </>
                );
            } else {
                const startValue = pages - 5;
                middlePagination = (
                    <>
                        <Button primary tiny onClick={() => changePage(1)}>
                            1
                        </Button>
                        <Button primary tiny>
                            ...
                        </Button>
                        {[...Array(5)].map((_, idx) => (
                            <Button
                                primary
                                tiny
                                key={startValue + idx + 1}
                                disabled={page === startValue + idx + 1}
                                style={pages < startValue + idx + 1 ? { display: 'none' } : null}
                                onClick={() => changePage(startValue + idx + 1)}
                            >
                                {startValue + idx + 1}
                            </Button>
                        ))}
                    </>
                );
            }
        }
    }

    return (
        pages > 1 && (
            <div className={cx('pagination')}>
                <Button primary tiny onClick={() => changePage((page) => page - 1)} disabled={page === 1}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                {middlePagination}
                <Button primary tiny onClick={() => changePage((page) => page + 1)} disabled={page === pages}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
            </div>
        )
    );
};

export default Pagination;
