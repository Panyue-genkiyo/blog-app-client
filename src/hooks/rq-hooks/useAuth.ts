import { useQuery } from "react-query";
import { IAuth } from "../../types/rd-types/authTypes";
import {tokenAndDispatch} from "../../types/Typescript";
import { getRefreshToken, getIsLogged } from "../../api/authApi";
import {setAlert} from "../../features/alert";

//检查是否登录成功
export default function  useAuth() {
    return  useQuery(['user'],
        getIsLogged,
        {
            staleTime: 0,
            refetchOnWindowFocus: true
        }
    );
}

//获取refreshToken
export function useRefreshToken({dispatch}: tokenAndDispatch) {
    return useQuery<IAuth>(['refreshToken'], () =>  getRefreshToken(dispatch), {
        refetchOnWindowFocus: true,
        staleTime: 60 * 60 * 1000 * 24, // 1 day
        retry: false,
        onError: (err: any) => {
            dispatch(setAlert({errors: err.response.data.msg, isShow: true}));
            localStorage.removeItem("logged");
        },
        enabled:!!localStorage.getItem('logged') && localStorage.getItem('isFirst') !== 'true'
    });
}
