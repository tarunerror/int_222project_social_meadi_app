import React, { useState, useRef } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { setActiveScreen, navigateToPreviousScreen } from '../../store/screenSlice';
import { useDispatch } from 'react-redux';
import { addImage } from '../../store/postsSlice';

const SelectFromGallery = () => {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(0);

    const handleSelect = (index) => {
        setSelected(index);
    };

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch(addImage(e.target.result));
                dispatch(setActiveScreen('imageTool'));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col justify-start">
            <div className="sticky top-0 z-10 flex justify-between items-center p-4">
                <div className="cursor-pointer">
                    <IoIosArrowRoundBack className="text-5xl" onClick={() => dispatch(navigateToPreviousScreen())} />
                </div>
                <div className="cursor-pointer" onClick={() => {
                    dispatch(addImage(`assets/image${selected + 1}.jpg`));
                    dispatch(setActiveScreen('imageTool'));
                }}>
                    <span className="text-2xl">Next</span>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center mx-10">
                <h2 className="text-md font-bold">Select from your gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 my-5">
                    <div className="w-33 md:w-full h-full object-cover rounded-xl cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <input
                        ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="fileInput" className="border-2 border-gray-300 rounded-xl w-full h-full flex justify-center items-center cursor-pointer hover:border-blue-500 hover:text-blue-500">
                            Choose File
                        </label>
                    </div>
                    {
                        Array.from({ length: 7 }, (_, index) => {
                            return (
                                <div key={index} className="w-33 md:w-full h-full object-cover rounded-xl cursor-pointer">
                                    <img
                                        src={`assets/image${index + 1}.jpg`}
                                        alt="gallery"
                                        className={`w-full h-full object-cover rounded-xl cursor-pointer ${
                                            selected === index ? 'border-2 border-blue-500' : ''
                                        }`}
                                        style={{ aspectRatio: '1/1' }}
                                        onClick={() => handleSelect(index)}
                                        onDoubleClick={() => {
                                            dispatch(addImage(`assets/image${index + 1}.jpg`));
                                            dispatch(setActiveScreen('imageTool'));
                                        }}
                                    />

                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default SelectFromGallery;