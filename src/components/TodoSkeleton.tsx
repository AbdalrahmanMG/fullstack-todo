const TodoSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3 rounded-md">
        <div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="flex items-center justify-end w-full space-x-3">
        <div className="h-9 w-14 bg-gray-300 rounded-md dark:bg-gray-700"></div>
        <div className="h-9 w-20 bg-gray-300 rounded-md dark:bg-gray-700"></div>
        </div>
    </div>
  );
};

export default TodoSkeleton;
