const HealthProfileSkeleton = () => {
  return (
    <div className="bg-[#E8F9FF] rounded-3xl shadow-md overflow-hidden animate-pulse">
      {/* Top */}
      <div className="p-5 flex justify-between">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-300 rounded" />
      </div>

      {/* Profile Info */}
      <div className="px-4 flex items-center space-x-4">
        <div className="w-[115px] h-[120px] bg-gray-300 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-300 rounded" />
          <div className="h-4 w-24 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="grid grid-cols-3 bg-[#009FB6] mt-4 py-5 px-10 gap-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 bg-white/40 rounded-full" />
            <div className="h-3 w-16 bg-white/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthProfileSkeleton