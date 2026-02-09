import { useState, useEffect } from "react";

export default function TaskForm({ editingTask, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || 1);
      setDueDate(editingTask.due_date ? editingTask.due_date.slice(0, 10) : "");
    } else {
      resetForm();
    }
  }, [editingTask]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority(1);
    setDueDate("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      priority: Number(priority),
      ...(dueDate && { due_date: dueDate }),
      ...(!editingTask && { completed: false }),
    };

    onSubmit(payload);
    if (!editingTask) resetForm();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>{editingTask ? "Edit Task" : "New Task"}</h3>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="form-row">
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value={1}>1 – Low</option>
            <option value={2}>2 – Medium</option>
            <option value={3}>3 – High</option>
            <option value={4}>4 – Urgent</option>
            <option value={5}>5 – Critical</option>
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          {editingTask ? "Save Changes" : "Add Task"}
        </button>
        {editingTask && (
          <button className="btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}