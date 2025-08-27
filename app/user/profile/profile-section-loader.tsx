import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import type React from "react";

interface ProfileSectionLoaderProps {
  title: string;
  icon?: React.ReactNode;
  fieldCount?: number;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const ProfileSectionLoader = ({
  title,
  icon,
  fieldCount = 3,
  isLoading = false,
  children,
}: ProfileSectionLoaderProps) => {
  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
            {icon}
            <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-700" />
            <LoadingSpinner size="sm" className="ml-auto text-slate-600 dark:text-slate-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: fieldCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full max-w-xs bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 group">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200">
          <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200">
            {icon}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ProfileSectionLoader;
