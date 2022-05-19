import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginPass from "../components/auth/LoginPass";
import SocialLogin from "../components/auth/SocialLogin";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {setAlert} from "../features/alert";

const Login = () => {
    const navigate = useNavigate();
    const { key, search } = useLocation();
    const dispatch = useAppDispatch();
    const { theme, auth } = useAppSelector(state => state);


    useEffect(() => {
        if(key === 'default' && (auth.access_token)) {
            dispatch(setAlert({ success: '已登入该系统，跳回主页' }))
        }
    }, [key, dispatch, auth.access_token]);

    useEffect(() => {
        if(auth.access_token){
            let url = search.replace('?', '/');
            if(url === '') url = '/';
            navigate(url);
        }
    }, [auth.access_token , navigate, search]);

    return (
        <div className={`auth_page ${theme && 'auth-page-night'}`}>
            <div className="auth_box">
                <h3 className='text-center mb-4'>
                     登录
                </h3>
                <SocialLogin/>
                <LoginPass/>
                <small className='row my-2 text-primary' style={{cursor: 'pointer'}}>
                    <span className='col-6'>
                        <Link to='/forgot_password' className='col-6'>
                           忘记密码?
                        </Link>
                    </span>
                </small>
                <p>
                    {`还没有账号？`}
                    <Link to={`/register${search}`} style={{ color:'crimson' }}>
                        立即注册
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
