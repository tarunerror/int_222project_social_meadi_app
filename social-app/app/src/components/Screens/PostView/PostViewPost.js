import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { TbDots } from 'react-icons/tb'
import Header from '../../Header'

export default function PostViewPost() {
    const [posts, setPosts] = useState([
        {
            postid: 123,
            username: 'username1',
            name: 'Arun Kumar',
            location: 'Arunachal Pradesh',
            time: '20 min ago',
            profilePic: 'assets/user.jpg',
            image: 'assets/image1.jpg',
            liked: [
                {
                    username: 'username1',
                    profilePic: 'assets/user1.jpg'
                },
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
        },
        {
            postid: 124,
            username: 'username2',
            name: 'Arun Kumar',
            location: 'Arunachal Pradesh',
            time: '20 min ago',
            profilePic: 'assets/user.jpg',
            image: 'assets/image2.jpg',
            liked: [
                {
                    username: 'username1',
                    profilePic: 'assets/user1.jpg'
                },
                {
                    username: 'username2',
                    profilePic: 'assets/user2.jpg'
                },
                {
                    username: 'username3',
                    profilePic: 'assets/user.jpg'
                },
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
        },
        {
            postid: 125,
            username: 'username3',
            name: 'Arun Kumar',
            location: 'Arunachal Pradesh',
            time: '20 min ago',
            profilePic: 'assets/user.jpg',
            image: 'assets/image3.jpg',
            liked: [
                {
                    username: 'username1',
                    name: 'Arun Kumar',
                    profilePic: 'assets/user1.jpg'
                },
                {
                    username: 'username2',
                    name: 'Arun1 Kumar',
                    profilePic: 'assets/user2.jpg'
                },
                {
                    username: 'username3',
                    name: 'Arun1 Kumar',
                    profilePic: 'assets/user.jpg'
                },
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
        },
    ])

    const [logedInUser, setLoggedInUser] = useState({
        username: 'hero',
        name: 'Hero Kumar',
        profilePic: 'assets/user.jpg'
    })

    const handleLikeClick = (postid) => {
        const newPosts = posts.map((post) => {
            if (post.postid === postid) {
                if (post.liked.find((like) => like.username === logedInUser.username)) {
                    return {
                        ...post,
                        liked: post.liked.filter((like) => like.username !== logedInUser.username)
                    };
                } else {
                    return {
                        ...post,
                        liked: [...post.liked, logedInUser]
                    };
                }
            } else {
                return post;
            }
        });
        setPosts(newPosts);
    };

    return (
        <div className="my-8 px-4 flex flex-col gap-5">
            {posts.map((post) => (
                <Post key={post.postid} post={post} loggedInUser={logedInUser} handleLikeClick={handleLikeClick} />
            ))}
        </div>
    );
}

function LikeButton({ isLiked, onClick }) {
    return (
        <div className="absolute bottom-0 right-0 m-2 cursor-pointer" onClick={onClick}>
            {isLiked ? <AiFillHeart className="text-red-500 text-3xl" /> : <AiOutlineHeart className="text-white text-3xl" />}
        </div>
    );
}

const Post = ({ post, loggedInUser, handleLikeClick }) => {
    const { username, name, location, time, profilePic, image, liked, description } = post;
    return (
        <div className="bg-white rounded-2xl shadow-md flex flex-col gap-2 py-4">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <img src={profilePic} alt="logo" className="w-12 h-12 rounded-full border-4 border-white shadow-md" />
                    <div className="flex flex-col">
                        <span className="text-md font-bold">{username}</span>
                        <p className="text-gray-500">{location} <span className="text-gray-400">{time}</span></p>
                    </div>
                </div>
                <TbDots className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2 relative">
                <div className="w-full h-96">
                    <img src={image} alt="gallery" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <LikeButton isLiked={liked.find(like => like.username === loggedInUser.username)} onClick={() => handleLikeClick(post.postid)} />
            </div>
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    {liked.slice(0, 3).map((like, index) => (
                        <div key={index} className="relative first:ml-0 -ml-7">
                            <img src={like.profilePic} alt="gallery" className="w-12 h-12 object-cover rounded-full border-4 border-white shadow-md" />
                        </div>
                    ))}
                    {liked.length > 0 && <p>{liked[0]?.name} and {liked.length} others emoted</p>}
                </div>
            </div>
            <div className="px-4">
                <p><span>{name}.</span> {description.slice(0, 100)}...</p>
            </div>
        </div>
    );
}