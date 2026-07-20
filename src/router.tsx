import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { RequireStaff } from './shell/RequireRole'
import { RoleHome } from './pages/RoleHome'
import { DashboardPage } from './pages/DashboardPage'
import { ClientHomePage } from './pages/ClientHomePage'
import { ReturnsListPage } from './pages/ReturnsListPage'
import { ReturnOverviewPage } from './pages/ReturnOverviewPage'
import { ReviewPage } from './pages/ReviewPage'
import { ItemsPage } from './pages/ItemsPage'
import { StatusPage } from './pages/StatusPage'
import { ThreadPage } from './pages/ThreadPage'
import { MessagesPage } from './pages/MessagesPage'
import { TasksPage } from './pages/TasksPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { NotFound } from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <RoleHome /> },
      // staff-only screens are gated: a client context is bounced to /home (05)
      { path: 'dashboard', element: <RequireStaff><DashboardPage /></RequireStaff> },
      { path: 'home', element: <ClientHomePage /> },
      { path: 'returns', element: <RequireStaff><ReturnsListPage /></RequireStaff> },
      { path: 'returns/:returnId', element: <ReturnOverviewPage /> },
      { path: 'returns/:returnId/review', element: <ReviewPage /> },
      { path: 'returns/:returnId/review/:fieldId', element: <ReviewPage /> },
      { path: 'returns/:returnId/items', element: <ItemsPage /> },
      { path: 'returns/:returnId/status', element: <StatusPage /> },
      { path: 'returns/:returnId/threads/:threadId', element: <ThreadPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'design', element: <RequireStaff><DesignSystemPage /></RequireStaff> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
