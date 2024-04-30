import React from 'react';
import { BsPlusSquare, BsFilePlus } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { setActiveScreen, closeActiveScreen } from '../../store/screenSlice';

const AddPost = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-gray-200 h-1/3 px-10 rounded-xl flex flex-col justify-center items-start relative">
        <div className="border-b-2 border-gray-300 pb-4 mb-4 flex items-center gap-5 text-3xl cursor-pointer" onClick={() => dispatch(setActiveScreen('createStory'))}>
          <BsFilePlus/>
          <span className="text-2xl">Create a Story</span>
        </div>
        <div className="flex items-center gap-5 text-3xl cursor-pointer">
          <BsPlusSquare/>
          <span className="text-2xl">Create a Post</span>
        </div>
        <div className="absolute top-2 right-2 m-2 cursor-pointer">
          <AiFillCloseCircle className="text-3xl" onClick={() => dispatch(closeActiveScreen())} />
        </div>
      </div>
    </div>
  );
};

export default AddPost;
