const ProviderInfoSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      {/* LEFT SIDE */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
        {/* Avatar */}
        <div className="h-20 w-20 rounded-lg bg-gray-200" />

        {/* Info */}
        <div className="w-full">
          {/* Title */}
          <div className="h-5 w-48 bg-gray-200 rounded mb-4" />

          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-4 text-sm">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="w-full sm:w-[45%] lg:w-48">
                <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-full bg-gray-300 rounded" />
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="mt-4">
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-full sm:w-2/3 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* RIGHT ACTION */}
      <div className="h-4 w-40 bg-gray-200 rounded mt-2 lg:mt-0" />
    </div>
  );
};

export default ProviderInfoSkeleton;
