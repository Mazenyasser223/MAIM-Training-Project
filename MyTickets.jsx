import { useEffect, useState } from 'react'
import { useAuth } from '../../state/AuthContext.jsx'

export default function MyTickets() {
  const { api } = useAuth()
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/tickets/my')
      setTickets(data)
    })()
  }, [])

  return (
    <div className="grid3">
      {tickets.map(t => (
        <div key={t._id} className="card">
          <div className="text-sm text-gray-500">{new Date(t.bookedAt).toLocaleString()}</div>
          <h3 className="font-bold">{t.event?.title}</h3>
          <div>Seat #{t.seatNumber}</div>
          {t.qrCode && <img src={t.qrCode} alt="QR" className="mt-2 rounded" />}
          <div className="text-xs text-gray-600 mt-1">{t.checkedIn ? "Checked in" : "Not checked in"}</div>
        </div>
      ))}
    </div>
  )
}
