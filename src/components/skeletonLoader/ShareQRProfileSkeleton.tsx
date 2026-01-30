const ShareQRProfileSkeleton = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 font-mona animate-pulse">
      {/* Header */}
      {/* <div className="flex items-center justify-center relative mb-8">
        <div className="absolute left-0 h-6 w-6 bg-gray-300 rounded-full" />
        <div className="h-4 w-28 bg-gray-300 rounded" />
      </div> */}

      {/* QR Card */}
      <div className=" rounded-3xl p-3">
        <div className="bg-gray-300 h-64 rounded-3xl" />
        {/* <div className="flex justify-center py-4">
          <div className="h-4 w-40 bg-white/40 rounded" />
        </div> */}
      </div>

      {/* URL box */}
      <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-0.5 bg-gray-200" />
        <div className="h-3 w-6 bg-gray-200 rounded" />
        <div className="flex-1 h-0.5 bg-gray-200" />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-8">
        <div className="h-12 w-32 bg-gray-300 rounded-xl" />
        <div className="h-12 w-32 bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
};

export default ShareQRProfileSkeleton
