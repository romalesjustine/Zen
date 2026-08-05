const PageLoadingBar = ({
  duration,
  isActive,
  isPaused,
  onAnimationEnd,
}: {
  duration: number;
  isActive: boolean;
  setActivePage: (page: number) => void;
  isPaused: boolean;
  onAnimationEnd: () => void;
}) => {
  return (
    <div
      className={`relative h-1 w-full rounded-xl ${isActive ? "bg-gray/50" : "bg-gray/15"} overflow-hidden`}
    >
      <div
        onAnimationEnd={onAnimationEnd}
        style={{
          animation: `${isActive ? `moveProgressBar ${duration}s linear forwards ${isPaused ? "paused" : "running"}` : "none"}`,
        }}
        className={`progress-bar absolute left-[-100%] h-full w-full bg-accent-200`}
      ></div>
    </div>
  );
};

export default PageLoadingBar;
