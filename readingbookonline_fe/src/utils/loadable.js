import React, {
  lazy,
  Suspense,
  startTransition,
  useState,
  useEffect,
} from "react";

const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc);

  return function LoadableComponent(props) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      startTransition(() => {
        setIsClient(true);
      });
    }, []);

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
        {isClient ? <LazyComponent {...props} /> : null}
      </Suspense>
    );
  };
};

export default loadable;
