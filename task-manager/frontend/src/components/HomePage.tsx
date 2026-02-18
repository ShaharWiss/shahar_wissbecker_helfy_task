import { useEffect, useState, useRef } from 'react';
import { TaskCard } from './TaskCard';
import { EditModal } from './EditModal';
import type { Task } from '../types/types.ts';
import '../styles/HomePage.css';

type FilterType = 'all' | 'active' | 'completed';

export const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(checkScroll, 100);
    return () => clearTimeout(timeout);
  }, [tasks, filter]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollDistance = 374; 
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete task?")) return;
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (id: number | null, updatedData: Partial<Task>) => {
    const isNew = id === null;
    const url = isNew ? '/api/tasks' : `/api/tasks/${id}`;
    try {
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const saved = await response.json();
        setTasks(prev => isNew ? [...prev, saved] : prev.map(t => t.id === id ? saved : t));
        setSelectedTask(null);
        setIsAdding(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const getCounterLabel = () => {
    const count = filteredTasks.length;
    if (filter === 'all') return `${count} total tasks`;
    if (filter === 'active') return `${count} active tasks`;
    if (filter === 'completed') return `${count} completed tasks`;
    return `${count} tasks`;
  };

  if (loading) return <div className="status-message">Loading...</div>;

  return (
    <main className="homepage-container">
      <header className="home-header">
        <h1 className="home-title">Task Manager</h1>
        <button className="add-task-btn" onClick={() => setIsAdding(true)}>
          + Add Task
        </button>
      </header>

      <div className="filter-section">
        <div className="filter-pills">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button 
              key={f}
              className={`filter-pill ${filter === f ? 'selected' : ''}`} 
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="carousel-wrapper">
        {showLeftArrow && (
          <button className="nav-btn left" onClick={() => handleScroll('left')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}

        <div className="task-carousel" ref={carouselRef} onScroll={checkScroll}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(t) => setSelectedTask(t)}
              />
            ))
          ) : (
            <div className="status-message">No {filter} tasks found.</div>
          )}
        </div>

        {showRightArrow && (
          <button className="nav-btn right" onClick={() => handleScroll('right')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </div>

      <div className="home-footer">
        <p className="task-counter">
          {getCounterLabel()}
        </p>
      </div>

      {(isAdding || selectedTask) && (
        <EditModal 
          task={selectedTask || { id: 0, title: '', description: '', completed: false, priority: 'low', createdAt: '' }} 
          onClose={() => { setSelectedTask(null); setIsAdding(false); }} 
          onSave={handleSave} 
        />
      )}
    </main>
  );
};