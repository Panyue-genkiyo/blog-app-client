import React, {RefObject } from 'react';
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../features/auth";
import {useQueryClient} from "react-query";
import {Skeleton} from "@mantine/core";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";


//菜单组件
interface MenuProps {
    targetMenu: RefObject<null | HTMLDivElement>
}

const Menu = ( { targetMenu }: MenuProps ) => {

    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const { auth, theme } = useAppSelector(state => state);
    const num = queryClient.isFetching('refreshToken');

    const isActive = (pn: string) => {
        if(pn === pathname) return 'active';
    }

    const bfLoginLinks = [
        { label: '登录', path: '/login' },
        { label: '注册', path: '/register' },
    ];

    const afLoginLinks = [
        { label: '主页', path: '/' },
        { label: '创作博客', path: '/create_blog' }
    ]

    //跳转链接关闭下拉菜单
    const handleAfterClickLinks = () => {
        if (targetMenu?.current?.classList.contains('show')) {
            targetMenu.current.classList.remove('show');
        }
    }

    const handleLogOut = () => {
        if(!auth.access_token) return;
        dispatch(logout(auth.access_token));
    }


    const navLinks = auth.access_token ? afLoginLinks : bfLoginLinks;


    return (
        <ul className="navbar-nav ms-auto">
            {
                num === 1 ? <Skeleton width={100} height={20} className={`link-skeleton ${theme && 'skeleton-night'}`}/> :
                navLinks.map((link, index) => (
                    <li key={index} className={`nav-item ${isActive(link.path)}`}>
                        <Link onClick={handleAfterClickLinks} className="nav-link" to={link.path}>{link.label}</Link>
                    </li>
                ))
            }

            {
                num !== 1 &&
                auth.user?.role === 'admin' && (
                    <li className={`nav-item ${isActive("/category")}`}>
                        <Link onClick={handleAfterClickLinks} className='nav-link' to='/category'>分类</Link>
                    </li>
                )
            }


            {
                num === 1  ? (
                    <Skeleton  height={30} width={30} circle className={`avatar-skeleton ${theme && 'skeleton-night'}`}/>
                    ) :
                    (auth.user &&  <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                     <img src={auth.user.avatar} alt="avatar" className='avatar'/>
                </span>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                        <Link className="dropdown-item" onClick={handleAfterClickLinks} to={`/profile/${auth.user._id}`}>
                            个人主页
                        </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <Link className="dropdown-item" to="/"
                              onClick={() => {handleAfterClickLinks();handleLogOut() }}>
                            退出
                        </Link>
                    </li>
                </ul>
            </li>)
            }

        </ul>
    );
};

export default Menu;
