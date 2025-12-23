import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef } from "react"

// ================== Fix Leaflet marker icon ==================
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// ================== Map Initializer Component ==================
function MapInitializer({ center }) {
  const map = useMap()

  useEffect(() => {
    // Force map to invalidate size and set view when component mounts
    const timer = setTimeout(() => {
      map.invalidateSize()
      map.setView(center, map.getZoom())
    }, 100)

    return () => clearTimeout(timer)
  }, [map, center])

  return null
}

// ================== Camera Popup Component ==================
function CameraPopup({ cam, selectedMainburiCam, mainburiCameras, onCameraChange }) {
  const videoRef = useRef(null)
  const [popupKey, setPopupKey] = useState(0)

  // Force video to play whenever popup renders
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch((err) => {
          console.log("Auto-play prevented:", err)
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [popupKey, cam.isSelectable ? selectedMainburiCam.video : cam.video])

  const videoSrc = cam.isSelectable ? selectedMainburiCam.video : cam.video

  return (
    <div className="w-[380px]">
      <h3 className="font-semibold mb-2">
        {cam.isSelectable ? selectedMainburiCam.title : cam.title}
      </h3>

      <div className="text-sm mb-2">
        <div>
          <b>ที่ตั้ง:</b> {cam.location}
        </div>
        <div>
          <b>ชื่อกล้อง:</b>{" "}
          {cam.isSelectable ? selectedMainburiCam.cameraName : cam.cameraName}
        </div>
      </div>

      {/* ================== Video ================== */}
      <div className="bg-black rounded overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          autoPlay
          muted
          playsInline
          className="w-full h-[220px]"
        />
      </div>
      <br />
      
      {/* ================== Select (Camera 0 only) ================== */}
      {cam.isSelectable && (
        <select
          className="w-full border rounded p-1 mb-2 text-sm"
          value={selectedMainburiCam.video}
          onChange={(e) => {
            const selected = mainburiCameras.find(
              (c) => c.video === e.target.value
            )
            onCameraChange(selected)
            setPopupKey(prev => prev + 1) // Force re-render
          }}
        >
          <option value="/assets/mainburi.mp4">Camera 0</option>
          {mainburiCameras.map((c) => (
            <option key={c.video} value={c.video}>
              {c.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

// ================== Mainburi Default ==================
const MAINBURI_DEFAULT = {
  title: "Camera 0",
  cameraName: "TF7-KY-1-1-C0",
  video: "/assets/mainburi.mp4",
}

function Overview() {
  // ================== Map center ==================
  const center = [13.812657, 100.717611]

  // ================== Mainburi selectable cameras ==================
  const mainburiCameras = [
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

  // ================== Selected Mainburi Camera ==================
  const [selectedMainburiCam, setSelectedMainburiCam] = useState(
    MAINBURI_DEFAULT
  )

  // ================== All camera markers ==================
  const cameras = [
    {
      id: "Camera 0",
      position: [13.812657, 100.717611],
      title: "Camera 0",
      location: "แยกมีนบุรี",
      isSelectable: true,
    },
    {
      id: 1,
      position: [13.813343, 100.718194],
      title: "Camera 1",
      location: "แยกมีนบุรี",
      cameraName: "CAM-01",
      video: "/assets/1.mp4",
    },
    {
      id: 2,
      position: [13.812528, 100.718307],
      title: "Camera 2",
      location: "แยกมีนบุรี",
      cameraName: "CAM-02",
      video: "/assets/2.mp4",
    },
    {
      id: 3,
      position: [13.812129, 100.717101],
      title: "Camera 3",
      location: "แยกมีนบุรี",
      cameraName: "CAM-03",
      video: "/assets/3.mp4",
    },
    {
      id: 4,
      position: [13.812865, 100.717024],
      title: "Camera 4",
      location: "แยกมีนบุรี",
      cameraName: "CAM-04",
      video: "/assets/4.mp4",
    },
  ]

  return (
    <div className="h-screen p-4">
      <h2 className="text-2xl font-semibold mb-2">Overview</h2>

      <div className="h-[calc(100%-3rem)] w-full rounded-lg overflow-hidden shadow">
        <MapContainer
          center={center}
          zoom={20}
          className="h-full w-full"
          key="overview-map"
        >
          <MapInitializer center={center} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {cameras.map((cam) => {
            const markerRef = useRef(null)
            
            return (
              <Marker 
                key={cam.id} 
                position={cam.position}
                eventHandlers={{
                  popupopen: () => {
                    // Force video refresh when popup opens
                    setTimeout(() => {
                      const videos = document.querySelectorAll('.leaflet-popup video')
                      videos.forEach(video => {
                        video.currentTime = 0
                        video.play().catch(err => console.log("Play prevented:", err))
                      })
                    }, 100)
                  }
                }}
              >
                <Popup maxWidth={420}>
                  <CameraPopup
                    cam={cam}
                    selectedMainburiCam={selectedMainburiCam}
                    mainburiCameras={mainburiCameras}
                    onCameraChange={(selected) => 
                      setSelectedMainburiCam(selected ?? MAINBURI_DEFAULT)
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
