import React from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";

const Footer = () => {
    const { theme } = useAppSelector(state => state);

    return (
        <div className={`text-center bg-light py-4 ${theme && 'footer-night'}`}>
            <h6>欢迎来到pan's社群博客分享平台</h6>
            <a
                href="https://github.com/Panyue-genkiyo/blog-project"
                target='_blank' rel='noreferrer'
                className='mb-2 d-block'
            >
                项目源码
            </a>
            <p>CopyRight &copy; 2022</p>
        </div>
    );
};

export default Footer;
