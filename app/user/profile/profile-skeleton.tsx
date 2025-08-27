import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSkeletonProps {
  className?: string;
  progress?: number;
  showProgress?: boolean;
}

const ProfileSkeleton = ({ className, progress = 0, showProgress = false }: ProfileSkeletonProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {showProgress && (
        <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full border-2 border-slate-600 dark:border-slate-400 border-t-transparent animate-spin"></div>
                <span className="text-sm font-medium">Loading your profile...</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-400 dark:to-slate-300 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {progress < 30
                  ? "Connecting to server..."
                  : progress < 60
                    ? "Fetching profile data..."
                    : progress < 90
                      ? "Processing information..."
                      : "Almost ready..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-6 w-16 bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-700" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-4 w-full max-w-xs bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileSkeleton;
