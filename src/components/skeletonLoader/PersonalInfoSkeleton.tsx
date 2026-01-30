import { Skeleton } from "../ui/Skeleton";

export const PersonalInfoSkeleton = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      {/* Header */}
      <div className="flex items-center justify-center relative mb-8">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Card Skeleton */}
      {[1, 2, 3, 4].map((_, i) => (
        <div key={i} className="bg-[#F7FDFF] rounded-2xl p-5 space-y-4 mt-6">
          {/* Card header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>

          {/* Inputs */}
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}

      {/* Save Button */}
      <Skeleton className="h-14 w-full rounded-xl mt-4" />
    </div>
  );
};

export default PersonalInfoSkeleton;
