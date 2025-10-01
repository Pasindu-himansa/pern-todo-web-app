import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
  const [tab, setTab] = useState(1);
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");

  const handleTabs = (tab) => {
    setTab(tab);
  };

  const fetchTask = () => {
    axios.get("http://localhost:5000/read-tasks").then((res) => {
      setTodos(res.data);
    });
  };

  const addTask = (e) => {
    e.preventDefault();

    if (task && task.trim().length !== 0) {
      axios.post("http://localhost:5000/new-task", { task }).then((res) => {
        setTodos(res.data);
        setTask("");
      });
    }
  };

  const updateTask = () => {
    axios.post("http://localhost:5000/update-task", { updateId, updatedTask }).then((res) => {
      setTodos(res.data);
      setUpdatedTask("");
    });
  };

  const handleDelete = (id) => {
    axios.post("http://localhost:5000/delete-task", { id }).then((res) => {
      setTodos(res.data);
    });
  };

  const handleEditTask = (id, task) => {
    setIsEdit(true);
    setUpdatedTask(task);
    setUpdateId(id);
  };

  const handleComplete = (id) => {
    axios.post("http://localhost:5000/complete-task", { id }).then(() => {
      fetchTask();
    });
  };

  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <div className="bg-gray-300 w-screen h-screen text-center">
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <div>
          <h2 className=" font-bold text-4xl mb-4"> Todo List</h2>
        </div>
        <div className="flex gap-3">
          <input
            value={isEdit ? updatedTask : task}
            onChange={(e) => (isEdit ? setUpdatedTask(e.target.value) : setTask(e.target.value))}
            type="text"
            placeholder="Enter todo"
            className="w-80 p-2 outline-none border border-blue-300 rounded-md"
          />

          {isEdit ? (
            <button
              onClick={updateTask}
              className="bg-blue-600 text-white px-4 rounded-md cursor-pointer"
            >
              Update
            </button>
          ) : (
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-4 rounded-md cursor-pointer"
            >
              Add
            </button>
          )}
        </div>

        <div className="flex text-sm w-80 justify-evenly mt-4">
          <p
            onClick={() => handleTabs(1)}
            className={`${tab === 1 ? "text-blue-700" : "text-black"} cursor-pointer outline-none focus:outline-none select-none`}
          >
            All
          </p>
          <p
            onClick={() => handleTabs(2)}
            className={`${tab === 2 ? "text-blue-700" : "text-black"} cursor-pointer outline-none focus:outline-none select-none`}
          >
            Active
          </p>
          <p
            onClick={() => handleTabs(3)}
            className={`${tab === 3 ? "text-blue-700" : "text-black"} cursor-pointer outline-none focus:outline-none select-none`}
          >
            Completed
          </p>
        </div>

        {tab == 1 &&
          todos?.map((todo) => (
            <div className="flex justify-between bg-white p-3 w-80 mt-3 rounded-md">
              <div>
                <p className="text-lg font-semibold ">{todo.task}</p>
                <p className="text-xs text text-gray-600 ">
                  {new Date(todo.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">Status : {todo.status}</p>
              </div>
              <div className="flex flex-col text-sm justify-start items-start">
                <button
                  className="text-orange-400 cursor-pointer"
                  onClick={() => handleEditTask(todo.id, todo.task)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
                <button className="text-green-600" onClick={() => handleComplete(todo.id)}>
                  Completed
                </button>
              </div>
            </div>
          ))}

        {tab == 2 &&
          todos
            ?.filter((todo) => todo.status == "active")
            .map((todo) => (
              <div className="flex justify-between bg-white p-3 w-80 mt-3 rounded-md">
                <div>
                  <p className="text-lg font-semibold ">{todo.task}</p>
                  <p className="text-xs text text-gray-600 ">
                    {new Date(todo.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">Status : {todo.status}</p>
                </div>
                <div className="flex flex-col text-sm justify-start items-start">
                  <button
                    className="text-orange-400 cursor-pointer"
                    onClick={() => handleEditTask(todo.id, todo.task)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                  <button className="text-green-600" onClick={() => handleComplete(todo.id)}>
                    Completed
                  </button>
                </div>
              </div>
            ))}

        {tab == 3 &&
          todos
            ?.filter((todo) => todo.status == "completed")
            .map((todo) => (
              <div className="flex justify-between bg-white p-3 w-80 mt-3 rounded-md">
                <div>
                  <p className="text-lg font-semibold ">{todo.task}</p>
                  <p className="text-xs text text-gray-600 ">
                    {new Date(todo.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">Status : {todo.status}</p>
                </div>
                <div className="flex flex-col text-sm justify-center items-start">
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Home;
