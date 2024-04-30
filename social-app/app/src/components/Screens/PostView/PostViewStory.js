import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, likeStory } from '../../../store/postsSlice';
import { navigateToPreviousScreen } from '../../../store/screenSlice';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaShare } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';

const getDays = (date) => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');
  } else if (minutes < 60) {
    return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
  } else if (hours < 24) {
    return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  } else if (days < 7) {
    return days + (days === 1 ? ' day ago' : ' days ago');
  } else if (weeks < 4) {
    return weeks + (weeks === 1 ? ' week ago' : ' weeks ago');
  } else if (months < 12) {
    return months + (months === 1 ? ' month ago' : ' months ago');
  } else {
    return years + (years === 1 ? ' year ago' : ' years ago');
  }
};

export default function PostViewStory() {
  const dispatch = useDispatch();
  const { story, postId, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPostById(postId));
  }, [dispatch, postId]);

  const [progress, setProgress] = useState(0);
  const creatorName = story?.creator?.name;
  const description = story?.description?.slice(0, 100);

  useEffect(() => {
    if (story && story.image) {
      new Image().src = story.image;
    }
  }, [story]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prevProgress) => prevProgress + 1);
      }
    }, 100);

    if (progress === 100) {
      clearInterval(timer);
      dispatch(navigateToPreviousScreen());
    }

    return () => {
      clearInterval(timer);
    };
  }, [progress, dispatch]);

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-900 relative">
      {loading || !story ? (
        <Skeleton />
      ) : (
        <>
          <img src={story?.image} alt="story" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black opacity-50" />
          <Profile
            story={story}
            creatorName={creatorName}
            description={description}
          />
          <SocialBar story={story} />
          <Progress progress={progress} />
        </>
      )}

      <div className="absolute top-5 left-2 m-2 z-50 cursor-pointer">
        <IoIosArrowRoundBack
          className="text-5xl text-white"
          onClick={() => dispatch(navigateToPreviousScreen())}
        />
      </div>
    </div>
  );
}

const Skeleton = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-900 relative">
      <div className="flex flex-col justify-center min-h-screen bg-gray-900 relative">
        <div className="w-full h-full animate-pulse bg-gray-200" />
        <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black opacity-50" />
        <div className="absolute bottom-0 w-full z-10 flex flex-col items-start justify-between gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-2">
              <span className="text-white text-lg font-semibold bg-gray-200 w-20 h-4 rounded-full" />
              <span className="text-gray-400 text-sm bg-gray-200 w-20 h-4 rounded-full" />
            </div>
          </div>
          <div className="w-10/12">
            <p className="text-white text-sm bg-gray-200 w-full h-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

const Profile = ({ story, creatorName, description }) => {
  const dispatch = useDispatch();

  const handleLikeClick = () => {
    dispatch(likeStory(story?._id));
  };

  return (
    <div className="absolute bottom-0 w-full z-10 flex flex-col items-start justify-between gap-2 px-4 py-2">
      <div className="flex items-center gap-2">
        <img
          src={story?.creator?.image}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
          onDoubleClick={handleLikeClick}
        />
        <div className="flex flex-col">
          <span className="text-white text-lg font-semibold">{creatorName}</span>
          <span className="text-gray-400 text-sm">
            {story?.location} <span className="text-gray-300">{getDays(new Date(story?.date))}</span>
          </span>
        </div>
      </div>
      <div className="w-10/12 pb-2">
        <p className="text-white text-sm">{`${creatorName}. ${description}...`}</p>
      </div>
    </div>
  );
}

const SocialBar = ({ story }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLikeClick = () => {
    dispatch(likeStory(story?._id));
  };

  const handleShareClick = async () => {
    try {
      if (story && story?.image) {
        await navigator.share({
          title: "Check out this story!",
          text: `${story?.creator?.name}. ${story?.description?.slice(0, 100)}...`,
          url: story?.image,
        });
      } else {
        alert("Sharing is not supported on this platform.");
      }
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="absolute right-5 bottom-32 z-10 flex flex-col gap-5 px-4 py-2">
      <div className="flex items-center gap-2">
        {story?.likes?.includes(user?._id) ? (
          <AiFillHeart
            className="text-red-500 text-3xl"
            onClick={handleLikeClick}
          />
        ) : (
          <AiOutlineHeart
            className="text-white text-3xl"
            onClick={handleLikeClick}
          />
        )}
      </div>
      <FaShare className="text-white text-3xl" onClick={handleShareClick} />
    </div>
  );
}

const Progress = ({ progress }) => {
  return (
    <div className="top-0 bg-sky-500 h-1 absolute z-50" style={{ width: `${progress}%` }} />
  );
}