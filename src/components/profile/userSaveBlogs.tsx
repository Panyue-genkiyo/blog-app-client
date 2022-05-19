import React, {useCallback, useEffect} from 'react'
import {useParams, useLocation, useNavigate} from 'react-router-dom'
import {useQueryClient} from "react-query";
import CardHoriz from '../cards/CardHoriz'
import Loading from '../global/Loading';
import Pagination from '../global/Pagination'
import NotContent from "../global/NotContent";
import { useUserHomeBlogs } from "../../hooks/rq-hooks/useBlogs";
import { showErrMsg } from "../alert/Alert";
import ProfileBlogSkeleton from "../skeletons/ProfileBlogSkeleton";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setUserLocation} from "../../features/userlocation";

interface IProps{
    name: string
}

const UserSaveBlogs: React.FC<IProps> = ({ name }) => {
    const { auth, userLocation, theme } = useAppSelector(state => state)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const num = queryClient.isFetching(['refreshToken'])
    const user_id = useParams().slug;
    const page = new URLSearchParams(useLocation().search).get('page');
    const savePage = (user_id && userLocation['user'][user_id]?.save);
    const { data: userBlogs, error, isError, isFetching, isLoading } = useUserHomeBlogs(name, user_id,3,  savePage ? savePage : +(page || '1'));

    const handlePagination = useCallback((num: number) => {
        if (user_id) {
            dispatch(setUserLocation({
                target: 'save',
                userId: user_id,
                page: num
            }))
        }
    },[]);


    useEffect(() => {
        if(user_id) {
            if(savePage){
               if(!page)  navigate(`/profile/${user_id}/saves?page=${savePage}`, {replace: true});
               else navigate(`/profile/${user_id}/saves?page=${page}`);
            }else{
                if(page){
                    dispatch(setUserLocation({
                        target: 'save',
                        userId: user_id,
                        page: +page
                    }))
                }else{
                    dispatch(setUserLocation({
                        target: 'save',
                        userId: user_id,
                        page: 1
                    }))
                }
            }
        }
    }, [user_id, page]);

    useEffect(() => {
        if(userBlogs && userBlogs.blogs.length === 0 && userBlogs.total >= 1){
            navigate(`/profile/${user_id}/saves?page=${userBlogs.total}`);
        }
    }, [userBlogs?.blogs.length, navigate]);

    useEffect(() => {
        if(user_id && savePage && page && parseInt(page) !== savePage){
            dispatch(setUserLocation({
                target: 'save',
                userId: user_id,
                page: +page
            }))
        }
    }, [page, user_id, savePage])


    if(num === 1 || isLoading) return <ProfileBlogSkeleton/>

    if(isError) return showErrMsg((error as any).message);

    if(userBlogs?.blogs.length === 0 && userBlogs?.total < 1 && !isFetching)return <NotContent msg={`${ auth.user?._id === user_id ? '你': 'TA' }还没有收藏博客哦${auth.user?._id === user_id ? ',赶紧去收藏一篇吧': ''}`}/>

    return (
        <div className='mt-2'>
            <div>
                {
                    userBlogs?.blogs.map(blog => (
                        <CardHoriz key={blog._id} blog={blog} />
                    ))
                }
            </div>

            <div>
                { isFetching ? <Loading/> : ( (userBlogs?.total as number) > 1 && <Pagination
                    total={userBlogs?.total as number}
                    callback={handlePagination}
                />)}
            </div>
        </div>
    )
}

export default UserSaveBlogs;
