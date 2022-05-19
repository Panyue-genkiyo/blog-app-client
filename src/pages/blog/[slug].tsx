import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {IParams} from "../../types/Typescript";
import {useBlogs} from "../../hooks/rq-hooks/useBlogs";
import DisplayBlog from "../../components/blog/DisplayBlog";
import NotFound from "../../components/global/NotFound";
import useDeleteDispose from "../../hooks/util-hooks/useDeleteDispose";
import BlogSkeleton from "../../components/skeletons/BlogSkeleton";
import {useAppSelector} from "../../hooks/redux-hooks";


const DetailBlog = () => {

    const { slug: id }: IParams = useParams();
    const { socket } = useAppSelector(state => state);
    const { isError, isLoading, data: blog } = useBlogs(id);


    useDeleteDispose(isError, id);

    //socket io
    useEffect(() => {
        if(!id || !socket) return;
        socket.emit('joinRoom', id);
        socket.emit('joinRoom', 'home')
        return () => {
            socket.emit('leaveRoom', id);
            socket.emit('leaveRoom', 'home');
        }
    }, [socket, id]);

    if(isLoading) return <BlogSkeleton/>


    if(isError) return <NotFound/>

    return (
        <div className='my-4'>
            <DisplayBlog blog={blog}/>
        </div>
    );

};

export default DetailBlog;
