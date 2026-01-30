const TaskSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3 animate-pulse">
    <div className="h-4 w-40 bg-gray-200 rounded" />
    <div className="h-3 w-56 bg-gray-200 rounded" />
    <div className="h-10 w-full bg-gray-200 rounded" />
  </div>
);

export const SectionSkeleton = ({ count = 2 }: { count?: number }) => (
  <div className="rounded-2xl bg-[#F7FDFF] p-4 space-y-4 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="h-4 w-32 bg-gray-200 rounded" />
      <div className="h-4 w-10 bg-gray-200 rounded-full" />
    </div>

    {Array.from({ length: count }).map((_, i) => (
      <TaskSkeleton key={i} />
    ))}
  </div>
);
