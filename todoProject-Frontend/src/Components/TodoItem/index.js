import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import "./index.css";

const TodoItem = (props) => {
  const { each, deleteFun, todosListUpdateFuncPass, todosList, checkStatus } =
    props;
  const { name, id } = each;

  const lineStyle = checkStatus === "true" ? "line" : "";

  const onInput = (event) => {
    if (event.target.checked) {
      const toggleUpdateList = todosList.map((eachitem) => {
        if (eachitem.id === id) {
          return { ...eachitem, status: "true" };
        } else {
          return { ...eachitem };
        }
      });
      todosListUpdateFuncPass(toggleUpdateList);
    } else {
      const toggleUpdateList = todosList.map((eachitem) => {
        if (eachitem.id === id) {
          return { ...eachitem, status: "false" };
        } else {
          return { ...eachitem };
        }
      });
      todosListUpdateFuncPass(toggleUpdateList);
    }
  };

  const onDelIcon = () => {
    deleteFun(id);
  };

  return (
    <div className="todo-item-container d-flex flex-row">
    
      <div className="checkbox-container">
        <input
          onClick={onInput}
          id={id}
          className="checkbox-input"
          type="checkbox"
          checked={checkStatus === "true"}
        />
      </div>
      <div className="label-container d-flex flex-row">
      <label className={`${lineStyle} checkbox-label`} htmlFor={id}>
        {name}
      </label>
      <div className="delete-icon-container">
        <FontAwesomeIcon onClick={onDelIcon} className="m-3" icon={faTrash} />
      </div>
      </div>
      
    
    </div>
  );
};

export default TodoItem;
