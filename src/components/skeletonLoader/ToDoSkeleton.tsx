const TodoSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-[#F7FDFF] p-4 space-y-4">
          {/* Category header */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
          </div>

          {/* Task card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-3 w-60 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TodoSkeleton