// frontend/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Box, TextField, IconButton,
  List, ListItem, ListItemText,
  Checkbox, ListItemSecondaryAction,
  Typography, Paper, Slide, Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const API = axios.create({ baseURL: "http://localhost:5000" });

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await API.post("/tasks", { title: newTask });
    setNewTask("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await API.put(`/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        py: 5
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, mb: 4, textAlign: "center", boxShadow: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            🌟 My Task List
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <TextField
              placeholder="What needs to be done?"
              variant="outlined"
              fullWidth
              size="small"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyPress={e => e.key === "Enter" && addTask()}
            />
            <IconButton
              color="primary"
              size="large"
              onClick={addTask}
              sx={{ ml: 1 }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Paper>

        <List>
          {tasks.map((task, idx) => (
            <Slide
              key={task._id}
              direction="up"
              in={true}
              mountOnEnter
              unmountOnExit
              timeout={300 + idx * 50}
            >
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  mb: 1,
                  boxShadow: 1
                }}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                />
                <ListItemText
                  primary={task.title}
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "text.disabled" : "text.primary"
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => deleteTask(task._id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </Paper>
            </Slide>
          ))}
          {tasks.length === 0 && (
            <Typography mt={2} align="center" color="text.secondary">
              📝 No tasks yet. Add one above!
            </Typography>
          )}
        </List>
      </Container>
    </Box>
  );
}

export default App;
