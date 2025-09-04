import { useEffect, useState } from 'react'
import { useAuth } from '../../state/AuthContext.jsx'

export default function Dashboard() {
  const { api } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/analytics/summary')
      setStats(data)
    })()
  }, [])

  if (!stats) return <div>Loading...</div>

  const Card = ({ title, value }) => (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  )

  return (
    <div className="grid3">
      <Card title="Total Events" value={stats.eventsCount} />
      <Card title="Tickets Sold" value={stats.ticketsSold} />
      <Card title="Revenue ($)" value={stats.revenue} />
      <Card title="Unique Attendees" value={stats.attendees} />
    </div>
  )
}
