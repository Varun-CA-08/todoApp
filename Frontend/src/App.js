import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (!newText.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: newText });
      setTodos((prev) => [...prev, res.data]);
      setNewText("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? res.data : todo))
      );
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const startEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`${API_URL}/${id}`, { text: editText });
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? { ...todo, text: editText } : todo))
      );
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Error saving edit:", err);
    }
  };

  return (
    <div style={styles.fullScreen}>
      <div style={styles.container}>
        <h1 style={styles.title}>My ToDo App</h1>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTodo();
            }}
            style={styles.input}
            autoFocus
          />
          <button onClick={addTodo} style={styles.addButton}>
            Add
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thCheckbox}>Done</th>
              <th style={styles.thTask}>Task</th>
              <th style={styles.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 && (
              <tr>
                <td colSpan="3" style={styles.emptyMessage}>
                  No tasks yet! Add something above.
                </td>
              </tr>
            )}
            {todos.map(({ _id, text, completed }) => (
              <tr
                key={_id}
                style={{
                  backgroundColor: completed ? "#e0ffe0" : "transparent",
                }}
              >
                <td style={styles.tdCenter}>
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleComplete(_id)}
                    style={styles.checkbox}
                    aria-label={`Mark task "${text}" as done`}
                  />
                </td>

                <td style={styles.tdTask}>
                  {editId === _id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(_id);
                        else if (e.key === "Escape") cancelEdit();
                      }}
                      style={styles.editInput}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => toggleComplete(_id)}
                      style={{
                        textDecoration: completed ? "line-through" : "none",
                        cursor: "pointer",
                        userSelect: "none",
                        color: completed ? "#777" : "#111",
                        fontWeight: completed ? "normal" : "600",
                      }}
                      title="Click to toggle complete"
                    >
                      {text}
                    </span>
                  )}
                </td>

                <td style={styles.tdCenter}>
                  {editId === _id ? (
                    <>
                      <button
                        onClick={() => saveEdit(_id)}
                        style={{ ...styles.button, ...styles.saveButton }}
                        title="Save edit"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ ...styles.button, ...styles.cancelButton }}
                        title="Cancel edit"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(_id, text)}
                        style={{ ...styles.button, ...styles.editButton }}
                        title="Edit task"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(_id)}
                        style={{ ...styles.button, ...styles.deleteButton }}
                        title="Delete task"
                      >
                        &times;
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  fullScreen: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "95%",
    maxWidth: 960,
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    padding: 30,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    margin: 0,
    marginBottom: 20,
    fontWeight: "700",
    fontSize: 28,
    textAlign: "center",
    userSelect: "none",
    color: "#333",
  },
  inputRow: {
    display: "flex",
    gap: 10,
    marginBottom: 25,
  },
  input: {
    flexGrow: 1,
    fontSize: 18,
    padding: "12px 16px",
    borderRadius: 6,
    border: "1.5px solid #ccc",
    outline: "none",
    transition: "border-color 0.2s",
  },
  addButton: {
    padding: "12px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    fontWeight: "700",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    userSelect: "none",
    transition: "background-color 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thCheckbox: {
    width: 60,
    padding: "12px 10px",
    borderBottom: "2px solid #ddd",
    textAlign: "center",
    color: "#666",
    userSelect: "none",
  },
  thTask: {
    padding: "12px 15px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    color: "#444",
    userSelect: "none",
  },
  thActions: {
    width: 160,
    padding: "12px 10px",
    borderBottom: "2px solid #ddd",
    textAlign: "center",
    color: "#666",
    userSelect: "none",
  },
  tdCenter: {
    padding: "12px 10px",
    textAlign: "center",
    verticalAlign: "middle",
    borderBottom: "1px solid #eee",
    userSelect: "none",
  },
  tdTask: {
    padding: "12px 15px",
    verticalAlign: "middle",
    borderBottom: "1px solid #eee",
    userSelect: "none",
  },
  checkbox: {
    width: 22,
    height: 22,
    cursor: "pointer",
  },
  editInput: {
    fontSize: 16,
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1.5px solid #4caf50",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    padding: "8px 14px",
    borderRadius: 6,
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginLeft: 6,
    userSelect: "none",
    minWidth: 60,
  },
  editButton: {
    backgroundColor: "#2196f3",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#e53935",
    color: "white",
  }
};