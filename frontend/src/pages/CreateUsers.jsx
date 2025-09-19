import { useState } from "react"
import apiClient from "../service/client"
import { TextInput, Button, Box, Heading } from "@primer/react"

function CreateUsers() {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const createUser = async () => {
    if (!username || !password) return alert("กรุณากรอก username และ password")
    setLoading(true)
    try {
      const { data } = await apiClient.post("/api/users", {
        user_name: username,
        user_password: password,
      })
      alert(`สร้าง user เรียบร้อย: ${data.user_name}`)
      setUsername("")
      setPassword("")
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.request ? "ไม่สามารถเชื่อมต่อ server" : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ")
      alert(msg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box p={3}>
      <Heading>เพิ่ม User ใหม่</Heading>
      <Box mt={3} display="flex" alignItems="center">
        <TextInput
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button onClick={createUser} disabled={loading} variant="primary">
          {loading ? "กำลังสร้าง..." : "สร้าง User"}
        </Button>
      </Box>
    </Box>
  )
}

export default CreateUsers
