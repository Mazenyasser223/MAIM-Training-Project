import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext.jsx'

export default function EventDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { api, user } = useAuth()
  const [ev, setEv] = useState(null)
  const [seat, setSeat] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/events/${id}`)
      setEv(data)
    })()
  }, [id])

  const book = async () => {
    if (!user) return nav('/login')
    try {
      const { data } = await api.post('/api/tickets/book', { eventId: id, seatNumber: seat })
      setMsg(`Booked! Ticket #${data._id}`)
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Booking failed')
    }
  }

  if (!ev) return <div>Loading...</div>

  return (
    <div className="grid2">
      <div className="card">
        <h1 className="text-2xl font-bold">{ev.title}</h1>
        <div className="text-gray-600">{ev.description}</div>
        <div className="mt-2">{new Date(ev.date).toLocaleString()} @ {ev.venue}</div>
        <div className="mt-2">Price: <strong>${ev.price}</strong></div>
        <div className="mt-2">Status: <span className="text-sm bg-gray-100 px-2 py-1 rounded">{ev.status}</span></div>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">Seat Selection</h2>
        <div className="grid grid-cols-8 gap-2">
          {ev.seats.map(s => (
            <button key={s.number} disabled={s.reserved}
              className={"px-3 py-2 rounded " + (s.reserved ? "bg-gray-300" : (seat===s.number ? "bg-purple-700 text-white" : "bg-purple-100"))}
              onClick={()=>setSeat(s.number)}>
              {s.number}
            </button>
          ))}
        </div>
        <button className="btn mt-3" onClick={book} disabled={!seat}>Book Seat {seat && `#${seat}`}</button>
        {msg && <div className="mt-2 text-sm">{msg}</div>}
      </div>
    </div>
  )
}
