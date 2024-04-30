import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';
import { BsFillTagFill } from 'react-icons/bs';
import { BiSolidCameraPlus } from 'react-icons/bi';
import { MdFastfood } from 'react-icons/md';
import { MdVideogameAsset } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { setActiveScreen, navigateToPreviousScreen } from '../../../store/screenSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../../store/postsSlice';
import { findUsers } from '../../../store/userSlice';
import { fetchUserProfile } from '../../../store/userSlice';
import {MdMovieFilter} from 'react-icons/md';
import{BsEmojiSmileFill, BsEmojiSmile} from 'react-icons/bs';

const vibeTags = [
    { name: 'Photography', icon: <BiSolidCameraPlus className="text-md" /> },
    { name: 'Food Vlogs', icon: <MdFastfood className="text-md" /> },
    { name: 'Gaming', icon: <MdVideogameAsset className="text-md" /> },
    { name: 'Movies', icon: <MdMovieFilter className="text-md" /> },
    { name: 'Travel', icon: <BsEmojiSmileFill className="text-md" /> },
    { name: 'Music', icon: <BsEmojiSmile className="text-md" /> },
];

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function PostCreation() {
    const dispatch = useDispatch()
    const { image, loading, error } = useSelector((state) => state.posts)
    const { users, user } = useSelector((state) => state.auth)
    const [postData, setPostData] = useState({
        description: '',
        isStory: true,
        image: '',
        tags: [],
        location: '',
        vibetags: [],
        likes: [],
    })

    const handlePost = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        const image = document.getElementById('image').src;
        setPostData({ ...postData, [name]: value, image });
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(createPost(postData));
            if (!error) {
                dispatch(setActiveScreen('home'));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm === '') {
            return;
        } else {
            dispatch(findUsers(debouncedSearchTerm));
        }
    }, [debouncedSearchTerm, dispatch]);
    return (

        <div className="h-screen w-full flex flex-col">
            <div className="sticky top-0 z-10 flex justify-between items-center p-4">
                <div className="cursor-pointer" onClick={() => dispatch(navigateToPreviousScreen())}>
                    <IoIosArrowRoundBack className="text-5xl" />
                </div>
                <div className="cursor-pointer bg-blue-500 text-white px-10 py-1 rounded-full" onClick={handlePostSubmit}>
                    <span className="text-md">{loading ? 'Loading...' : 'Post'}</span>
                </div>
            </div>
            <div className='p-4 flex flex-col gap-5'>
                <div>
                    <img
                        src={image}
                        alt="post" className="w-20 h-20 object-cover rounded-xl"
                        id="image"
                    />
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-md font-bold text-blue-500">Description</h1>
                        <textarea className="w-full h-32 border-2 border-gray-300 focus:outline-blue-500 rounded-lg p-2" placeholder="Write a description..." name="description" value={postData.description} onChange={handlePost}></textarea>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-between items-center py-5 border-b-2 border-gray-200">
                            <div className="flex justify-between items-center gap-2 text-blue-500">
                                <BsFillTagFill className="text-md" />
                                <span className="text-md font-bold">Tag People<sup className="text-red-500">{postData.tags.length > 0 && postData.tags.length}</sup></span>
                                <div className="relative flex flex-col justify-between">
                                    <input
                                    type="text"
                                    placeholder="Tag People"
                                    name="tags"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-2 border-gray-300 rounded-lg p-2"
                                     />
                                    <div className="flex flex-col gap-2 absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg">
                                        {searchTerm && users.map((u, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center gap-2 px-3 py-2 rounded-full bg-white text-blue-500 border-2 border-blue-500"
                                                onClick={() => {
                                                    if (u._id === user._id) {
                                                        return;
                                                    }

                                                    if (postData.tags.includes(u._id)) {
                                                        setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== u._id) });
                                                    } else {
                                                        setPostData({ ...postData, tags: [...postData.tags, u._id] });
                                                        setSearchTerm('');
                                                    }
                                                }}
                                            >
                                                {u.username}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                            <MdKeyboardArrowRight className="text-md" />
                        </div>
                        <div className="flex justify-between items-center py-5 border-b-2 border-gray-200">
                            <div className="flex justify-between items-center gap-2 text-blue-500">
                                <IoLocationSharp className="text-md" />
                                <span className="text-md font-bold">Add Location</span>
                                <input type="text" placeholder="Add Location" name="location" value={postData.location} onChange={handlePost} className="border-2 border-gray-300 rounded-lg p-2" />
                            </div>
                            <MdKeyboardArrowRight className="text-2xl " />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between items-center gap-5">
                    <h1 className="text-mc font-bold text-gray-500 self-start">Add your Vibetags</h1>
                    <div className="w-full flex flex-wrap justify-start gap-2">
                        {vibeTags.map((vibetag, index) => (
                            <div
                                key={index}
                                className={`flex justify-between items-center gap-2 px-3 py-2 rounded-full ${postData.vibetags.includes(vibetag.name) ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-2 border-blue-500'}`}
                                onClick={() => {
                                    if (postData.vibetags.includes(vibetag.name)) {
                                        setPostData({ ...postData, vibetags: postData.vibetags.filter((tag) => tag !== vibetag.name) });
                                    } else {
                                        setPostData({ ...postData, vibetags: [...postData.vibetags, vibetag.name] });
                                    }
                                }}
                            >
                                {vibetag.icon}
                                <span
                                    className="text-sm"
                                >{vibetag.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}