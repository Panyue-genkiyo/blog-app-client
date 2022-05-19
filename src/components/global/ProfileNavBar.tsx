import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';


const ProfileNavBar = () => {

    const [active, setActive] = useState('');

    const location = useLocation();

    const links = [
        { to: '', icon: <i className="fas fa-home"/> },
        { to: 'likes', icon: <i className="fas fa-heart"/> },
        { to: 'saves', icon: <i className="fas fa-bookmark"/>}
    ]

    useEffect(() => {
        if(location.pathname.includes('saves')) {
            setActive('saves');
        } else if(location.pathname.includes('likes')) {
            setActive('likes');
        } else {
            setActive('');
        }
    },[location.pathname])

    return (
        <ul className="nav nav-pills nav-fill">
            {
                links.map((l, index) => (
                    <li className="nav-item" key={index}>
                        <Link className={`nav-link ${l.to === active && 'active'}`}
                              aria-current="page"
                              to={l.to}
                        >
                            {l.icon}
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
};

export default ProfileNavBar;
