import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Task } from './types/types'
import { HomePage } from './components/HomePage'

const task: Task = {
  id: 2,
  title: "Initial Task 2",
  description: "Sample description 2",
  completed: false,
  createdAt: new Date().toDateString(),
  priority: "low"
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomePage/>
  </StrictMode>,
)
