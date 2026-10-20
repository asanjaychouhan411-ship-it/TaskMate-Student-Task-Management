
// @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from './App'

const API_URL = 'http://localhost:5000/api/tasks'

const sampleTask = {
  _id: 'task-123',
  title: 'Complete assignment',
  description: 'Week 5 testing',
  completed: false,
}

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  }
}

function getDashboardButton() {
  return within(screen.getByRole('navigation')).getByRole(
    'button',
    { name: 'Dashboard', exact: true }
  )
}

describe('TaskMate application - Week 5 testing', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the home page and navigation', () => {
    fetch.mockResolvedValue(jsonResponse([]))

    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /make time for what/i,
      })
    ).toBeInTheDocument()

    expect(getDashboardButton()).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /add task/i })
    ).toBeInTheDocument()
  })

  it('loads and displays tasks from the API', async () => {
    fetch.mockResolvedValue(jsonResponse([sampleTask]))

    const user = userEvent.setup()
    render(<App />)

    await user.click(getDashboardButton())

    expect(
      await screen.findByRole('button', {
        name: /complete assignment/i,
      })
    ).toBeInTheDocument()

    expect(screen.getByText('Total tasks')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(API_URL)
  })

  it('shows an error when the backend is unavailable', async () => {
    fetch.mockRejectedValue(new Error('Connection refused'))

    const user = userEvent.setup()
    render(<App />)

    await user.click(getDashboardButton())

    expect(
      await screen.findByText(
        /backend se connection nahi ho raha/i
      )
    ).toBeInTheDocument()
  })

  it('creates a task and reloads the task list', async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            _id: 'task-456',
            title: 'Study statistics',
            description: '',
            completed: false,
          },
          201
        )
      )
      .mockResolvedValueOnce(
        jsonResponse([
          {
            _id: 'task-456',
            title: 'Study statistics',
            description: '',
            completed: false,
          },
        ])
      )

    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', { name: /add task/i })
    )

    await user.type(
      screen.getByPlaceholderText(/complete assignment/i),
      'Study statistics'
    )

    await user.click(
      screen.getByRole('button', { name: /save task/i })
    )

    expect(
      await screen.findByRole('button', {
        name: /study statistics/i,
      })
    ).toBeInTheDocument()

    expect(fetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Study statistics',
          description: '',
          completed: false,
        }),
      })
    )
  })

  it('updates a task completion status', async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse([sampleTask]))
      .mockResolvedValueOnce(
        jsonResponse({
          ...sampleTask,
          completed: true,
        })
      )
      .mockResolvedValueOnce(
        jsonResponse([
          {
            ...sampleTask,
            completed: true,
          },
        ])
      )

    const user = userEvent.setup()
    render(<App />)

    await user.click(getDashboardButton())

    expect(
      await screen.findByRole('button', {
        name: /complete assignment/i,
      })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /toggle task status/i,
      })
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/task-123`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            completed: true,
          }),
        })
      )
    })

    const completedBadge = await screen.findByText('Completed', {
      selector: 'span.status-badge.completed',
    })

    expect(completedBadge).toBeInTheDocument()
  })

  it('deletes a task after confirmation', async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse([sampleTask]))
      .mockResolvedValueOnce(
        jsonResponse({ message: 'Task deleted' })
      )
      .mockResolvedValueOnce(jsonResponse([]))

    const user = userEvent.setup()
    render(<App />)

    await user.click(getDashboardButton())

    await user.click(
      await screen.findByRole('button', {
        name: /complete assignment/i,
      })
    )

    await user.click(
      screen.getByRole('button', {
        name: /delete task/i,
      })
    )

    expect(window.confirm).toHaveBeenCalled()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/task-123`,
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })

    expect(
      await screen.findByText(/no tasks yet/i)
    ).toBeInTheDocument()
  })
})
