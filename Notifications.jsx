import { useEffect, useState } from 'react'
import { useAuth } from '../../state/AuthContext.jsx'

export default function Notifications() {
  const { api } = useAuth()
  const [list, setList] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/tickets/notifications/upcoming')
      setList(data)
    })()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Upcoming events (7 days)</h1>
      <div className="grid3">
        {list.map(t => (
          <div key={t._id} className="card">
            <div className="text-sm text-gray-500">{new Date(t.event.date).toLocaleString()}</div>
            <h3 className="font-bold">{t.event.title}</h3>
            <div>Seat #{t.seatNumber}</div>
            {t.qrCode && <img src={t.qrCode} className="mt-2 rounded" />}
          </div>
        ))}
        {!list.length && <div className="text-gray-600">No upcoming events.</div>}
      </div>
    </div>
  )
}
