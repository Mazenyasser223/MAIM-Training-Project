import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './state/AuthContext.jsx'
import Browse from './pages/user/Browse.jsx'
import EventDetails from './pages/user/EventDetails.jsx'
import MyTickets from './pages/user/MyTickets.jsx'
import Notifications from './pages/user/Notifications.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Events from './pages/admin/Events.jsx'
import EventForm from './pages/admin/EventForm.jsx'
import Analytics from './pages/admin/Analytics.jsx'

const Nav = () => {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const doLogout = () => { logout(); nav('/'); }

  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
        <Link to="/" className="font-bold text-purple-700">EventX</Link>
        <Link to="/">Browse</Link>
        {user && <Link to="/my">My Tickets</Link>}
        {user?.role === 'admin' && (<>
          <Link to="/admin">Admin</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/analytics">Analytics</Link>
        </>)}
        <div className="ml-auto flex gap-3">
          {!user ? (<>
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn" to="/register">Register</Link>
          </>) : (<>
            <Link className="btn" to="/notifications">Notifications</Link>
            <button onClick={doLogout} className="btn-secondary">Logout</button>
          </>)}
        </div>
      </div>
    </nav>
  )
}

const Protected = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <div>
      <Nav />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route index element={<Browse />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="my" element={<Protected><MyTickets /></Protected>} />
          <Route path="notifications" element={<Protected><Notifications /></Protected>} />
          <Route path="admin" element={<Protected roles={['admin']}><Dashboard /></Protected>} />
          <Route path="admin/events" element={<Protected roles={['admin']}><Events /></Protected>} />
          <Route path="admin/events/new" element={<Protected roles={['admin']}><EventForm /></Protected>} />
          <Route path="admin/events/:id" element={<Protected roles={['admin']}><EventForm /></Protected>} />
          <Route path="admin/analytics" element={<Protected roles={['admin']}><Analytics /></Protected>} />
        </Routes>
      </div>
    </div>
  )
}
