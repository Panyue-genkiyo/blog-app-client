import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import io from 'socket.io-client';
import PageRender from "./PageRender";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import SocketClient from "./components/socket/SocketClient";
import {logout} from "./features/auth";
import {API_URL} from './utils/config'
import {useCategories} from "./hooks/rq-hooks/useCategories";
import {Alert} from './components/alert/Alert';
import Fixation from "./components/global/Fixation";
import {useRefreshToken} from "./hooks/rq-hooks/useAuth";
import SocketClientHome from "./components/socket/SocketClientHome";
import SocketClientCBHome from "./components/socket/SocketClientCBHome";
import SocketClientProfileHome from "./components/socket/SocketClientProfileHome";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {setSocket} from "./features/socket";

const App = () => {

    const dispatch = useAppDispatch();
    const logged = localStorage.getItem('logged');
    const { theme, auth } = useAppSelector(state => state);
    const { data: userData } = useRefreshToken({dispatch, token: ''});

    useCategories();
    useEffect(() => {
        const socket = io(API_URL);
        dispatch(setSocket(socket));
        return () => {
            socket.close();
        }
    }, [dispatch]);
    useEffect(() => {
        const html = document.querySelector('html') as HTMLElement;
        theme ? html.classList.add('index-night') : html.classList.remove('index-night');
    }, [theme])
    useEffect(() => {
        if(!logged && auth.access_token && userData) {
            dispatch(logout(auth.access_token));
        }else if(logged && !auth.access_token && !userData) {
            localStorage.setItem('isFirst', 'false');
        }
    }, [userData, dispatch, logged]);

    return (
        <div className={`container`}>
            <SocketClientProfileHome/>
            <SocketClientCBHome/>
            <SocketClientHome/>
            <SocketClient/>
            <Alert/>
            <Header/>
            <Routes>
                <Route path='/' element={<PageRender/>}/>
                <Route path='/:page' element={<PageRender/>}/>
                <Route path='/:page/:slug/*' element={<PageRender/>}/>
            </Routes>
            <Fixation/>
            <Footer/>
        </div>
    );
};

export default App;
