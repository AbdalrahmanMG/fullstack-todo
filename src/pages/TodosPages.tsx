import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { useState } from "react";

const TodosPages = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [page, setPage] = useState<number>(1);

  const { isLoading, data, isFetching } = useAuthenticatedQuery({
    queryKey: [`todos-page-${page}`],
    url: `/todos?pagination[pageSize]=10&pagination[page]=${page}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  //* handlers
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto ">
        <div className="space-y-1">
          {Array.from({ length: 10 }, (_, idx) => (
            <TodoSkeleton isTodos={true} key={idx} />
          ))}
        </div>
      </div>
    );

  return (
    <section className="max-w-2xl mx-auto">
      <div>
        {data.data.length ? (
          data.data.map(({ id, attributes }: { id: number; attributes: { title: string } }) => (
            <div key={id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
              <p className="w-full font-semibold">
                {id} - {attributes.title}
              </p>
            </div>
          ))
        ) : (
          <h3>No todos yet</h3>
        )}
        <Paginator total={data.meta.pagination.total} isLoading={isLoading || isFetching} page={page} pageCount={data.meta.pagination.pageCount} onClickNext={onClickNext} onClickPrev={onClickPrev} />
      </div>
    </section>
  );
};

export default TodosPages;
