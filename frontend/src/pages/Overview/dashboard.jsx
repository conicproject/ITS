import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef, useMemo } from "react"
import apiClient from "../../service/client"

// ================== Fix Leaflet marker (not used anymore, custom icons below) ==================
delete L.Icon.Default.prototype._getIconUrl

// ================== Custom status icons ==================
const createStatusIcon = (status) => {
  const isOnline = status === "online" || status === undefined
  const color = isOnline ? "#22b8e0" : "#8a8f98"

  return L.divIcon({
    className: "custom-checkpoint-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C9.4 2 4 7.4 4 14c0 9 12 16 12 16s12-7 12-16c0-6.6-5.4-12-12-12z"
                fill="${color}" stroke="#0d1117" stroke-width="1.5"/>
          <circle cx="16" cy="14" r="5.5" fill="#0d1117"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -28],
  })
}

// ================== Map Initializer ==================
function MapInitializer({ center }) {
  const map = useMap()

  useEffect(() => {
    if (!center) return
    const timer = setTimeout(() => {
      map.invalidateSize()
      map.setView(center, 13)
    }, 100)

    return () => clearTimeout(timer)
  }, [map, center])

  return null
}

// ================== Camera Popup ==================
function CameraPopup({ cam, selectedCam, cameraList, onCameraChange }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [selectedCam.video])

  return (
    <div className="w-[380px] bg-[#11161d] text-gray-100 -m-3 p-3 rounded">
      <h3 className="font-semibold mb-2">{selectedCam.title}</h3>

      <div className="text-sm mb-2 space-y-0.5">
        <div><b>ที่ตั้ง:</b> {cam.location}</div>
        <div><b>ชื่อกล้อง:</b> {selectedCam.cameraName}</div>
      </div>

      <div className="bg-black rounded overflow-hidden">
        <video
          ref={videoRef}
          src={selectedCam.video}
          controls
          autoPlay
          muted
          playsInline
          className="w-full h-[220px]"
        />
      </div>

      <select
        className="w-full border border-gray-700 bg-[#1a212b] text-gray-100 rounded p-1 mt-2 text-sm"
        value={selectedCam.video}
        onChange={(e) => {
          const selected = cameraList.find((c) => c.video === e.target.value)
          onCameraChange(selected)
        }}
      >
        {cameraList.map((c) => (
          <option key={c.video} value={c.video}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ================== MAIN ==================
function Overview() {
  const defaultCenter = [13.812657, 100.717611]

  // ================== Camera List ==================
  const cameraList = [
    { label: "Camera 1", title: "Camera 1", cameraName: "TF7-KY-1-1-C2", video: "/assets/1.mp4" },
    { label: "Camera 2", title: "Camera 2", cameraName: "TF7-KY-1-1-C3", video: "/assets/2.mp4" },
    { label: "Camera 3", title: "Camera 3", cameraName: "TF7-KY-1-1-C4", video: "/assets/3.mp4" },
    { label: "Camera 4", title: "Camera 4", cameraName: "TF7-KY-1-1-C5", video: "/assets/4.mp4" },
  ]

  const [checkpoints, setCheckpoints] = useState([])
  const [center, setCenter] = useState(defaultCenter)
  const [checkpointCamera, setCheckpointCamera] = useState({})

  // ================== Fetch checkpoint ==================
  useEffect(() => {
    const fetchCheckpoint = async () => {
      try {
        const res = await apiClient.get("/api/checkpoint")
        let data = res.data

        if (!Array.isArray(data) && Array.isArray(data.data)) {
          data = data.data
        }

        if (Array.isArray(data)) {
          const parsed = data.map((p) => ({
            ...p,
            latitude: parseFloat(p.latitude),
            longitude: parseFloat(p.longitude),
          }))

          setCheckpoints(parsed)

          if (parsed.length > 0) {
            setCenter([parsed[0].latitude, parsed[0].longitude])
          }

          const camState = {}
          parsed.forEach((_, i) => {
            camState[i] = cameraList[0]
          })
          setCheckpointCamera(camState)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchCheckpoint()
  }, [])

  // ================== Stats ==================
  const onlineCount = useMemo(
    () => checkpoints.filter((c) => c.status === "online" || c.status === undefined).length,
    [checkpoints]
  )
  const offlineCount = checkpoints.length - onlineCount

  return (
    <div className="h-screen w-full bg-[#0a0e14] flex flex-col p-4 gap-4">
      {/* ================== Header ================== */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] border border-gray-800 rounded-lg shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">
            แผนที่จุดติดตั้งกล้องและจุดตรวจ
          </h2>
          <p className="text-xs text-gray-400">
            กรุงเทพมหานคร · แสดงตำแหน่งจุดติดตั้งทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22b8e0]" />
            ออนไลน์
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
            ปิด/ปรับปรุง
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {checkpoints.length} จุดติดตั้ง
          </div>
        </div>
      </div>

      {/* ================== Map ================== */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-gray-800">
        <MapContainer
          center={center}
          zoom={13}
          className="h-full w-full"
          zoomSnap={1}
          fadeAnimation={false}
          preferCanvas={false}
        >
          <MapInitializer center={center} />

          {/*
            ใช้ OpenStreetMap มาตรฐาน (ฟรี ไม่ต้องขอ key ครอบคลุมถนนในไทยเต็ม)
            แล้วใส่ className="dark-tiles" เพื่อกลับสีเป็น dark mode ด้วย CSS filter
            (ดู .dark-tiles ใน map-fix.css)
            เหตุผลที่เปลี่ยนจาก Esri Dark Gray Canvas: ตัวนั้นไม่มีข้อมูลถนนละเอียด
            ในโซนเอเชียตะวันออกเฉียงใต้ ทำให้แผนที่ในไทยว่างเปล่า ไม่เห็นเส้นทาง
          */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            className="dark-tiles"
            maxZoom={19}
            minZoom={5}
          />

          {checkpoints.map((point, index) => (
            <Marker
              key={index}
              position={[point.latitude, point.longitude]}
              icon={createStatusIcon(point.status)}
            >
              <Popup maxWidth={420}>
                <CameraPopup
                  cam={{ location: point.nickname }}
                  selectedCam={checkpointCamera[index] || cameraList[0]}
                  cameraList={cameraList}
                  onCameraChange={(selected) =>
                    setCheckpointCamera((prev) => ({
                      ...prev,
                      [index]: selected,
                    }))
                  }
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default Overview