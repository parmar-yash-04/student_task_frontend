import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../api/client";
import { useToast } from "../context/ToastContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function Tasks() {
  // ── State ──
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  // Search & filter
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { toast } = useToast();

  // ── Load all tasks ──
  async function loadTasks() {
    setLoading(true);
    try {
      const data = await apiFetch("/tasks/");
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ── Filtered + searched tasks (computed) ──
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      // text search
      const q = search.toLowerCase();
      const matchText =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q);

      // priority filter
      const matchPriority =
        filterPriority === "all" || t.priority === Number(filterPriority);

      // status filter
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "done" && t.completed) ||
        (filterStatus === "pending" && !t.completed);

      return matchText && matchPriority && matchStatus;
    });
  }, [tasks, search, filterPriority, filterStatus]);

  // ── Create ──
  async function handleCreate(payload) {
    try {
      await apiFetch("/tasks/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Task created!");
      loadTasks();
    } catch {
      toast.error("Failed to create task.");
    }
  }

  // ── Update (from edit form) ──
  async function handleUpdate(payload) {
    try {
      await apiFetch(`/tasks/${editingTask.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Task updated!");
      setEditingTask(null);
      loadTasks();
    } catch {
      toast.error("Failed to update task.");
    }
  }

  // ── Toggle completed ──
  async function handleToggle(task) {
    try {
      await apiFetch(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed }),
      });
      toast.info(task.completed ? "Marked as pending" : "Marked as done");
      loadTasks();
    } catch {
      toast.error("Failed to update status.");
    }
  }

  // ── Delete ──
  async function handleDelete(id) {
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      toast.success("Task deleted.");
      loadTasks();
    } catch {
      toast.error("Failed to delete task.");
    }
  }

  // ── Render ──
  return (
    <div className="tasks-section">
      {/* ── Form ── */}
      <TaskForm
        editingTask={editingTask}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        onCancel={() => setEditingTask(null)}
      />

      {/* ── Search + Filters ── */}
      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
          <option value="4">Urgent</option>
          <option value="5">Critical</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="done">Completed</option>
        </select>
      </div>

      {/* ── Loading ── */}
      {loading && <p className="loading-msg">Loading tasks…</p>}

      {/* ── Empty ── */}
      {!loading && filtered.length === 0 && (
        <p className="empty-msg">
          {tasks.length === 0
            ? "No tasks yet. Create one above!"
            : "No tasks match your filters."}
        </p>
      )}

      {/* ── Task list ── */}
      <div className="task-list">
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onEdit={setEditingTask}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}