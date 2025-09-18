
// ========== App.jsx (เฉพาะ Add User) ==========
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
      const response = await apiClient.post('/api/users', {
        user_name: username,      
        user_password: password   
      })
      
      console.log('Created user:', response.data)
      alert(`สร้าง user เรียบร้อย: ${response.data.user_name}`)

      // ล้างฟอร์ม
      setUsername('')
      setPassword('')
      
    } catch (error) {
      console.error('Error creating user:', error)
      
      if (error.response) {
        // Server ตอบกลับมาแต่ status code ผิด
        alert(`เกิดข้อผิดพลาด: ${error.response.data.detail || 'ไม่สามารถสร้าง user ได้'}`)
      } else if (error.request) {
        // Request ไม่ได้ถูกส่งหรือไม่ได้รับ response
        alert('ไม่สามารถเชื่อมต่อกับ server ได้')
      } else {
        // Error อื่นๆ
        alert('เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>เพิ่ม User ใหม่ Test commit</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button 
          onClick={createUser} 
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'กำลังสร้าง...' : 'สร้าง User'}
        </button>
      </div>
    </div>
  )
}

export default App