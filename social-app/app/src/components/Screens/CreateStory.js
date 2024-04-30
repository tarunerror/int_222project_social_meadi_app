import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaRegImages } from 'react-icons/fa';
import { AiFillCamera } from 'react-icons/ai';
import { navigateToPreviousScreen, setActiveScreen } from '../../store/screenSlice';
import { useDispatch } from 'react-redux';

const CreateStory = () => {
    const dispatch = useDispatch();
    return (
        <div className="flex flex-col h-screen ">
            <div className="px-8 py-24 relative">
                <div className="absolute top-16 left-2 m-2 cursor-pointer">
                    <IoIosArrowRoundBack className="text-5xl" onClick={() => dispatch(navigateToPreviousScreen())} />
                </div>
                <div className="pl-4 mt-8">
                    <div className="border-b-2 border-gray-300 pb-4 mb-4 flex items-center gap-10 text-3xl cursor-pointer" onClick={() => dispatch(setActiveScreen('selectFromGallery'))}>
                        <FaRegImages />
                        <span className="text-2xl">Pick from gallery</span>
                    </div>
                    <div className="flex items-center gap-10 text-3xl cursor-pointer">
                        <AiFillCamera />
                        <span className="text-2xl">Capture with camera</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStory;
