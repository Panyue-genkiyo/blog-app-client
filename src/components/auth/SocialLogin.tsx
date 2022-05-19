import React from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
import { googleLogin, facebookLogin } from "../../features/auth";

import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";

//google/facebook账号登入
const SocialLogin = () => {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector(state => state);
    const onGoogleLoginSuccess = (googleUser: GoogleLoginResponse) => {
        const id_token = googleUser.getAuthResponse().id_token;
        dispatch(googleLogin(id_token));
    }

    const onFacebookLoginSuccess = (facebookLoginAuthResponse: FacebookLoginAuthResponse) => {
        const { accessToken, userID } = facebookLoginAuthResponse.authResponse;
        dispatch(facebookLogin(accessToken, userID));
    }

    return (
        <>
            <div className="my-2">
                <GoogleLogin
                    client_id='261918664418-npl0u3e82pckor7jq5r6u4994tpe6vev.apps.googleusercontent.com'
                    cookiepolicy='single_host_origin'
                    onSuccess={onGoogleLoginSuccess}
                    theme={theme ? 'dark' : 'light'}
                    longtitle={true}
                    isSignedIn={false}
                    height={50}
                />
            </div>
            <div className='my-2'>
                <FacebookLogin
                    appId="494241998812657"
                    onSuccess={onFacebookLoginSuccess}
                    theme='dark'
                />
            </div>
        </>
    );
};

export default SocialLogin;
