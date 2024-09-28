
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  // Function to add new task
  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObject = {
        id: Date.now(),
        text: newTask,
        completed: false,
        addedAt: new Date(),
      };
      setTasks([...tasks, newTaskObject]);
      setNewTask('');
    }
  };

  // Toggle task completion
  const toggleCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Remove task
  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Update task
  const updateTask = (taskId, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      )
    );
    setEditTaskId(null);
    setEditTaskText('');
  };

  // Get pending tasks (last 24 hours)
  const getPendingTasks = () => {
    const now = new Date();
    return tasks.filter(
      (task) =>
        !task.completed && now - new Date(task.addedAt) < 24 * 60 * 60 * 1000
    );
  };

  // Effect to keep the current time updated every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup the timer when the component unmounts
  }, []);

  // Function to get the time passed for a task
  const getTimePassed = (taskTime) => {
    const diff = currentTime - new Date(taskTime);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  };

  // Formatting the current date and time
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', // Full name of the day
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="App">
      <div className="container">
        {/* Display current date and time */}
        <div className="date-time-container">
          <p className="date">{formatDate(currentTime)}</p>
          <p className="time">{formatTime(currentTime)}</p>
        </div>

        <h1>TODO APP</h1>

         <div className="input-container">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="add-task" onClick={addTask}>Add</button>
        </div>

         <div className="tasks-container">
          <h2>Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                />
                {editTaskId === task.id ? (
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    onBlur={() => updateTask(task.id, editTaskText)}
                  />
                ) : (
                  <span className="task-text">{task.text}</span>
                )}
                <span className="task-time">
                  {task.completed ? '' : ` - ${getTimePassed(task.addedAt)}`}
                </span>
                <button className="delete-task" onClick={() => removeTask(task.id)}>Delete</button>
                {editTaskId === task.id ? (
                  <button className="edit-task" onClick={() => updateTask(task.id, editTaskText)}>Save</button>
                ) : (
                  <button className="edit-task" onClick={() => {
                    setEditTaskId(task.id);
                    setEditTaskText(task.text);
                  }}>Edit</button>
                )}
              </li>
            ))}
          </ul>
        </div>  


        <div className="pending-tasks-container">
          <h2>Pending Tasks (Last 24 hours)</h2>
          <ul>
            {getPendingTasks().map((task) => (
              <li key={task.id}>{task.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
