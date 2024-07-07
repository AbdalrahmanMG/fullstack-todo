import { useEffect, useState } from "react";
import Button from "./ui/Button";
import axiosInstance from "../config/axios.config";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  useEffect(() => {
    try {
      axiosInstance
        .get("/users/me?populate=todos", {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        })
        .then((res) => {
          setTodos(res.data.todos);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }, [userData.jwt]);

  if (isloading) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1 ">
      {todos.length ? (
        todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
            <p className="w-full font-semibold">1- {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"}>Edit</Button>
              <Button size={"sm"} variant={"danger"}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet</h3>
      )}
    </div>
  );
};

export default TodoList;
