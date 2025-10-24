import { useState } from "react";
import { useEffect } from "react";
import TodoItem from "./Components/TodoItem";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const [inputtedTodoList, updateTodo] = useState([]);
  const [inputValue, updateValue] = useState("");
  const [removeMessage, updateRemoveMessage] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      const options = {
        method: "GET",
      };

      const getResponse = await fetch("https://todo-n5dn.vercel.app/todos", options); 
      const actualResponse = await getResponse.json();
      updateTodo(actualResponse);
    };
    getTodos();
  }, []);

  const onEnter = (event) => {
    updateValue(event.target.value);
  };

  const updateTodoList = (arrList) => {
    updateTodo(arrList);
  };

  const clearInput = () => {
    updateValue("");
  };

  const deleteTodo = (id) => {
    const filteredList = inputtedTodoList.filter(
      (eachitem) => eachitem.id !== id
    );
    updateTodo([...filteredList]);

    updateRemoveMessage("Todo deleted Successfully");
    setTimeout(() => {
      updateRemoveMessage("");
    }, 1000);
  };

  const onSave = async () => {
    const requestObj = { data: [...inputtedTodoList] };

    const deleteOptions = {
      method: "DELETE",
    };

    const deleteResponse = await fetch(
      "https://todo-n5dn.vercel.app/todos/delete", 
      deleteOptions
    );

    if (deleteResponse) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestObj),
      };
      try {
        await fetch("https://todo-n5dn.vercel.app/todos/save", options); 
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const addItem = () => {
    let newObj = {
      id: uuidv4(),
      name: inputValue,
      status: "false",
    };

    if (inputValue === "") {
      alert("Please enter a valid todo");
    } else {
      updateTodo([...inputtedTodoList, newObj]);
    }
    clearInput();
  };

  return (

     <div class="todos-bg-container">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1 class="todos-heading">Todos</h1>
            <h1 class="create-task-heading">
              Create <span class="create-task-heading-subpart">Task</span>
            </h1>
          
            
            <input
          onChange={onEnter}
          value={inputValue}
       
          type="text"
          id="todoUserInput" class="todo-user-input" placeholder="What needs to be done?"
          
        />
        <button onClick={addItem} id="button" class="button" >
          Add
        </button>
            <h1 class="todo-items-heading">
              My <span class="todo-items-heading-subpart">Tasks</span>
            </h1>

            <ul class="todo-items-container" id="todoItemsContainer">    {inputtedTodoList.map((eachitem) => (
            <TodoItem
              key={eachitem.id}
              each={eachitem}
              deleteFun={deleteTodo}
              todosList={inputtedTodoList}
              todosListUpdateFuncPass={updateTodoList}
              checkStatus={eachitem.status}
            />
          ))}</ul>
            <button onClick={onSave} class="button" id="saveTodoButton">Save</button>
          </div>
   
         {removeMessage && <p className="remove-message">{removeMessage}</p>}
       
        </div>
      </div>
     </div>
  )
  
  };

export default App;
