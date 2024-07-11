import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ChangeEvent, useState } from "react";

const TodosPages = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortedBy, setSortedBy] = useState<string>("DESC");

  const { isLoading, data, isFetching } = useAuthenticatedQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortedBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortedBy}`,
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

  const changePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const changeSortedBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortedBy(e.target.value);
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
      <div className="flex mb-3 items-center justify-end space-x-2 text-md">
        <select className="border-2 border-indigo-600 rounded-md p-2" value={sortedBy} onChange={changeSortedBy}>
          <option disabled>Sort by</option>
          <option value="ASC">Oldest</option>
          <option value="DESC">Latest</option>
        </select>
        <select className="border-2 border-indigo-600 rounded-md p-2" value={pageSize} onChange={changePageSize}>
          <option disabled>Page size</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
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
    </section>
  );
};

export default TodosPages;
