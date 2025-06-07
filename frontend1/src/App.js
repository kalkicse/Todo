// frontend/src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = () => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then(setTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewTask("");
        fetchTasks();
      });
  };

  const toggleTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "PUT" }).then(() =>
      fetchTasks()
    );
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" }).then(() =>
      fetchTasks()
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Simple Todo App with MongoDB</h2>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((t) => (
          <li key={t._id} style={{ margin: "1rem 0" }}>
            <span
              onClick={() => toggleTask(t._id)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {t.title}
            </span>{" "}
            <button onClick={() => deleteTask(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
