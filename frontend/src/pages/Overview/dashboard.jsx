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
      map.setView(center, 17)
      // เลื่อนมุมมองแผนที่ขึ้นเล็กน้อยจากตำแหน่งกึ่งกลางเดิมตอนโหลดหน้าแรก (ปรับตัวเลข 60 ได้ตามต้องการ)
      map.panBy([0, -60], { animate: false })
    }, 100)

    return () => clearTimeout(timer)
  }, [map, center])

  return null
}

// ================== Live stream base ==================
// สำคัญ: ต้องเป็น relative path ผ่าน backend proxy (/api/camera-stream/...)
// ห้ามชี้ไป IP วง LAN ตรง ๆ (http://10.142.1.123:1984/...) เด็ดขาด เพราะเครื่อง
// ที่อยู่นอก LAN (ผ่าน ddns/internet) จะต่อ IP นั้นไม่ติดเลย วิดีโอจะไม่ขึ้น
// backend endpoint /api/camera-stream/{path} จะ proxy ต่อไปยัง go2rtc (10.142.1.123:1984)
// ให้เอง ทั้ง HTTP asset และ WebSocket (ดู camera_stream_proxy.py)
const STREAM_BASE = "/api/camera-stream/stream.html?src="

// ================== Camera groups (by checkpoint location) ==================
// หมายเหตุ: cam_08_big-c-out_c3(2) และ cam_08_big-c-out_c4(2) ใช้เลข 08 ซ้ำกันตามลิสต์ที่ให้มา
// (น่าจะพิมพ์ผิด ตัวหลังควรเป็น cam_09) — แก้ src ด้านล่างให้ตรงถ้ามีการแก้ config จริง
const cameraGroups = {
  siha: [
    { label: "กล้องขาเข้า 1", title: "กล้องขาเข้า 1", cameraName: "cam_01_siha-in_c1(2)", src: `${STREAM_BASE}cam_01_siha-in_c1(2)` },
    { label: "กล้องขาเข้า 2", title: "กล้องขาเข้า 2", cameraName: "cam_02_siha-in_c2(2)", src: `${STREAM_BASE}cam_02_siha-in_c2(2)` },
    { label: "กล้องขาเข้า 3", title: "กล้องขาเข้า 3", cameraName: "cam_03_siha-in_c3(2)", src: `${STREAM_BASE}cam_03_siha-in_c3(2)` },
    { label: "กล้องขาออก 1", title: "กล้องขาออก 1", cameraName: "cam_04_siha-out_c4(2)", src: `${STREAM_BASE}cam_04_siha-out_c4(2)` },
    { label: "กล้องขาออก 2", title: "กล้องขาออก 2", cameraName: "cam_05_siha-out_c5(2)", src: `${STREAM_BASE}cam_05_siha-out_c5(2)` },
    { label: "กล้อง Incident 1", title: "กล้อง Incident 1", cameraName: "cam_10_siha-icd_c1(2)", src: `${STREAM_BASE}cam_10_siha-icd_c1(2)` },
    { label: "กล้อง Incident 2", title: "กล้อง Incident 2", cameraName: "cam_11_siha-icd_c2(2)", src: `${STREAM_BASE}cam_11_siha-icd_c2(2)` },
  ],
  bigc: [
    { label: "กล้องขาเข้า 1", title: "กล้องขาเข้า 1", cameraName: "cam_06_big-c-in_c1(2)", src: `${STREAM_BASE}cam_06_big-c-in_c1(2)` },
    { label: "กล้องขาเข้า 2", title: "กล้องขาเข้า 2", cameraName: "cam_07_big-c-in_c2(2)", src: `${STREAM_BASE}cam_07_big-c-in_c2(2)` },
    { label: "กล้องขาออก 1", title: "กล้องขาออก 1", cameraName: "cam_08_big-c-out_c3(2)", src: `${STREAM_BASE}cam_08_big-c-out_c3(2)` },
    { label: "กล้องขาออก 2", title: "กล้องขาออก 2", cameraName: "cam_08_big-c-out_c4(2)", src: `${STREAM_BASE}cam_08_big-c-out_c4(2)` },
    { label: "กล้อง Incident 1", title: "กล้อง Incident 1", cameraName: "cam_12_big-c-icd_c1(2)", src: `${STREAM_BASE}cam_12_big-c-icd_c1(2)` },
    { label: "กล้อง Incident 2", title: "กล้อง Incident 2", cameraName: "cam_13_big-c-icd_c2(2)", src: `${STREAM_BASE}cam_13_big-c-icd_c2(2)` },
  ],
}

// เลือกกลุ่มกล้องตามชื่อจุดตรวจ (nickname) — ปรับ keyword ตรงนี้ให้ตรงกับข้อมูลจริงจาก API
const getCameraListForCheckpoint = (nickname = "") => {
  const name = nickname.toLowerCase()
  if (name.includes("บิ๊กซี") || name.includes("big")) return cameraGroups.bigc
  if (name.includes("สีห") || name.includes("siha")) return cameraGroups.siha
  return cameraGroups.siha // fallback กรณีไม่ match ชื่อใด ๆ
}

// ================== Camera Popup ==================
function CameraPopup({ cam, selectedCam, cameraList, onCameraChange }) {
  return (
    <div className="w-[380px] bg-[#11161d] text-gray-100 -m-3 p-3 rounded">
      <h3 className="font-semibold mb-2">{selectedCam.title}</h3>

      <div className="text-sm mb-2 space-y-0.5">
        <div><b>ที่ตั้ง:</b> {cam.location}</div>
        <div><b>ชื่อกล้อง:</b> {selectedCam.cameraName}</div>
      </div>

      <div className="relative bg-black rounded overflow-hidden group">
        {/* stream.html เป็น live viewer (go2rtc) ต้องใช้ iframe ไม่ใช่ <video> ตรง ๆ */}
        <iframe
          key={selectedCam.src}
          src={selectedCam.src}
          className="w-full h-[220px] border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

        {/* ปุ่มเปิดสตรีมแบบเต็มจอในแท็บใหม่ */}
        <button
          type="button"
          onClick={() => window.open(selectedCam.src, "_blank", "noopener,noreferrer")}
          title="ดูแบบเต็มจอในแท็บใหม่"
          className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded p-1.5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <select
        className="w-full border border-gray-700 bg-[#1a212b] text-gray-100 rounded p-1 mt-2 text-sm"
        value={selectedCam.src}
        onChange={(e) => {
          const selected = cameraList.find((c) => c.src === e.target.value)
          onCameraChange(selected)
        }}
      >
        {cameraList.map((c) => (
          <option key={c.src} value={c.src}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ================== MAIN ==================
function Overview() {
  const defaultCenter = [13.812657, 100.718611]

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
          parsed.forEach((point, i) => {
            const list = getCameraListForCheckpoint(point.nickname)
            camState[i] = list[0]
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
          zoom={16}
          className="h-full w-full"
          zoomSnap={1}
          fadeAnimation={false}
          preferCanvas={false}
        >
          <MapInitializer center={center} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            className="dark-tiles"
            maxZoom={19}
            minZoom={5}
          />

          {checkpoints.map((point, index) => {
            const cameraList = getCameraListForCheckpoint(point.nickname)
            return (
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
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}

export default Overview