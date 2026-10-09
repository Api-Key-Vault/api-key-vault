import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserDashboardPage from './userDashboard/UserDashboardPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserDashboardPage />
    {/* <App /> */}
  </StrictMode>,
)
