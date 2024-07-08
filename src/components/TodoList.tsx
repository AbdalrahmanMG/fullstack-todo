import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  //* handlers
  const onToggleEditModel = () => {
    setIsEditModelOpen((prev) => !prev);
  };

  if (isLoading) return <span>Loading...</span>;

  return (
    <div className="space-y-1 ">
      {data.todos.length ? (
        data.todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
            <p className="w-full font-semibold">1- {todo.title} </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={onToggleEditModel}>
                Edit
              </Button>
              <Button size={"sm"} variant={"danger"}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet</h3>
      )}
      <Modal title="Edit Todo" isOpen={isEditModelOpen} closeModal={onToggleEditModel}>
        <Input />
        <div className="flex items-center space-x-3 mt-4">
          <Button size={"sm"} onClick={onToggleEditModel}>
            Update
          </Button>
          <Button size={"sm"} variant={"cancel"} onClick={onToggleEditModel}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
