import { useEffect, useState } from 'react'
import { useAuth } from '../../state/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Events() {
  const { api } = useAuth()
  const [events, setEvents] = useState([])
  const load = async () => {
    const { data } = await api.get('/api/events')
    setEvents(data)
  }
  useEffect(() => { load() }, [])

  const delItem = async (id) => {
    if (!confirm('Delete this event?')) return
    await api.delete(`/api/events/${id}`)
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <Link className="btn" to="/admin/events/new">Add Event</Link>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Date</th><th>Venue</th><th>Price</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td>{e.title}</td>
                <td>{new Date(e.date).toLocaleString()}</td>
                <td>{e.venue}</td>
                <td>${e.price}</td>
                <td><span className="text-xs bg-gray-100 rounded px-2 py-1">{e.status}</span></td>
                <td className="text-right">
                  <Link className="btn mr-2" to={`/admin/events/${e._id}`}>Edit</Link>
                  <button className="btn-secondary" onClick={()=>delItem(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
