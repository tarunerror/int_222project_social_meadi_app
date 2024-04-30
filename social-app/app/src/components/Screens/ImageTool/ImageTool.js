import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import FilterOption from './FilterOption';
import AspectRatioOption from './AspectRatioOption';
import { setActiveScreen, navigateToPreviousScreen } from '../../../store/screenSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addImage } from '../../../store/postsSlice';

export const filtersMap = {
    'none': 'none',
    'b&w': 'grayscale(100%)',
    'retro': 'sepia(100%)',
    'vivid': 'brightness(150%) contrast(120%)',
    'sepia': 'sepia(80%)',
    'hue-rotate': 'hue-rotate(90deg)',
};

const aspectRatioList = [
    { name: '1:1', value: '1:1', width: 10, height: 10 },
    { name: '4:5', value: '4:5', width: 10, height: 12 },
    { name: '16:9', value: '16:9', width: 16, height: 10 },
];

const ImageTool = () => {
    const dispatch = useDispatch();
    const { image } = useSelector((state) => state.posts);
    const [modifiedImage, setModifiedImage] = useState(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [filters, setFilters] = useState('none');
    const [saturation, setSaturation] = useState(100);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);

    const applyFilters = () => {
        return `${filtersMap[filters]} saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`;
    };

    useEffect(() => {
        const handleImage = () => {
            const img = new Image();
            img.onload = () => {
                const inputWidth = img.naturalWidth;
                const inputHeight = img.naturalHeight;
                const inputAspectRatio = inputWidth / inputHeight;
                const [aspectWidth, aspectHeight] = aspectRatio.split(':');
                const numericAspectRatio = aspectWidth / aspectHeight;

                let outputWidth = inputWidth;
                let outputHeight = inputHeight;
                if (inputAspectRatio > numericAspectRatio) {
                    outputWidth = inputHeight * numericAspectRatio;
                } else if (inputAspectRatio < numericAspectRatio) {
                    outputHeight = inputWidth / numericAspectRatio;
                }
                const outputX = (outputWidth - inputWidth) * 0.5;
                const outputY = (outputHeight - inputHeight) * 0.5;

                const canvas = document.createElement('canvas');
                canvas.width = outputWidth;
                canvas.height = outputHeight;
                const ctx = canvas.getContext('2d');
                ctx.filter = applyFilters();

                ctx.drawImage(img, outputX, outputY);
                setModifiedImage(canvas.toDataURL());
            };
            img.src = image;
        };

        handleImage();
    }, [image, filters, aspectRatio, saturation, brightness, contrast]);



    const handleNextClick = () => {
        dispatch(setActiveScreen('post'));
        dispatch(addImage(modifiedImage));
    };

    const handleResetClick = () => {
        setFilters('none');
        setSaturation(100);
        setBrightness(100);
        setContrast(100);
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-between">
            <div className="sticky top-0 z-10 flex justify-between items-center p-4">
                <div className="cursor-pointer" onClick={() => dispatch(navigateToPreviousScreen())}>
                    <IoIosArrowRoundBack className="text-5xl" />
                </div>
                <div className="cursor-pointer" onClick={handleNextClick}>
                    <span className="text-2xl">Next</span>
                </div>
            </div>
            <div className="w-1/2 mx-auto my-5 relative" style={{ aspectRatio: aspectRatio }}>
                <img
                    src={modifiedImage || image}
                    alt="gallery"
                    className="w-full h-full object-fit rounded-xl"
                    onDoubleClick={() => {
                        dispatch(addImage(modifiedImage));
                        dispatch(setActiveScreen('selectFromGallery'));
                    }}
                />
            </div>
            <div className="flex flex-col">
                <span className="text-md font-bold self-center">Aspect Ratio</span>
                <div className="flex justify-center items-end gap-5 px-4 py-4">
                    {aspectRatioList.map((aspect) => (
                        <AspectRatioOption
                            key={aspect.value}
                            name={aspect.name}
                            value={aspect.value}
                            width={aspect.width}
                            height={aspect.height}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                            image={modifiedImage || image}
                        />
                    ))}
                </div>
                <div className="text-md font-bold px-4">Filters</div>
                <div className="overflow-x-scroll scroll-pl-[10%] snap-x py-4 flex gap-4 px-4 scrollbar-hide">
                    {Object.keys(filtersMap).map((filter, index) => (
                        <FilterOption
                            key={index}
                            name={filter}
                            value={filter}
                            filters={filters}
                            setFilters={setFilters}
                            image={image}
                        />
                    ))}
                </div>
                {/* <div className="flex flex-col gap-4 px-4 py-4">
                    <div className="text-md font-bold px-4">Saturation</div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(e.target.value)}
                        className="px-4"
                    />
                    <div className="text-md font-bold px-4">Brightness</div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(e.target.value)}
                        className="px-4"
                    />
                    <div className="text-md font-bold px-4">Contrast</div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={contrast}
                        onChange={(e) => setContrast(e.target.value)}
                        className="px-4"
                    />
                </div> */}
                <div className="grid grid-cols-2 gap-4 items-center px-4 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="text-md font-bold">Saturation</div>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={saturation}
                            onChange={(e) => setSaturation(e.target.value)}
                            className="px-4"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-md font-bold">Brightness</div>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={brightness}
                            onChange={(e) => setBrightness(e.target.value)}
                            className="px-4"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-md font-bold">Contrast</div>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={contrast}
                            onChange={(e) => setContrast(e.target.value)}
                            className="px-4"
                        />
                    </div>
                    <div onClick={handleResetClick} className="flex justify-center items-center gap-2 px-4 py-2 rounded-full bg-white text-red-500 border-2 border-red-500 cursor-pointer">
                        <span className="text-md font-bold text-red-500">Reset</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageTool;