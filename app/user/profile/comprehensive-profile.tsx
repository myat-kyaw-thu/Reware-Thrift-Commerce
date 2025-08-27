"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { getUserInfo } from "@/lib/actions/user.action";
import type { User } from "@/types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  UserIcon,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  createProfileError,
  getRetryDelay,
  logProfileError,
  type ProfileError,
  shouldAutoRetry,
} from "./profile-error-utils";
import ProfileSkeleton from "./profile-skeleton";

interface ComprehensiveProfileProps {
  className?: string;
}

const ComprehensiveProfile = ({ className }: ComprehensiveProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProfileError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fetchUserData = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setLoading(true);
        setLoadingProgress(0);
        // Simulate progressive loading for better UX
        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 15;
          });
        }, 100);

        // Clear interval after a reasonable time
        setTimeout(() => clearInterval(progressInterval), 2000);
      }
      setError(null);

      // Add delay for retries using exponential backoff
      if (isRetry && retryCount > 0) {
        const delay = getRetryDelay(retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const result = await getUserInfo();

      // Complete the progress
      if (!isRetry) {
        setLoadingProgress(100);
      }

      if (result.success && result.data) {
        setUser(result.data as User);
        setRetryCount(0); // Reset retry count on success
        // Trigger fade-in animation after data is loaded
        setTimeout(() => setFadeIn(true), 50);
      } else {
        const errorMessage = result.message || "Failed to load profile data";
        const profileError = createProfileError(errorMessage);
        setError(profileError);

        // Log the error for debugging
        logProfileError(profileError, {
          isRetry,
          retryCount,
          resultSuccess: result.success,
        });

        // Auto-retry if conditions are met
        if (!isRetry && shouldAutoRetry(profileError, retryCount)) {
          setRetryCount((prev) => prev + 1);
          const delay = getRetryDelay(retryCount);
          setTimeout(() => fetchUserData(true), delay);
        }
      }
    } catch (err) {
      const profileError = createProfileError(err);
      setError(profileError);

      // Log the error for debugging
      logProfileError(profileError, {
        isRetry,
        retryCount,
        errorType: "exception",
      });

      // Auto-retry if conditions are met
      if (!isRetry && shouldAutoRetry(profileError, retryCount)) {
        setRetryCount((prev) => prev + 1);
        const delay = getRetryDelay(retryCount);
        setTimeout(() => fetchUserData(true), delay);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchUserData(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Not provided";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBoolean = (value: boolean, trueText = "Yes", falseText = "No") => {
    return value ? trueText : falseText;
  };

  const renderField = (label: string, value: string | number | null | undefined, icon?: React.ReactNode) => {
    const displayValue = value || "Not provided";

    return (
      <div className="flex items-center gap-4 py-3 px-1 rounded-lg transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
        {icon && <div className="text-slate-500 dark:text-slate-400 flex-shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">{label}</span>
          <p className="text-sm text-slate-900 dark:text-slate-100 truncate">{displayValue}</p>
        </div>
      </div>
    );
  };

  const renderSocialLink = (platform: string, url: string | null) => {
    if (!url) return null;

    return (
      <div className="flex items-center gap-3 py-2 px-1 rounded-lg transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
        <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-0 flex-shrink-0">
          {platform}:
        </span>
        <a
          href={url.startsWith("http") ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 truncate"
        >
          {url}
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <ProfileSkeleton progress={loadingProgress} showProgress={true} />
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 ease-in-out">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <LoadingSpinner size="sm" className="text-slate-600 dark:text-slate-300" />
              <div>
                <p className="font-medium">Retrying...</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Attempting to reload your profile (Attempt {retryCount + 1})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <ProfileSkeleton className="opacity-50" />
      </div>
    );
  }

  const renderErrorFallback = () => {
    if (!error) return null;

    const getErrorIcon = () => {
      switch (error.type) {
        case "network":
          return <WifiOff className="h-5 w-5" />;
        case "authentication":
          return <XCircle className="h-5 w-5" />;
        case "server":
          return <AlertTriangle className="h-5 w-5" />;
        default:
          return <XCircle className="h-5 w-5" />;
      }
    };

    const getErrorTitle = () => {
      switch (error.type) {
        case "network":
          return "Connection Problem";
        case "authentication":
          return "Authentication Required";
        case "server":
          return "Server Error";
        default:
          return "Error Loading Profile";
      }
    };

    return (
      <div className={`space-y-6 transition-all duration-500 ease-in-out ${className}`}>
        <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-red-600 dark:text-red-400 mt-0.5">{getErrorIcon()}</div>
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-300">{getErrorTitle()}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error.userFriendlyMessage}</p>

                {error.suggestedAction && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{error.suggestedAction}</p>
                )}

                {error.retryable && (
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      variant="outline"
                      size="sm"
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 bg-transparent"
                    >
                      {isRetrying ? (
                        <LoadingSpinner size="sm" text="Retrying..." className="text-red-600 dark:text-red-400" />
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 transition-transform duration-200" />
                          Try Again
                        </>
                      )}
                    </Button>
                    {retryCount > 0 && (
                      <span className="text-xs text-slate-600 dark:text-slate-400">Attempt {retryCount + 1}</span>
                    )}
                  </div>
                )}

                {error.type === "authentication" && (
                  <div className="mt-4">
                    <Button
                      onClick={() => (window.location.href = "/sign-in")}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <BasicProfileFallback />
      </div>
    );
  };

  const BasicProfileFallback = () => (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5" />
          Limited Profile View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
          We're unable to load your complete profile at the moment. Here's what we can show you:
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Basic profile information is temporarily unavailable
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Please check your connection and try refreshing the page
            </span>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return renderErrorFallback();
  }

  if (!user) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-slate-600 dark:text-slate-400">No profile data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 transition-all duration-500 ease-in-out ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profile Overview</h2>
          {(loading || isRetrying) && <LoadingSpinner size="sm" className="text-slate-600 dark:text-slate-400" />}
        </div>
        <div className="flex items-center gap-2">
          {user.isVerified && (
            <Badge
              variant="secondary"
              className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700 transition-all duration-200 animate-in slide-in-from-right-2"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          <Badge
            variant={user.isActive ? "default" : "destructive"}
            className={`transition-all duration-200 animate-in slide-in-from-right-2 ${user.isActive
              ? "bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900"
              : "bg-red-600 dark:bg-red-700 text-white"
              }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <Card
        className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 animate-in slide-in-from-left-4"
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <UserIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {renderField("Full Name", user.name, <UserIcon className="h-4 w-4" />)}
          {renderField("First Name", user.firstName)}
          {renderField("Last Name", user.lastName)}
          {renderField("Email", user.email, <Mail className="h-4 w-4" />)}
          {renderField("Phone", user.phone, <Phone className="h-4 w-4" />)}
          {renderField("Gender", user.gender)}
          {renderField("Date of Birth", formatDate(user.dateOfBirth), <Calendar className="h-4 w-4" />)}
          {user.bio && (
            <div className="py-3 px-1">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">Bio:</span>
              <p className="text-sm mt-1 p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700">
                {user.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card
        className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 animate-in slide-in-from-left-4"
        style={{ animationDelay: "200ms" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {renderField("Country", user.country)}
          {renderField("State/Province", user.state)}
          {renderField("City", user.city)}
          {renderField("Zip Code", user.zipCode)}
        </CardContent>
      </Card>

      {(user.website || user.linkedIn || user.twitter || user.instagram || user.facebook) && (
        <Card
          className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 animate-in slide-in-from-left-4"
          style={{ animationDelay: "300ms" }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              Social Media & Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {renderSocialLink("Website", user.website)}
            {renderSocialLink("LinkedIn", user.linkedIn)}
            {renderSocialLink("Twitter", user.twitter)}
            {renderSocialLink("Instagram", user.instagram)}
            {renderSocialLink("Facebook", user.facebook)}
          </CardContent>
        </Card>
      )}

      {(user.occupation || user.company) && (
        <Card
          className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 animate-in slide-in-from-left-4"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-900 dark:text-slate-100">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {renderField("Occupation", user.occupation)}
            {renderField("Company", user.company)}
          </CardContent>
        </Card>
      )}

      <Card
        className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 animate-in slide-in-from-left-4"
        style={{ animationDelay: "500ms" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-900 dark:text-slate-100">Preferences & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {renderField("Newsletter Subscription", formatBoolean(user.newsletter, "Subscribed", "Not Subscribed"))}
          {renderField("SMS Updates", formatBoolean(user.smsUpdates, "Enabled", "Disabled"))}
          {renderField("Language", user.language)}
          {renderField("Timezone", user.timezone)}
          {renderField("Currency", user.currency)}
        </CardContent>
      </Card>

      <Card
        className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 animate-in slide-in-from-left-4"
        style={{ animationDelay: "600ms" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {renderField("Account Status", user.isActive ? "Active" : "Inactive")}
          {renderField("Verification Status", user.isVerified ? "Verified" : "Not Verified")}
          {renderField("Profile Views", user.profileViews.toString())}
          {renderField("Last Login", formatDate(user.lastLoginAt))}
          <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />
          {renderField("Member Since", formatDate(user.createdAt))}
          {renderField("Last Updated", formatDate(user.updatedAt))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveProfile;
