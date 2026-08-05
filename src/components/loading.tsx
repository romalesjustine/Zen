import React from "react";
import LoadingSpinner from "@/components/feedback/loading-spinner";

const RouteLoading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner
        size={96}
        thickness={8}
        label="Loading content..."
        className="text-white"
      />
    </div>
  );
};

export default RouteLoading;
