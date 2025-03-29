import React, { lazy, Suspense } from "react";

const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc);

  return function LoadableComponent(props) {
    // Return a proper component
    return (
      <Suspense
        fallback={
          fallback || (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
            </div>
          )
        }
      >
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

export default loadable;
