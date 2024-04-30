import { filtersMap } from "./ImageTool";

const FilterOption = ({ name, value, filters, setFilters, image }) => {
  const handleFilterClick = () => {
    setFilters(value);
  };

  const appliedFilter = filtersMap[value];

  return (
    <div className="snap-start flex gap-2 items-center">
      <div className="flex flex-col items-center gap-1">
        <img
          style={{ filter: `${appliedFilter} saturate(100%) brightness(100%) contrast(100%)` }}
          className={`w-20 h-20 rounded-md bg-gray-300 cursor-pointer ${
            filters === value ? 'border-2 border-blue-500' : ''
          }`}
          onClick={handleFilterClick}
          src={image}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm">{name}</span>
          <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default FilterOption;