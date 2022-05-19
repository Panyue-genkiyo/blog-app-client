import React from 'react';
import { Link , useLocation} from 'react-router-dom'
import RegisterForm from "../components/auth/RegisterForm";
import useCheckIfLoggedIn from "../hooks/util-hooks/useCheckIfLoggedIn";
import {useAppSelector} from "../hooks/redux-hooks";

const Register = () => {

    const location = useLocation();
    const { theme } = useAppSelector(state => state);
    const { isLogin } = useCheckIfLoggedIn()

    return (
        <div className={`auth_page ${theme && 'auth-page-night'}`}>
            <div className="auth_box">
                <h3 className='text-center mb-4'>
                    注册
                </h3>
                <RegisterForm isLogin={isLogin}/>
                <p className="mt-2">
                    {`已经有账号了？`}
                    <Link to={`/login${location.search}`} style={{ color:'crimson' }}>
                        立即登录
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
