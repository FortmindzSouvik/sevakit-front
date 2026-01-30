const SkeletonCard = ({ size = "mb-6" }: { size?: string }) => {
  return (
    <div className={`bg-[#FFFFFF] px-4 py-3 rounded-3xl ${size} animate-pulse`}>
      <div className="flex items-start justify-between">
        {/* LEFT CONTENT */}
        <div className="flex-1">
          <div className="h-5 w-32 bg-gray-200 rounded-md mb-3" />

          <div className="h-4 w-48 bg-gray-200 rounded-md mb-2" />

          <div className="h-4 w-36 bg-gray-200 rounded-md mb-3" />

          <div className="h-6 w-40 bg-gray-200 rounded-xl mt-3" />
        </div>

        {/* MENU ICON */}
        <div className="ml-4">
          <div className="h-5 w-5 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
export default SkeletonCard;
