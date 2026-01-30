const ProviderSubscriptionSkeleton = () => {
  return (
    <div className="rounded-xl bg-[#F7FDFF] p-4 sm:p-6">
      {/* Top section */}
      <div className="flex flex-col lg:flex-row lg:justify-between border-b pb-4 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 bg-gray-200 rounded" />
          <div className="h-5 w-16 bg-gray-200 rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-64 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-start lg:justify-end">
        <div className="h-9 w-44 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default ProviderSubscriptionSkeleton;
