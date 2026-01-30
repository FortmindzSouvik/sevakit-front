const SubscriptionSkeleton = () => {
  return (
    <div className="bg-[#F5FCFF] p-5 rounded-2xl animate-pulse">
      <div className="bg-white rounded-2xl p-4 space-y-3">
        <div className="h-6 w-30 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-52 bg-gray-200 rounded" />
        <div className="h-3 w-64 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
