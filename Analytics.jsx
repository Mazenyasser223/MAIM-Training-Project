import { useEffect, useState } from 'react'
import { useAuth } from '../../state/AuthContext.jsx'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

export default function Analytics() {
  const { api } = useAuth()
  const [demo, setDemo] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/analytics/demographics')
      setDemo(data)
    })()
  }, [])

  if (!demo) return <div>Loading...</div>

  const toData = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }))

  return (
    <div className="grid2">
      <div className="card">
        <h2 className="font-bold mb-2">Age Groups</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={toData(demo.ageGroups)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">Gender</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={toData(demo.gender)} dataKey="value" nameKey="name" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">Interests (Top)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={toData(demo.interests).sort((a,b)=>b.value-a.value).slice(0,8)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">Locations</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={toData(demo.locations)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
