import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import usePagination from "../../hooks/util-hooks/usePagination";
import {useAppSelector} from "../../hooks/redux-hooks";

interface IProps{
    total: number,
    callback: (num : number) => void
}

const Pagination: React.FC<IProps> = ({ total, callback }) => {

    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(+(searchParams.get('page') || 1));
    const [sort, setSort] = useState(searchParams.get('sort'));
    const { theme  } = useAppSelector(state => state);
    const { prev, next, jump, firstArr, lastArr, isActive } = usePagination(total, page, callback, sort);

    useEffect(() => {
        if(!searchParams.get('page') && !searchParams.get('sort')) return;
        if(searchParams.get('page')) setPage(parseInt(searchParams.get('page') as string));
        if(searchParams.get('sort')) setSort(searchParams.get('sort'));
        return () => {
            setPage(1);
        }
    }, [searchParams])


    return (
        <div className={`pagination ${theme && 'pagination-night'}`}>
            {page > 1 && <button onClick={prev}>&laquo;</button>}
            {
                firstArr.map(num => (
                    <button onClick={() => jump(num)} key={num} className={`${isActive(num)}`}>
                        {num}
                    </button>
                ))
            }
            {lastArr.length > 0 && <button>...</button>}
            {
                lastArr.map(num => (
                    <button onClick={() => jump(num)} key={num} className={`${isActive(num)}`}>
                        {num}
                    </button>
                ))
            }
            {page < total && <button onClick={next}>&raquo;</button>}
        </div>
    );
};

export default React.memo(Pagination);
