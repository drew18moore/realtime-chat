const ConverasationSkeleton = () => {
  return (
    <div className="p-3 rounded-xl flex gap-3 items-center">
      <div className="bg-neutral-400 w-14 h-14 rounded-full animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="bg-neutral-400 h-4 w-28 rounded-full animate-pulse" />
        <div className="bg-neutral-400 h-3 w-36 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default ConverasationSkeleton;
