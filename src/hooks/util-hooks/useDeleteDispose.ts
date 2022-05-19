import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "react-query";
import {useAppDispatch} from "../redux-hooks";
import {setAlert} from "../../features/alert";

const useDeleteDispose = (isError: boolean, id?: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if(isError) {
            dispatch(setAlert({ errors:  '该博文不存在或已被删除，3秒后跳回首页', isShow: true } ))
            timer = setTimeout(() => {
                navigate('/');
                id && queryClient.removeQueries(['blog', id]);
            }, 3000);
        }
        return () => {
            if(timer) clearTimeout(timer);
        }
    }, [isError]);
};

export default useDeleteDispose;
