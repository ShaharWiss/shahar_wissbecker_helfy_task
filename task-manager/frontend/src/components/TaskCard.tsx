import type { Task } from '../types/types.ts';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  const priorityColors = {
    low: '#94a3b8',
    medium: '#f97316',
    high: '#ef4444'
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-body">
        <div className="task-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill={priorityColors[task.priority]} xmlns="http://www.w3.org">
            <path d="M4 21V4H13V6H20V16H11V14H6V21H4Z" />
          </svg>
          <h3 className="task-title">{task.title}</h3>
        </div>
        <p className="task-desc">{task.description}</p>
        <span className="task-date">{formattedDate}</span>
      </div>
      
      <div className="task-side-actions">
        <div className="task-checkbox-container">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }} 
          />
        </div>

        <button className="icon-btn edit-btn" onClick={() => onEdit(task)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};