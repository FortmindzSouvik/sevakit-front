const PrivacySettingsSkeleton = () => {
  return (
    <div className="bg-[#F5FCFF] p-5 rounded-2xl animate-pulse">
      {/* PROFILE PUBLIC SKELETON */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-300 rounded-md" />
          <div className="h-4 w-64 bg-gray-200 rounded-md" />
        </div>
        <div className="h-6 w-12 bg-gray-300 rounded-full" />
      </div>

      {/* SETTINGS LIST SKELETON */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 mt-3 flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-300 rounded-md" />
            <div className="h-3 w-64 bg-gray-200 rounded-md" />
          </div>

          <div className="h-6 w-12 bg-gray-300 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default PrivacySettingsSkeleton;
