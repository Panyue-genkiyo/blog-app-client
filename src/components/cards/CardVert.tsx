import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { IBlog } from "../../types/Typescript";
import { Heart,  Bookmark  } from 'tabler-icons-react';
import { Button } from '@mantine/core';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setThumbnail} from "../../features/picFile";
import {setAlert} from "../../features/alert";

interface IProps{
    blog: IBlog,
    isEdit?: boolean,
    isCreated?: boolean,
    setBlog?: (blog: IBlog) => void,
}

const CardVert: React.FC<IProps> = ( {blog, isEdit, isCreated, setBlog} ) => {
    const { theme, auth, pic } = useAppSelector(state => state);
    const url = blog.thumbnail;
    const dispatch = useAppDispatch();
    const [next, setNext] = useState(true);
    const [initThumbnail, setInitThumbnail] =  useState('');

    useEffect(() => {
        if((isEdit || isCreated) && pic.thumbnail.url && pic.thumbnail.default !== undefined && next){
            setInitThumbnail(pic.thumbnail.url);
            if(isEdit && !pic.thumbnail.default){
                return setNext(false);
            }
            if(isCreated && pic.thumbnail.default){
                return setNext(false);
            }
        }
    }, [isEdit, isCreated, pic.thumbnail.url, pic.thumbnail.default, next])

    const handelCancelTB = () => {
        if(blog.thumbnail){
            setBlog && setBlog({
                ...blog,
                thumbnail: initThumbnail ? initThumbnail : undefined,
            })
            dispatch(setThumbnail({
                file: null,
                url: (isCreated || isEdit) ? initThumbnail : null,
            }))
        }
    }

    const handelResetTB = () => {
            dispatch(setAlert({
                isModalOpen: true,
                isCircle: false,
                isProfileThumbnail: false,
                modalTitle: '裁剪主页博客预览照片',
                imageUrl:  pic.thumbnail.url ? pic.thumbnail.url : blog.thumbnail,
                picType: 'thumbnail'
            }))
        }

    return (
        <>
            {
                ((isEdit || isCreated ) && initThumbnail !== blog.thumbnail && blog.thumbnail) && (
                    <div>
                        <Button variant="gradient" onClick={handelCancelTB} style={{ marginBottom: '.2rem' }} gradient={{ from: 'teal', to: 'blue', deg: 60 }}>重置</Button>
                    </div>
                )
            }
            <div className={`card ${theme && 'card-night'} card-personal`}>
                {
                    url ? (
                            typeof(url) === 'string' ? (
                                    (isCreated || isEdit) ? (
                                            <img src={url} className='card-img-top' alt="..."
                                                 style={{ height: '180px', objectFit: "cover", cursor: 'pointer' }}
                                                 onClick={handelResetTB}
                                            />
                                        ) :
                                        <Link to={`/blog/${blog._id}`}>
                                            <img src={url} className='card-img-top' alt="..."
                                                 style={{ height: '180px', objectFit: "cover" }}/>
                                        </Link>
                                )
                                :
                                (
                                    (isCreated || isEdit) ? (
                                            <img src={URL.createObjectURL(url)} className='card-img-top' alt="..."
                                                 style={{ height: '180px', objectFit: "cover", cursor: 'pointer' }}
                                                 onClick={handelResetTB}
                                            />
                                        ) :
                                        <Link to={`/blog/${blog._id}`}>
                                            <img src={URL.createObjectURL(url)} className='card-img-top' alt="..."
                                                 style={{ height: '180px', objectFit: "cover" }}
                                            />
                                        </Link>
                                )

                        ):
                        (
                            isCreated && (
                                <img src={'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                                     className='card-img-top'
                                     alt="..."
                                     onClick={handelResetTB}
                                     style={{ height: '180px', objectFit: "cover",cursor: 'pointer' }}/>
                            )
                        )
                }
                <div className="card-body">
                        {
                            (isCreated || isEdit) ?
                               <h5 style={{ color: "#0d6efd" }} className='card-title'>{blog.title.slice(0, 50) + `${(!isEdit && !isCreated) ? `...` : ''}`}</h5>:
                                (
                                    <h5 className='card-title'>
                                        <Link to={`/blog/${blog._id}`}
                                              style={{ textDecoration: 'none', textTransform: 'capitalize' }}
                                        >
                                            {blog.title.slice(0, 50) + `${(!isEdit && !isCreated) ? `...` : ''}`}
                                        </Link>
                                    </h5>
                              )
                        }
                    <p className="card-text">
                        {blog.description.slice(0, 100) + `${(!isEdit && !isCreated) ? `...` : ''}`}
                    </p>
                    <p className="card-text d-flex justify-content-between">
                        <small className='text-muted text-capitalize'>
                            {
                                typeof (blog.user) !== 'string' &&
                                (
                                    (isEdit || isCreated) ?  <>By: {blog.user.name}</> :   <Link to={`/profile/${blog.user._id}`} style={{ textDecoration: 'none', textTransform: 'capitalize' }}
                                    >
                                        By: {blog.user.name}
                                    </Link>
                                )
                            }
                        </small>
                        {(!isEdit && !isCreated) && <small className='text-muted'>
                            {new Date(blog.createdAt).toLocaleString()}
                        </small>}
                    </p>
                    {
                        (!isEdit && !isCreated) && (
                            <div className={'d-flex justify-content-between'}>
                                <div>
                                    <Heart color={'red'}/>
                                    <span>{blog.likesLength}</span>
                                    <Bookmark color={'skyblue'}/>
                                    <span>{blog.savedLength}</span>
                                </div>
                                <div>
                                    { auth.user?._id === (typeof blog.user === "string" ? blog.user : blog.user._id)
                                        && (
                                            <Link to={`/update_blog/${blog._id}`}>
                                                <i className="fas fa-edit" title="edit" />
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default CardVert;
