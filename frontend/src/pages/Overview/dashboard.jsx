import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef } from "react"
import apiClient from "../../service/client"

// ================== Fix Leaflet marker ==================
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// ================== Map Initializer ==================
function MapInitializer({ center }) {
  const map = useMap()

  useEffect(() => {
    if (!center) return
    const timer = setTimeout(() => {
      map.invalidateSize()
      map.setView(center, 16)
    }, 100)

    return () => clearTimeout(timer)
  }, [map, center])

  return null
}

// ================== Camera Popup ==================
function CameraPopup({
  cam,
  selectedCam,
  cameraList,
  onCameraChange,
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [selectedCam.video])

  return (
    <div className="w-[380px]">
      <h3 className="font-semibold mb-2">{selectedCam.title}</h3>

      <div className="text-sm mb-2">
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

      {/* 🔥 Select Camera */}
      <select
        className="w-full border rounded p-1 mt-2 text-sm"
        value={selectedCam.video}
        onChange={(e) => {
          const selected = cameraList.find(
            (c) => c.video === e.target.value
          )
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
    {
      label: "Camera 1",
      title: "Camera 1",
      cameraName: "TF7-KY-1-1-C2",
      video: "/assets/1.mp4",
    },
    {
      label: "Camera 2",
      title: "Camera 2",
      cameraName: "TF7-KY-1-1-C3",
      video: "/assets/2.mp4",
    },
    {
      label: "Camera 3",
      title: "Camera 3",
      cameraName: "TF7-KY-1-1-C4",
      video: "/assets/3.mp4",
    },
    {
      label: "Camera 4",
      title: "Camera 4",
      cameraName: "TF7-KY-1-1-C5",
      video: "/assets/4.mp4",
    },
  ]

  const [checkpoints, setCheckpoints] = useState([])
  const [center, setCenter] = useState(defaultCenter)

  // 🔥 state แยก camera ของแต่ละ checkpoint
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
          const parsed = data.map((p, i) => ({
            ...p,
            latitude: parseFloat(p.latitude),
            longitude: parseFloat(p.longitude),
          }))

          setCheckpoints(parsed)

          // ⭐ center ที่ตัวแรก
          if (parsed.length > 0) {
            setCenter([parsed[0].latitude, parsed[0].longitude])
          }

          // default camera
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

  return (
    <div className="h-screen p-4">
      <h2 className="text-2xl font-semibold mb-2">Overview</h2>

      <div className="h-[calc(100%-3rem)] w-full rounded-lg overflow-hidden shadow">
        <MapContainer center={center} zoom={19} className="h-full w-full">
          <MapInitializer center={center} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🔥 Checkpoint markers */}
          {checkpoints.map((point, index) => (
            <Marker
              key={index}
              position={[point.latitude, point.longitude]}
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