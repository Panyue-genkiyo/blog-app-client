import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { IParams  } from '../../types/globalTypes';
import { postAPI } from "../../utils/fetchData";
import { showErrMsg, showSuccessMsg } from '../../components/alert/Alert'
import {useAppDispatch} from "../../hooks/redux-hooks";
import {setAlert} from "../../features/alert";
//激活用户账户
const Active = () => {
    const { slug }: IParams = useParams();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // console.log(slug);
    useEffect(() => {
        let timer: NodeJS.Timeout  | null = null;
        if(slug) {
            postAPI('active', { active_token: slug })
                .then(res => {
                    setSuccess(res.data.msg)
                    dispatch(setAlert({success:  `${res.data.msg}, 2s后跳转登录页！` }))
                    timer = setTimeout(() => {
                        navigate('/login', { replace: true })
                    }, 2000)
                })
                .catch(err => {
                    setErr(err.response.data.msg)
                    dispatch(setAlert({ errors:  `${err.response.data.msg}, 2s后关闭该页面，请返回申请页重试` }))
                    timer = setTimeout(() => {
                        window.open("about:blank", "_self");
                        window.close();
                    }, 2000)
                })
        }
        return () => {
            if(timer) {
                clearTimeout(timer);
            }
        }
    }, [slug])
    return (
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    );
};

export default Active;
