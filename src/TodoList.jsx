import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from 'react-dnd';
export const TodoList = () => {
  // const [lists, setLists] = useState([{ name: 'List 1', todos: [], inputValue: '', isOpen: true }]);
  const [lists, setLists] = useState([]);
  const [taskDescs, setTaskDescs] = useState([]);
  const [newListName, setNewListName] = useState('');

  const updateTaskDesc = (index, value) => {
    const updatedTaskDescs = [...taskDescs];
    updatedTaskDescs[index] = value;
    setTaskDescs(updatedTaskDescs);
  };

  const addTodo = async (index,listId) => {
    const trimmedTaskDesc = taskDescs[index].trim(); // Trim the task description
    if (trimmedTaskDesc === '') {
      // If the description is empty or contains only spaces, show an error
      alert("Task description is missing");
      return;
    }

    const formData = {
      description: trimmedTaskDesc
    };
    
    fetch(`http://localhost:4000/api/users/${localStorage.getItem('userId')}/lists/${listId}/tasks`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Todo cannot be added');
        }
        callGetApi();
        return response.json();
      })
      .then(data => {
        console.log(data,"hii"); // Log the response data if needed
        // setTaskDesc(''); // Clear the input after successfully adding the todo
      })
      .catch(error => {
        console.error('Error:', error); // Handle any potential errors
        alert(`Error: ${error.message}`); // Show the API error message in an alert
        // You can also display the error message in the UI or handle it differently
      });
  };

  const removeTodo = (listIndex, todoIndex) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].todos.splice(todoIndex, 1);
    setLists(updatedLists);
  };

  // const switchList = (index) => {
  //   setActiveListIndex(index);
  // };

  const addNewList = async () => {
    // Trim input values to check for blank spaces
    const trimmedNewListName = newListName.trim();

    if (trimmedNewListName === '') {
      // If username or password is empty or contains only spaces, show an error
      alert("List name is missing");
      return;
    }
    // Prepare the data to be sent
    const formData = {
      userId: localStorage.getItem('userId'),
      title: trimmedNewListName
    };
    fetch("http://localhost:4000/api/createList", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('List cannot be created');
        }
        callGetApi();
        return response.json();
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error('Error:', error); // Handle any potential errors
        alert(`Error: ${error.message}`); // Show the API error message in an alert
        // You can also display the error message in the UI or handle it differently

      });
  };

  const onInputChange = (index, value) => {
    const updatedLists = [...lists];
    updatedLists[index].inputValue = value;
    setLists(updatedLists);
  };

  const markComplete = async (index, todoIndex, taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/updateTaskState/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
        // Optionally, include a request body if needed
      });

      if (!response.ok) {
        throw new Error('Task not found');
      }
      // Update the todo state in your local state
      const updatedLists = [...lists];
      updatedLists[index].Tasks[todoIndex].state = 1;
      setLists(updatedLists);
      setTimeout(() => {
        callGetApi();
      }, 1000)
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
      // You can also display the error message in the UI or handle it differently
    }
  };


  const removeEmptyList = (listIndex) => {
    fetch(`http://localhost:4000/api/removeList/${listIndex}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to remove list');
        }
        console.log('List removed successfully');
        callGetApi();
        // Proceed with further actions after successful deletion
      })
      .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        // Handle errors or display the error message in the UI as needed
      });

  };

  const callGetApi = () => {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:4000/api/users/${userId}/lists-with-tasks`)
      .then(response => {
        if (!response.ok) {
          throw new Error('User not found');
        }
        return response.json();
      })
      .then(data => {
        const listsArray = data.user.Lists;
        console.log("data.user.Lists", listsArray);
        listsArray.forEach((ele) => {
          console.log(ele.title)
        }) // Handle the response data here
        setLists(listsArray);
        console.log("lists", listsArray)
      })
      .catch(error => {
        console.error('Error:', error); // Handle any potential errors
        alert(`Error: ${error.message}`); // Show the API error message in an alert
        // You can also display the error message in the UI or handle it differently
      });
  }



  // Handle drop action
  const handleDrop = (droppedIndex, targetIndex) => {
    const updatedLists = [...lists];
    const droppedList = updatedLists[droppedIndex];
    updatedLists.splice(droppedIndex, 1);
    updatedLists.splice(targetIndex, 0, droppedList);
    setLists(updatedLists);
  };

  
  useEffect(() => {
    callGetApi();
  }, []);

  const [{ isDragging }, drag] = useDrag({
    type: 'YOUR_ITEM_TYPE',
    item: { type: 'TODO_ITEM' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    type: 'YOUR_ITEM_TYPE',
    accept: 'TODO_ITEM',
    drop: (item, monitor) => {
      const droppedIndex = item.index;
      handleDrop(droppedIndex, monitor.getItem().index);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });



  
  return (
    <>
     <div ref={drop}>
      <input
        type="text"
        placeholder="Enter List Name"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button onClick={addNewList}>Create New List</button>
    </div>
    <div className="todo-list-container" style={{overflowX:"auto",width:"100vw"}}>
    {lists.map((list, index) => (
      <div key={index}  className="todo-list-item" ref={drop}>
          <h3 className="todo-list-name">{list.title}</h3>
          <div style={{ display: 'block' }} >
            <input
              type="text"
              value={taskDescs[index] || ''}
              onChange={(e) => updateTaskDesc(index, e.target.value)}
              className="add-todo"
            />
            <button onClick={() => addTodo(index, list.ID)}>Add Todo</button>
            {list.Tasks.map((todo, todoIndex) => (
              <div key={todoIndex} className="task-box" ref={drag}>
                <input
                  type="checkbox"
                  checked={todo.state}
                  onChange={() => markComplete(index, todoIndex, todo.ID)}
                  disabled={todo.state}
                />
                <span className={todo.state ? 'completed' : ''}>
                  {todo.description}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => removeEmptyList(list.ID)}>RemoveList</button>
        </div>
    ))}
  </div>
    </>
);
  
};


