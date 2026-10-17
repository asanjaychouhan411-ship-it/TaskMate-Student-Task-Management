
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

const initialTasks = []

function App() {
  const [page, setPage] = useState('home')
  const [tasks, setTasks] = useState(initialTasks)
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    subject: '',
    due: '',
    description: ''
  })

  // Backend se tasks load karna
  async function loadTasks() {
    try {
      setError('')
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Tasks load nahi ho sake.')
      }

      const data = await response.json()

     setTasks((Array.isArray(data) ? data : data.value).map(task => ({
  ...task,
  id: String(task._id || task.task_id || task.id || ''),
  status: task.completed ? 'Completed' : 'Pending',
  subject: task.subject || 'General',
  due: task.due || ''
})))

    } catch (err) {
      setError('Backend se connection nahi ho raha. Check karo ki server port 5000 par chal raha hai.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  function openTask(task) {
    setSelected(task)
    setPage('details')
  }

  // Naya task create karna
  async function saveTask(e) {
    e.preventDefault()

    if (!form.title.trim()) {
      alert('Please task ka title enter karo.')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description,
          completed: false
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Task create nahi hua.')
      }

      await loadTasks()

      setForm({
        title: '',
        subject: '',
        due: '',
        description: ''
      })

      setShowForm(false)
      setPage('dashboard')

    } catch (err) {
      alert(err.message)
    }
  }

  // Task complete ya pending karna
  async function toggleTask(id) {
    const task = tasks.find(item => item.id === id)

    if (!task) return

    const completed = !task.completed

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Task update nahi hua.')
      }

      await loadTasks()

      if (selected?.id === id) {
        setSelected({
          ...selected,
          completed,
          status: completed ? 'Completed' : 'Pending'
        })
      }

    } catch (err) {
      alert(err.message)
    }
  }

  // Task delete karna
  async function deleteTask(id) {
    const confirmDelete = window.confirm(
      'Kya tum sach mein yeh task delete karna chahte ho?'
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Task delete nahi hua.')
      }

      setSelected(null)
      setPage('dashboard')
      await loadTasks()

    } catch (err) {
      alert(err.message)
    }
  }

  const pending = tasks.filter(task => !task.completed).length
  const completed = tasks.filter(task => task.completed).length

  return (
    <div className="app">
      <header className="navbar">
        <button
          className="brand"
          onClick={() => setPage('home')}
        >
          <span className="brand-icon">✦</span>
          TaskMate
        </button>

        <nav>
          <button
            className={page === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => setPage('home')}
          >
            Home
          </button>

          <button
            className={page === 'dashboard' ? 'nav-link active' : 'nav-link'}
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </button>

          <button
            className="nav-cta"
            onClick={() => {
              setPage('dashboard')
              setShowForm(true)
            }}
          >
            + Add Task
          </button>
        </nav>
      </header>

      <main>
        {page === 'home' && (
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">
                YOUR STUDY LIFE, ORGANIZED
              </span>

              <h1>
                Make time for what
                <br />
                <span>matters.</span>
              </h1>

              <p>
                Manage assignments, keep track of deadlines, and make
                every study session count with TaskMate.
              </p>

              <button
                className="primary-btn"
                onClick={() => setPage('dashboard')}
              >
                Explore Dashboard →
              </button>

              <div className="hero-note">
                ✦ Simple planning habits. Track your progress.
              </div>
            </div>

            <div className="hero-card">
              <div className="card-top">
                <span>YOUR PROGRESS</span>
                <span className="live-dot">Today</span>
              </div>

              <h2>{completed} of {tasks.length} tasks completed</h2>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${tasks.length ? completed / tasks.length * 100 : 0}%`
                  }}
                />
              </div>

              <div className="stats-row">
                <div>
                  <strong>{pending}</strong>
                  <span>Pending</span>
                </div>
                <div>
                  <strong>{completed}</strong>
                  <span>Completed</span>
                </div>
              </div>

              <div className="today-check">
                <span>✓</span>
                <div>
                  <strong>Keep moving forward.</strong>
                  <small>Small steps make progress.</small>
                </div>
              </div>
            </div>
          </section>
        )}

        {page === 'dashboard' && (
          <section className="dashboard">
            <div className="page-heading">
              <div>
                <span className="eyebrow">YOUR WORKSPACE</span>
                <h1>My Dashboard</h1>
                <p>One step at a time. You've got this!</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '✕ Cancel' : '+ New Task'}
              </button>
            </div>

            {error && (
              <p className="error-message">{error}</p>
            )}

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon purple">▤</span>
                <p>Total tasks</p>
                <h2>{tasks.length}</h2>
              </div>

              <div className="stat-card">
                <span className="stat-icon orange">◷</span>
                <p>Pending</p>
                <h2>{pending}</h2>
              </div>

              <div className="stat-card">
                <span className="stat-icon green">✓</span>
                <p>Completed</p>
                <h2>{completed}</h2>
              </div>
            </div>

            {showForm && (
              <form className="task-form" onSubmit={saveTask}>
                <h2>Create a new task</h2>

                <label>
                  Task title *
                  <input
                    type="text"
                    value={form.title}
                    onChange={e =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Complete assignment"
                    required
                  />
                </label>

                <label>
                  Subject
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="e.g. Computer Science"
                  />
                </label>

                <label>
                  Due date
                  <input
                    type="date"
                    value={form.due}
                    onChange={e =>
                      setForm({ ...form, due: e.target.value })
                    }
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={form.description}
                    onChange={e =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="What do you need to do?"
                  />
                </label>

                <button className="primary-btn" type="submit">
                  Save Task
                </button>
              </form>
            )}

            <div className="section-heading">
              <div>
                <h2>My assignments</h2>
                <p>Click a task to see its details.</p>
              </div>
              <span>{tasks.length} tasks</span>
            </div>

            {loading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="empty-state">
                No tasks yet. Create your first task!
              </p>
            ) : (
              <div className="task-list">
                {tasks.map(task => (
                  <div className="task-row" key={task.id}>
                    <button
                      className={
                        task.completed
                          ? 'task-status checked'
                          : 'task-status'
                      }
                      onClick={() => toggleTask(task.id)}
                      aria-label="Toggle task status"
                    >
                      {task.completed ? '✓' : ''}
                    </button>

                    <button
                      className="task-info"
                      onClick={() => openTask(task)}
                    >
                      <strong className={task.completed ? 'task-done' : ''}>
                        {task.title}
                      </strong>
                      <span>
                        {task.subject || 'General'}
                        {task.due ? ` · Due ${task.due}` : ''}
                      </span>
                    </button>

                    <span
                      className={
                        task.completed
                          ? 'status-badge completed'
                          : 'status-badge pending'
                      }
                    >
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>

                    <button
                      className="details-btn"
                      onClick={() => openTask(task)}
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {page === 'details' && selected && (
          <section className="details-page">
            <button
              className="back-btn"
              onClick={() => setPage('dashboard')}
            >
              ← Back to Dashboard
            </button>

            <div className="details-card">
              <span className="eyebrow">TASK DETAILS</span>

              <h1>{selected.title}</h1>

              <span
                className={
                  selected.completed
                    ? 'status-badge completed'
                    : 'status-badge pending'
                }
              >
                {selected.completed ? 'Completed' : 'Pending'}
              </span>

              <div className="detail-item">
                <strong>Subject</strong>
                <p>{selected.subject || 'General'}</p>
              </div>

              <div className="detail-item">
                <strong>Due date</strong>
                <p>{selected.due || 'Not set'}</p>
              </div>

              <div className="detail-item">
                <strong>Description</strong>
                <p>
                  {selected.description || 'No description added.'}
                </p>
              </div>

              <div className="detail-actions">
                <button
                  className="primary-btn"
                  onClick={() => toggleTask(selected.id)}
                >
                  {selected.completed
                    ? '↩ Mark Pending'
                    : '✓ Mark Completed'}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(selected.id)}
                >
                  Delete Task
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>© 2026 TaskMate · Plan better, learn better.</p>
      </footer>
    </div>
  )
}

export default App
