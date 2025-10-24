import React, { Component } from "react";
import TodoItem from "./Components/TodoItem";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputtedTodoList: [],
      inputValue: "",
      removeMessage: "",
    };
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos = async () => {
    try {
      const response = await fetch("https://todo-n5dn.vercel.app/todos", {
        method: "GET",
      });
      const data = await response.json();
      this.setState({ inputtedTodoList: data });
    } catch (err) {
      console.error(err);
    }
  };

  onEnter = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  updateTodoList = (arrList) => {
    this.setState({ inputtedTodoList: arrList });
  };

  clearInput = () => {
    this.setState({ inputValue: "" });
  };

  deleteTodo = (id) => {
    const filteredList = this.state.inputtedTodoList.filter(
      (item) => item.id !== id
    );
    this.setState({ inputtedTodoList: filteredList, removeMessage: "Todo deleted Successfully" });

    setTimeout(() => {
      this.setState({ removeMessage: "" });
    }, 1000);
  };

  onSave = async () => {
    const requestObj = { data: [...this.state.inputtedTodoList] };

    try {
    

      await fetch("https://todo-n5dn.vercel.app/todos/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestObj),
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  addItem = () => {
    const { inputValue, inputtedTodoList } = this.state;

    if (inputValue.trim() === "") {
      alert("Please enter a valid todo");
      return;
    }

    const newObj = {
      id: uuidv4(),
      name: inputValue,
      status: "false",
    };

    this.setState({
      inputtedTodoList: [...inputtedTodoList, newObj],
      inputValue: "",
    });
  };

  render() {
    const { inputtedTodoList, inputValue, removeMessage } = this.state;

    return (
      <div className="todos-bg-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="todos-heading">Todos</h1>
              <h1 className="create-task-heading">
                Create <span className="create-task-heading-subpart">Task</span>
              </h1>

              <input
                type="text"
                id="todoUserInput"
                className="todo-user-input"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={this.onEnter}
              />
              <button onClick={this.addItem} id="button" className="button">
                Add
              </button>

              <h1 className="todo-items-heading">
                My <span className="todo-items-heading-subpart">Tasks</span>
              </h1>

              <ul className="todo-items-container" id="todoItemsContainer">
                {inputtedTodoList.map((eachitem) => (
                  <TodoItem
                    key={eachitem.id}
                    each={eachitem}
                    deleteFun={this.deleteTodo}
                    todosList={inputtedTodoList}
                    todosListUpdateFuncPass={this.updateTodoList}
                    checkStatus={eachitem.status}
                  />
                ))}
              </ul>

              <button onClick={this.onSave} className="button" id="saveTodoButton">
                Save
              </button>
            </div>

            {removeMessage && <p className="remove-message">{removeMessage}</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
