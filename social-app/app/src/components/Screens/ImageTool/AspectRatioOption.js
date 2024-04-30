const AspectRatioOption = ({ width, height, name, value, aspectRatio, setAspectRatio, image }) => (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-full h-14 rounded-md bg-gray-300 flex justify-center items-center cursor-pointer ${
          aspectRatio === value ? 'border-blue-500' : 'border-gray-500'
        }`}
        style={{ aspectRatio: `${width}/${height}` }}
        onClick={() => setAspectRatio(value)}
      >
        {image && (
          <img src={image} alt="Modified Aspect Ratio" className="w-full h-full object-cover rounded-md" />
        )}
      </div>
      <span className="text-sm whitespace-nowrap">{name}</span>
    </div>
  );
  
  export default AspectRatioOption;
  