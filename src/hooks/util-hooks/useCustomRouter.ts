import {useCallback} from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const useCustomRouter = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const pushQuery = useCallback((query: any) => {
        const newQuery = new URLSearchParams(query).toString();
        navigate(`${pathname}?${newQuery}`);
    }, [navigate, pathname]);

    return { pushQuery }
};

export default useCustomRouter;
