import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useQueryClient} from 'react-query';
import {IParams} from "../../types/Typescript";
import {categoriesData} from "../../types/rq-types/categoryTypes";
import {useCategoryBlogs} from "../../hooks/rq-hooks/useBlogs";
import Loading from "../../components/global/Loading";
import {showErrMsg} from "../../components/alert/Alert";
import Sorting from "../../components/global/Sorting";
import Pagination from "../../components/global/Pagination";
import CardVert from "../../components/cards/CardVert";
import CategoryBlogsSkeleton from "../../components/skeletons/CategoryBlogsSkeleton";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setBlogCategoryLocation} from "../../features/userlocation";

const BlogsByCategory = () => {

    const { theme, userLocation, socket } = useAppSelector(state => state);
    const { slug }: IParams = useParams();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [categoryId, setCategoryId] = useState('');
    const cd = queryClient.getQueryData<categoriesData>(['categories']);
    const blog_page = userLocation['bc'][categoryId]?.page;
    const blog_sort = userLocation['bc'][categoryId]?.sort;
    const page = new URLSearchParams(useLocation().search).get('page');
    const sort = new URLSearchParams(useLocation().search).get('sort');
    const { data: blogData, isFetching, isError, error } = useCategoryBlogs(categoryId ? categoryId : undefined, blog_page ? blog_page : +(page || '1') , blog_sort ? blog_sort : (sort || '-createdAt'));

    useEffect(() => {
         if(!slug || !socket || !categoryId) return;
         socket.emit('joinRoom', `categoryId_${categoryId}`);
         socket.emit('joinRoom','home');
         return () => {
             socket.emit('leaveRoom', `categoryId_${categoryId}`);
             socket.emit('leaveRoom','home');
         }
    }, [dispatch, slug, categoryId])

    useEffect(() => {
        const category = cd?.categories.find(category => category.name === slug);
        if (category) setCategoryId(category._id);
    }, [cd, slug]);


    useEffect(() => {
        if(categoryId){
            if(blog_page && blog_sort && !sort && !page){
                    navigate(`/blogs/${slug}?page=${blog_page}&sort=${blog_sort}`, { replace: true });
            }
        }
    }, [categoryId, blog_page, blog_sort, navigate, dispatch]);

    useEffect(() => {
        if(categoryId && !page && !sort && !blog_page && !blog_sort){
            dispatch(setBlogCategoryLocation({
                categoryId,
                page: 1,
                sort: '-createdAt'
            }))
        }
        else if(categoryId && page && sort && (+page !== blog_page || sort !== blog_sort)){
            dispatch(setBlogCategoryLocation({
                categoryId,
                page: +page,
                sort
            }))
        }
    }, [categoryId, page, sort])

    const handlePagination = useCallback( (num: number) => {
        if(categoryId){
            dispatch(setBlogCategoryLocation({
                categoryId,
                sort: blog_sort ? blog_sort : (sort || '-createdAt'),
                page: num
            }))
        }
    },[categoryId]);

    if(!blogData) return <CategoryBlogsSkeleton/>

    if(isError) return showErrMsg((error as any).message);

    return (
        <div className={`blogs_category ${theme && 'blogs-category-night'}`}>
            {categoryId && (blogData.blogs.length > 1 || blogData.total > 1) && <Sorting sort={blog_sort ? blog_sort : (sort || '-createdAt')} page={blog_page ? blog_page : +(page || '1')} categoryId={categoryId}/>}
            <div className="show_blogs mt-2">
                {
                    blogData.blogs.map(b => (
                        <CardVert key={b._id} blog={b}/>
                    ))
                }
            </div>

            {
                (blogData.total && isFetching) ? <Loading/> :
                    blogData.total > 1 &&
                    <Pagination
                      total={blogData.total}
                      callback={handlePagination}
                    />
            }

        </div>
    );
};

export default BlogsByCategory;
