import { useState } from 'react'
import apiClient from './service/client'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // ฟังก์ชันสร้าง user ใหม่
  const createUser = async () => {
    if (!username || !password) {
      alert('กรุณากรอก username และ password')
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.post('/api/insert-user', {
        user_name: username,      // ต้องตรงกับ Pydantic model
        user_password: password   // ต้องตรงกับ Pydantic model
      })
      console.log('Created user:', response.data)
      alert(`สร้าง user เรียบร้อย: ${response.data.user_name}`)

      // ล้างฟอร์ม
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Error creating user:', error)
      alert('สร้าง user ไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>เพิ่ม User ใหม่</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={createUser} disabled={loading}>
          {loading ? 'กำลังสร้าง...' : 'สร้าง User'}
        </button>
      </div>
    </div>
  )
}

export default App
