import React, {useCallback, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {useQueryClient} from "react-query";
import CardHoriz from '../cards/CardHoriz'
import Loading from '../global/Loading';
import Pagination from '../global/Pagination'
import NotContent from "../global/NotContent";
import {useUserHomeBlogs} from "../../hooks/rq-hooks/useBlogs";
import {showErrMsg} from "../alert/Alert";
import ProfileBlogSkeleton from "../skeletons/ProfileBlogSkeleton";
import {useAppSelector} from "../../hooks/redux-hooks";
import {setUserLocation} from "../../features/userlocation";

interface IProps{
    name: string
}

const UserBlogs: React.FC<IProps> = ({ name }) => {
    const { auth, userLocation } = useAppSelector(state => state)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const num = queryClient.isFetching(['refreshToken'])
    const page = new URLSearchParams(useLocation().search).get('page');
    const user_id = useParams().slug
    const homePage = (user_id && userLocation['user'][user_id]?.home);
    const { data: userBlogs, error, isError, isFetching, isLoading } = useUserHomeBlogs(name, user_id,3, homePage ? homePage : +(page || '1'));

    const handlePagination = useCallback((num: number) => {
        if (user_id) {
            dispatch(setUserLocation({
                target: 'home',
                userId: user_id,
                page: num
            }))
        }
    },[]);


    useEffect(() => {
        if(user_id) {
            if(homePage) {
                if(!page) navigate(`/profile/${user_id}?page=${homePage}`)
                else navigate(`/profile/${user_id}?page=${page}`)
            }else{
                if(page){
                    dispatch(setUserLocation({
                        target: 'home',
                        userId: user_id,
                        page: parseInt(page)
                    }))
                }else{
                    dispatch(setUserLocation({
                        target: 'home',
                        userId: user_id,
                        page: 1
                    }))
                }
            }
        }
    }, [user_id]);

    useEffect(() => {
        if(userBlogs && userBlogs.blogs.length === 0 && userBlogs.total >= 1){
            navigate(`/profile/${user_id}?page=${userBlogs.total}`);
        }
    }, [userBlogs?.blogs.length, navigate]);

    useEffect(() => {
        if(user_id && homePage && page === null){
            dispatch(setUserLocation({
                target: 'home',
                userId: user_id,
                page: 1
            }))
        }
        if(user_id && homePage && page && parseInt(page) !== homePage){
            dispatch(setUserLocation({
                target: 'home',
                userId: user_id,
                page: parseInt(page)
            }))
        }
    }, [page, user_id, homePage, navigate])


    if(num === 1 || isLoading) return <ProfileBlogSkeleton/>

    if(isError) return showErrMsg((error as any).message);

    if(userBlogs?.blogs.length === 0 && userBlogs?.total < 1 && !isFetching) return <NotContent msg={`${ auth.user?._id === user_id ? '你': 'TA' }还没有个人博客哦${auth.user?._id === user_id ? ',赶紧去写一篇吧': ''}`}/>

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

export default UserBlogs
