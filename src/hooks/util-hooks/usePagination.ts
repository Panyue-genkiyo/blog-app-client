//分页hook
import {useMemo} from 'react';
import useCustomRouter from "./useCustomRouter";

const usePagination = (totalPages: number, page: number, callback:any, sort: string | null) => {
    const {firstArr, lastArr} = useMemo(() => {
        const newArr = [...Array(totalPages)].map((_, i) => i + 1);
        if (totalPages < 4)
            return {
                firstArr: newArr,
                lastArr: []
            }; //当总页数小于4时
        if (totalPages - page >= 4) {
            return {
                firstArr: newArr.slice(page - 1, page + 2), //展示前3页
                lastArr: newArr.slice(totalPages - 1)  //展示最后一页
            }
        } else {
            return {
                firstArr: newArr.slice(totalPages - 4, totalPages),
                lastArr: []
            }
        }
    }, [totalPages, page]);

    const {pushQuery} = useCustomRouter();

    const isActive = (index: number) => {
        if (index === page) return "active"
        return ""
    }

    //上一页
    const prev = () => {
        const newPage = Math.max(page - 1, 1)
        // navigate(`?page=${newPage}`)
        let query = sort ? { page: newPage, sort } : { page: newPage };
        pushQuery(query);
        callback(newPage);
    }

    //下一页
    const next = () => {
        const newPage = Math.min(page + 1, totalPages)
        // navigate(`?page=${newPage}`)
        let query = sort ? { page: newPage, sort } : { page: newPage };
        pushQuery(query); //添加排序
        callback(newPage);
    }

    //跳页
    const jump = (num: number) => {
        // navigate(`?page=${num}`)
        if(num === page) return;
        let query = sort ? { page: num, sort } : { page: num };
        pushQuery(query);
        callback(num);
    }


    return {firstArr, lastArr, isActive, prev, next, jump}
};

export default usePagination;
