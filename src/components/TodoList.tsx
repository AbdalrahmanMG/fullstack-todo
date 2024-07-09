import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";
import { ITodo } from "../interfaces";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = () => {
  const defaultTodo = {
    id: 0,
    title: "",
    description: "",
  };

  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [istodoEditLoading, setIstodoEditLoading] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(defaultTodo);
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  //* handlers
  const onOpenEditModel = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModelOpen(true);
  };
  const onCloseEditModel = () => {
    setTodoToEdit(defaultTodo);
    setIsEditModelOpen(false);
  };

  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };
  const closeConfirmModal = () => {
    setTodoToEdit(defaultTodo);
    setIsOpenConfirmModal(false);
  };

  const openAddModal = () => setIsOpenAddModal(true);

  // const closeAddModal = (event: React.FormEvent<HTMLFormElement>) => {
  const closeAddModal = () => {
    // event.preventDefault()
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModal(false);
  };

  const changeAddHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };
  const submitAddHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIstodoEditLoading(true);
    try {
      const { title, description } = todoToAdd;
      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        closeAddModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIstodoEditLoading(false);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIstodoEditLoading(true);
    try {
      const { title, description } = todoToEdit;
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseEditModel();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIstodoEditLoading(false);
    }

    console.log(todoToEdit);
  };

  const handleRemove = async () => {
    setIstodoEditLoading(true);
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        closeConfirmModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIstodoEditLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-1 ">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="space-y-1">
      <div className="flex justify-center pb-4">
        <Button size={"sm"} onClick={openAddModal}>
          Add New Todo
        </Button>
      </div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
            <p className="w-full font-semibold">{todo.id} - {todo.title} </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModel(todo)}>
                Edit
              </Button>
              <Button size={"sm"} variant={"danger"} onClick={() => openConfirmModal(todo)}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet</h3>
      )}

      <Modal title="Add New Todo" isOpen={isOpenAddModal} closeModal={closeAddModal}>
        <form onSubmit={submitAddHandler} className="space-y-3">
          <Input name="title" value={todoToAdd.title} onChange={changeAddHandler} />
          <Textarea name="description" value={todoToAdd.description} onChange={changeAddHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button size={"sm"} isLoading={istodoEditLoading}>
              Done
            </Button>
            <Button size={"sm"} variant={"cancel"} onClick={closeAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal title="Edit Todo" isOpen={isEditModelOpen} closeModal={onCloseEditModel}>
        <form onSubmit={submitHandler} className="space-y-3">
          <Input name="title" value={todoToEdit.title} onChange={changeHandler} />
          <Textarea name="description" value={todoToEdit.description} onChange={changeHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button size={"sm"} isLoading={istodoEditLoading}>
              Update
            </Button>
            <Button size={"sm"} variant={"cancel"} onClick={onCloseEditModel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Are you sure you want to remove this Todo from your Todos?"
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        description="Deleting this todo will remove it permanentaly from your todos list. Please make sure this is the intended action "
      >
        <div className="flex items-center space-x-3 mt-3">
          <Button variant={"danger"} onClick={handleRemove} isLoading={istodoEditLoading}>
            Yes, remove
          </Button>
          <Button variant={"cancel"} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
