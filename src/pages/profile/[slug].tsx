import React, { useEffect } from 'react';
import { useParams, Routes, Route } from "react-router-dom";
import { Skeleton } from "@mantine/core";
import {IParams} from "../../types/Typescript";
import OtherInfo from "../../components/profile/OtherInfo";
import UserInfo from "../../components/profile/UserInfo";
import ProfileNavBar from "../../components/global/ProfileNavBar";
import UserBlogs from "../../components/profile/UserBlogs";
import UserLikeBlogs from "../../components/profile/userLikeBlogs";
import UserSaveBlogs from "../../components/profile/userSaveBlogs";
import {useQueryClient} from "react-query";
import {useAppSelector} from "../../hooks/redux-hooks";

const Profile = () => {

    const { slug }: IParams  = useParams();
    const queryClient = useQueryClient();
    const num = queryClient.isFetching(['refreshToken']);

    const { auth, theme, socket } = useAppSelector(state => state);

    useEffect(() => {
        if(!socket || !slug) return;
        socket.emit('joinRoom', `profile_${slug}`);
        return () => {
            socket.emit('leaveRoom',`profile_${slug}`);
        }
    }, [socket, slug])

    return (
        <div className='row my-6'>
            <div className="col-md-5 mb-3">
                {
                    num === 1 ? <Skeleton height={600} width={'100%'} className={`${theme && 'skeleton-night'}`}/> :  auth.user?._id === slug
                    ? <UserInfo/> : <OtherInfo id={slug}/>
                }
            </div>
            <div className="col-md-7">
                <ProfileNavBar/>
                <Routes>
                    <Route index element={<UserBlogs name='user'/>}/>
                    <Route path='likes' element={<UserLikeBlogs name={'like'}/>}/>
                    <Route path='saves' element={<UserSaveBlogs name={'save'}/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default Profile;
