import React, { useEffect } from 'react';
import { useQueryClient } from "react-query";
import { Link } from 'react-router-dom';
import { Button } from "@mantine/core";
import { IBlog } from "../types/globalTypes";
import CardVert from "../components/cards/CardVert";
import NotContent from "../components/global/NotContent";
import { useHomeBlogs } from "../hooks/rq-hooks/useBlogs";
import HomeSkeleton from "../components/skeletons/HomeSkeleton";
import {useAppSelector} from "../hooks/redux-hooks";


const Home = () => {

    const { data: homeBlogsData, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } = useHomeBlogs();
    const { theme, socket } = useAppSelector(state => state);
    const queryClient = useQueryClient();

    useEffect(() => {
        if(homeBlogsData){
            let data:IBlog[] = [];
            homeBlogsData.pages.forEach((item) => {
                item.blogs.forEach(b => {
                    data.push(...b.blogs);
                })
            });
            queryClient.setQueryData<IBlog[]>('k1', data);
        }
    }, [homeBlogsData])

    useEffect(() => {
        if(!socket) return;
        socket.emit('joinRoom', 'home');
        return () => {
            socket.emit('leaveRoom', 'home');
        }
    }, [socket])

    if(homeBlogsData?.pages.length === 0) return <NotContent msg={'没有博客'}/>

    return (
        <div className='home_page'>
            {
               isLoading ? <HomeSkeleton /> :
                homeBlogsData?.pages.map((homeBlog) => (
                        homeBlog.blogs.map(h => (
                            <div key={h._id}>
                                {
                                    h.count > 0 &&
                                    <>
                                        <h3>
                                            <Link to={`/blogs/${(h.name).toLowerCase()}`} className={`${theme && 'home-link-night'}`}>
                                                {h.name} <small>({h.count})</small>
                                            </Link>
                                        </h3>
                                        <hr className='mt-1'/>
                                        <div className='home_blogs'>
                                            {
                                                h.blogs.map(blog => (
                                                    <CardVert key={blog._id} blog={blog}/>
                                                ))
                                            }
                                        </div>
                                    </>
                                }
                                {
                                    h.count > 4 &&
                                    <Link className="text-end d-block my-2 mb-3 text-decoration-none" to={`/blogs/${h.name}`}>
                                        查看更多 &gt;&gt;
                                    </Link>
                                }
                            </div>
                        ))
                ))
            }
            {
                hasNextPage && <div className='home_hasMore_button'>
                    <Button
                        variant="gradient" gradient={!theme ? { from: 'teal', to: 'blue', deg: 60 } : {from: '#1e3799', to: '#0a3d62', deg: 60}}
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                        loading={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? '加载中...' : '加载更多'}
                    </Button>
                </div>
            }
        </div>
    );
};

export default Home;
