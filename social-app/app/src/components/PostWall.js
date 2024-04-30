import React, { useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveScreen } from '../store/screenSlice';
import { fetchPosts } from '../store/postsSlice';
import { likePost } from '../store/postsSlice';
import { setPostId } from '../store/postsSlice';
import { logoutUser } from '../store/userSlice';
import {AiOutlineLogout} from 'react-icons/ai';

export default function PostWall() {
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector((state) => state.posts);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    if (loading || !posts) {
        return (
            <div className="my-8 px-2 min-h-screen">
                <div className="grid group-cols-2 md:grid-cols-2 gap-2">
                    {Array.from({ length: 7 }, (_, index) => {
                        return (
                            <div key={index} className="relative">
                                <div className="h-72 w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (posts.length === 0 && !loading) {
        return <div className="px-2 min-h-screen flex justify-center items-center">No posts to display</div>;
    }

    return (
        <div className="my-8 px-2 min-h-screen">
            <div className="grid group-cols-2 md:grid-cols-2 gap-2">
                {
                   posts.length > 0 && posts?.map((post, index) => {
                        return (
                            <div key={index} className="relative">
                                <img
                                    src={post.image}
                                    alt="gallery"
                                    className="w-full h-full object-cover rounded-2xl"
                                    onClick={() => {
                                        dispatch(setActiveScreen('postViewStory'));
                                        dispatch(setPostId(post._id));
                                    }}
                                    onDoubleClick={() => dispatch(likePost(post._id))}
                                />
                                <div className="absolute bottom-0 right-0 m-1 cursor-pointer" >
                                    {post.likes.includes(user._id) ? (
                                        <AiFillHeart className="text-red-500 text-3xl" onClick={() => dispatch(likePost(post._id))} />
                                    ) : (
                                        <AiOutlineHeart className="text-white text-3xl" onClick={() => dispatch(likePost(post._id))} />
                                    )}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}