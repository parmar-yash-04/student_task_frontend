export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const priorityLabels = {
    1: { label: "Low", cls: "badge-low" },
    2: { label: "Medium", cls: "badge-med" },
    3: { label: "High", cls: "badge-high" },
    4: { label: "Urgent", cls: "badge-urgent" },
    5: { label: "Critical", cls: "badge-critical" },
  };

  const p = priorityLabels[task.priority] || priorityLabels[1];

  function fmtDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const isOverdue =
    task.due_date && !task.completed && new Date(task.due_date) < new Date();

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="task-body">
        <div className="task-header">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
            title="Toggle completed"
          />
          <strong className="task-title">{task.title}</strong>
          <span className={`badge ${p.cls}`}>{p.label}</span>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        {task.due_date && (
          <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
            Due: {fmtDate(task.due_date)}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn btn-sm" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}