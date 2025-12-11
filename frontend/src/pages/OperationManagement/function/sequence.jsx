import React, { useState, useEffect } from 'react';

// --- Icons (Inline SVGs) ---

const IconWrapper = ({ size = 24, className = "", children }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

const LayoutDashboard = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </IconWrapper>
);

const Car = (props) => (
  <IconWrapper {...props}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </IconWrapper>
);

const Video = (props) => (
  <IconWrapper {...props}>
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </IconWrapper>
);

const AlertTriangle = (props) => (
  <IconWrapper {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </IconWrapper>
);

const Settings = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </IconWrapper>
);

const Search = (props) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </IconWrapper>
);

const Calendar = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </IconWrapper>
);

const MapPin = (props) => (
  <IconWrapper {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </IconWrapper>
);

const MonitorPlay = (props) => (
  <IconWrapper {...props}>
    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
    <polygon points="12 15 17 21 7 21 12 15"></polygon>
    <path d="M10 7l5 3-5 3V7z"></path>
  </IconWrapper>
);

const X = (props) => (
  <IconWrapper {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </IconWrapper>
);

const Plus = (props) => (
  <IconWrapper {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </IconWrapper>
);

const LogOut = (props) => (
  <IconWrapper {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </IconWrapper>
);

const ChevronDown = (props) => (
  <IconWrapper {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </IconWrapper>
);

const User = (props) => (
  <IconWrapper {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </IconWrapper>
);

// --- Mock Components for UI Elements ---

const LicensePlate = ({ text, province, className = "", scale = 1 }) => (
  <div 
    className={`border-2 border-black rounded bg-white flex flex-col items-center justify-center py-1 px-3 shadow-sm ${className}`} 
    style={{ minWidth: `${100 * scale}px`, height: `${50 * scale}px` }}
  >
    <span className="font-bold leading-none text-black" style={{ fontSize: `${1.5 * scale}rem` }}>{text}</span>
    <span className="font-semibold text-black leading-none mt-1" style={{ fontSize: `${0.75 * scale}rem` }}>{province}</span>
  </div>
);

const VideoPlayerPlaceholder = ({ label, className = "", playButtonSize = 64 }) => (
  <div className={`bg-black relative flex items-center justify-center overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
    <div className="z-10 flex flex-col items-center text-white">
      <MonitorPlay size={playButtonSize} className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
      {label && <span className="mt-2 text-xs font-mono text-gray-400">{label}</span>}
    </div>
    {/* Mock video controls */}
    <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-700 rounded overflow-hidden">
      <div className="h-full bg-red-600 w-1/3"></div>
    </div>
  </div>
);

const MapPlaceholder = ({ className = "" }) => (
  <div className={`bg-gray-100 relative overflow-hidden border border-gray-200 ${className}`}>
    {/* Mock Map Grid */}
    <div className="absolute inset-0 opacity-10" 
      style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
    </div>
    {/* Mock Roads */}
    <div className="absolute top-1/2 left-0 w-full h-3 bg-white transform -rotate-12 border-y border-gray-300"></div>
    <div className="absolute top-0 right-1/3 h-full w-4 bg-white border-x border-gray-300"></div>
    <div className="absolute bottom-0 left-1/4 h-full w-3 bg-white border-x border-gray-300 transform rotate-12"></div>
    
    {/* Mock Markers - Sequence Path */}
    <div className="absolute top-1/3 left-1/4 text-red-600 z-10">
       <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center shadow-lg animate-pulse">
         <Car size={16} fill="currentColor" />
       </div>
    </div>
    <div className="absolute bottom-1/4 right-1/3 text-gray-500">
      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center shadow">
         <MapPin size={14} />
      </div>
    </div>
    
    {/* Path Line */}
    <svg className="absolute inset-0 pointer-events-none">
       <line x1="25%" y1="33%" x2="66%" y2="75%" stroke="red" strokeWidth="2" strokeDasharray="4" />
    </svg>

    <div className="absolute bottom-2 left-2 bg-white/90 p-1 text-[10px] text-gray-500 rounded shadow">
      © Sequence Map Data
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, text, active = false, hasSub = false }) => (
  <div className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${active ? 'bg-[#00664F] text-white border-l-4 border-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
    <Icon size={20} />
    <span className="ml-3 text-sm font-medium flex-1">{text}</span>
    {hasSub && <ChevronDown size={14} />}
  </div>
);

const SubMenuItem = ({ text, active = false }) => (
  <div className={`pl-12 py-2 text-sm cursor-pointer ${active ? 'text-[#00BFA5]' : 'text-gray-500 hover:text-gray-300'}`}>
    <div className="flex items-center">
      <div className={`w-1 h-4 mr-2 ${active ? 'bg-[#00BFA5]' : 'bg-transparent'}`}></div>
      {text}
    </div>
  </div>
);

// --- Main Application Component ---

export default function TrafficDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalType, setModalType] = useState(null); // 'angles', 'add', or null

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return `วัน${days[date.getDay()]}ที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // --- Modals ---

  const ViewAnglesModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">ข้อมูลเพิ่มเติม</h2>
          <button onClick={() => setModalType(null)} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-gray-50">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Video (Left - Spans 2 cols) */}
            <div className="lg:col-span-2 bg-black rounded-lg overflow-hidden shadow-lg aspect-video relative border border-gray-800">
              <VideoPlayerPlaceholder label="Main Feed: CAM-001" playButtonSize={80} className="h-full w-full" />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs rounded shadow font-semibold">
                 Image ตรวจพบ Blacklist
              </div>
            </div>

            {/* Info Panel (Right) - Updated Layout for Modal */}
            <div className="bg-white p-4 rounded-lg shadow border flex flex-col gap-4">
              {/* License Plate Centered */}
              <div className="flex justify-center py-2 border-b border-gray-100 pb-4">
                <LicensePlate text="5ขจ-8765" province="ปทุมธานี" scale={1.2} />
              </div>
              
              <div className="flex gap-4 h-full">
                {/* Text Details Column */}
                <div className="space-y-3 text-sm flex-1">
                  <div className="flex flex-col border-b border-dashed pb-2">
                    <span className="text-gray-500 text-xs flex items-center gap-2"><Car size={12}/> ทะเบียน :</span>
                    <span className="font-semibold pl-5">กข 1234</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-2">
                    <span className="text-gray-500 text-xs flex items-center gap-2"><Settings size={12}/> รุ่น / สี :</span>
                    <span className="font-semibold pl-5">Honda / ดำ</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-2">
                    <span className="text-gray-500 text-xs flex items-center gap-2"><Car size={12}/> ประเภทรถ :</span>
                    <span className="font-semibold pl-5">กระบะ</span>
                  </div>
                  <div className="flex flex-col border-b border-dashed pb-2">
                    <span className="text-gray-500 text-xs flex items-center gap-2"><Video size={12}/> กล้อง :</span>
                    <span className="font-semibold pl-5 text-green-600">CAM-001</span>
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className="text-gray-500 text-xs flex items-center gap-2"><MapPin size={12}/> สถานที่ :</span>
                    <span className="font-semibold pl-5">สี่แยกราชดำเนิน</span>
                  </div>
                </div>

                {/* Snapshot Image Column */}
                <div className="w-1/2 bg-gray-200 rounded relative overflow-hidden self-stretch border border-gray-300">
                   <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                      <Car size={32} className="mb-1 opacity-50"/>
                      <br/>Snapshot
                   </div>
                   {/* Placeholder for actual image */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="bg-white p-2 rounded shadow flex items-center gap-4 border border-gray-200">
             <button className="text-gray-600 hover:text-black"><MonitorPlay size={20}/></button>
             <div className="flex-1 h-2 bg-gray-200 rounded-full relative cursor-pointer group">
               <div className="absolute top-0 left-0 h-full bg-green-500 w-1/4 rounded-full"></div>
               <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white border-2 border-green-600 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow group-hover:scale-125 transition-transform"></div>
             </div>
             <span className="text-xs text-gray-500 font-mono">00:22 / 05:00</span>
          </div>

          {/* Bottom Grid: 4 Angles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-black relative group cursor-pointer">
                   <VideoPlayerPlaceholder className="w-full h-full" playButtonSize={32} />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <div className="p-3 bg-white border-t text-xs space-y-1">
                   <div className="flex justify-between items-center">
                     <span className="text-gray-500 font-semibold flex items-center gap-1"><Video size={12}/> กล้อง :</span>
                     <span className="font-mono bg-gray-100 px-1 rounded">CAM-00{id}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-500 font-semibold flex items-center gap-1"><MapPin size={12}/> สถานที่ :</span>
                     <span>สี่แยกราชดำเนิน</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );

  const AddBlacklistModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-bold">เพิ่มรถเข้ารายการบัญชีดำ</h2>
          <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Column: Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เพิ่มป้ายทะเบียน :</label>
                <input type="text" placeholder="ระบุป้ายทะเบียน..." className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none text-sm transition-shadow shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ประเภทรถ :</label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded px-4 py-2.5 appearance-none bg-white focus:ring-2 focus:ring-green-500 outline-none text-gray-500 text-sm shadow-sm">
                    <option>เลือกประเภทรถ...</option>
                    <option>รถยนต์นั่งส่วนบุคคล</option>
                    <option>รถกระบะ</option>
                    <option>รถจักรยานยนต์</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16}/>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-2">ยี่ห้อ :</label>
                   <div className="relative">
                    <select className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm appearance-none bg-white text-gray-500 shadow-sm"><option>เลือกยี่ห้อ...</option></select>
                    <ChevronDown className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" size={14}/>
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-2">รุ่น :</label>
                   <div className="relative">
                    <select className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm appearance-none bg-white text-gray-500 shadow-sm"><option>เลือกรุ่น...</option></select>
                    <ChevronDown className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" size={14}/>
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-2">สี :</label>
                   <div className="relative">
                    <select className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm appearance-none bg-white text-gray-500 shadow-sm"><option>เลือกสี...</option></select>
                    <ChevronDown className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" size={14}/>
                   </div>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">แนบรูป/วิดีโอหลักฐาน :</label>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors group">
                    <div className="bg-white rounded-full p-3 shadow mb-2 group-hover:scale-110 transition-transform">
                       <Plus size={24} className="text-gray-400 group-hover:text-green-500"/>
                    </div>
                    <span className="text-xs">คลิกเพื่ออัปโหลด</span>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เหตุผลการเพิ่มบัญชีดำ :</label>
                <textarea rows={4} className="w-full border border-gray-300 rounded px-4 py-2.5 resize-none focus:ring-2 focus:ring-green-500 outline-none text-sm shadow-sm"></textarea>
              </div>

            </div>

            {/* Right Column: Map */}
            <div className="space-y-5 flex flex-col">
               <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">สถานที่ตรวจพบ :</label>
                  <div className="flex-1 rounded-lg border border-gray-300 overflow-hidden relative min-h-[300px] shadow-sm">
                     <MapPlaceholder className="w-full h-full" />
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="transform -translate-y-1/2">
                           <MapPin size={48} className="text-red-600 drop-shadow-lg" fill="currentColor" />
                        </div>
                     </div>
                     {/* Map Controls */}
                     <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <div className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50"><Plus size={16}/></div>
                        <div className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50"><div className="w-4 h-0.5 bg-black"></div></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
             <button className="bg-[#00E676] hover:bg-[#00C853] text-white font-bold py-4 rounded shadow-lg transition-colors text-lg uppercase tracking-wide">
                บันทึกข้อมูล
             </button>
             <button onClick={() => setModalType(null)} className="bg-[#FF1744] hover:bg-[#D50000] text-white font-bold py-4 rounded shadow-lg transition-colors text-lg uppercase tracking-wide">
                ยกเลิกการเพิ่มบัญชี
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E2933] flex flex-col text-gray-300 shadow-xl z-20 hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-700 bg-[#151e25]">
           <div className="flex items-center gap-2 text-white font-bold text-xl">
             <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">★</div>
             <span className="tracking-wide">LOGO</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
           <SidebarItem icon={LayoutDashboard} text="Overview" />
           <SidebarItem icon={Settings} text="Traffic Enforcement" />
           <SidebarItem icon={Settings} text="Traffic Data Collection" />
           
           <div className="mt-1 mb-1">
             <SidebarItem icon={Settings} text="Traffic Operation Management" active={true} hasSub={true} />
             <div className="bg-[#151e25] py-2">
               <SubMenuItem text="Dashboard" active={true} />
               <SubMenuItem text="Function" />
             </div>
           </div>

           <SidebarItem icon={AlertTriangle} text="Incident & Accident" />
           <SidebarItem icon={Settings} text="Configuration" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F3F4F6]">
        
        {/* Header */}
        <header className="h-16 bg-[#00664F] text-white flex items-center justify-between px-6 shadow-md z-10 shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-white rounded-full text-[#00664F]">
                <Settings size={20} />
             </div>
             <div>
                <h1 className="text-lg font-bold leading-tight">Sequence</h1>
                <p className="text-[10px] opacity-80 font-light">ระบบติดตามยานพาหนะที่ติดบัญชีดำ</p>
             </div>
          </div>

          <div className="flex items-center gap-6 text-right">
             <div>
                <div className="text-xl font-mono font-bold leading-none tracking-tight">{formatTime(currentTime)}</div>
                <div className="text-xs opacity-90">{formatDate(currentTime)}</div>
             </div>
             <div className="flex items-center gap-2 text-sm border-l border-white/20 pl-4 h-10">
                <span className="font-semibold">TastID@1234</span>
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                   <User size={18} />
                </div>
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Search Bar */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2 border-gray-100">
                <Search size={20} className="text-gray-500" />
                <span className="font-bold text-lg">ค้นหาจุดติดตั้งสัญญาณไฟจราจร</span>
             </div>
             <div className="flex flex-wrap gap-4 items-center">
                <input type="text" placeholder="ค้นหาป้ายจราจร..." className="border border-gray-300 rounded px-4 py-2 text-sm w-72 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-green-500 outline-none transition-colors" />
                <div className="relative">
                   <input type="text" placeholder="เลือกประเภทรถ" className="border border-gray-300 rounded px-4 py-2 text-sm w-56 bg-gray-50 focus:bg-white outline-none" />
                   <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16}/>
                </div>
                <div className="relative">
                   <input type="text" placeholder="เลือก วัน-เดือน-ปี..." className="border border-gray-300 rounded px-4 py-2 text-sm w-56 bg-gray-50 focus:bg-white outline-none" />
                   <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16}/>
                </div>
                <div className="flex-1 flex justify-end">
                   <button className="bg-[#00664F] hover:bg-[#004d3b] text-white px-8 py-2 rounded text-sm font-bold shadow transition-colors">ค้นหา</button>
                </div>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col rounded-lg overflow-hidden shadow border border-gray-200 bg-white">
            
            {/* Black Strip Header */}
            <div 
                onClick={() => setModalType('add')}
                className="bg-black text-white px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-900 transition-colors"
            >
                <span className="font-bold text-lg">เพิ่มบัญชีดำ</span>
                <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                    <Plus size={14} />
                    <span>คลิกเพื่อเพิ่มข้อมูล</span>
                </div>
            </div>

            {/* Split View Content */}
            <div className="p-5 min-h-[550px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    
                    {/* Left: Detail & Main Player */}
                    <div className="flex flex-col gap-4 relative">
                        {/* Red Alert Header */}
                        <div className="bg-red-50 border border-red-200 rounded p-3 flex justify-between items-center text-red-700 text-sm shadow-sm">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={18} fill="currentColor" className="text-red-600"/>
                                <span className="font-bold">ตรวจสอบ กข1234</span>
                            </div>
                            <span className="flex items-center gap-1 font-mono text-xs bg-white px-2 py-0.5 rounded border border-red-100">
                                <MonitorPlay size={12}/> เห็นล่าสุด : 09:45 น.
                            </span>
                        </div>

                        {/* Main Player */}
                        <div className="bg-black rounded-lg aspect-video w-full overflow-hidden shadow-md relative group">
                            <VideoPlayerPlaceholder className="w-full h-full" playButtonSize={64} />
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded animate-pulse">LIVE</div>
                        </div>

                        {/* Vehicle Info Row */}
                        <div className="flex gap-4 items-stretch">
                            {/* Text Details */}
                            <div className="flex-1 bg-gray-50 rounded p-3 border border-gray-100 text-sm text-gray-600 space-y-1.5 shadow-sm">
                                <div className="flex items-center gap-2 border-b border-dashed border-gray-200 pb-1">
                                    <Car size={14} className="text-yellow-600"/> 
                                    <span className="text-xs text-gray-500">ทะเบียน :</span> 
                                    <span className="font-bold text-gray-800">กข 1234</span>
                                </div>
                                <div className="flex items-center gap-2 border-b border-dashed border-gray-200 pb-1">
                                    <Video size={14} className="text-yellow-600"/> 
                                    <span className="text-xs text-gray-500">กล้อง :</span>
                                    <span className="font-bold text-gray-800">CAM-001</span>
                                </div>
                                <div className="flex items-center gap-2 border-b border-dashed border-gray-200 pb-1">
                                    <MapPin size={14} className="text-yellow-600"/> 
                                    <span className="text-xs text-gray-500">สถานที่ :</span>
                                    <span className="font-bold text-gray-800">สี่แยกราชดำเนิน</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-purple-600"/> 
                                    <span className="text-xs text-gray-500">จุดที่ผ่าน :</span>
                                    <span className="font-bold text-purple-700">3 ตำแหน่ง</span>
                                </div>
                                
                                <button 
                                    onClick={() => setModalType('angles')}
                                    className="mt-2 w-full border border-gray-300 bg-white rounded px-2 py-1.5 text-xs font-semibold hover:bg-gray-50 hover:text-green-700 hover:border-green-300 transition-all shadow-sm"
                                >
                                    ดูวิดีโอมุมอื่นเพิ่มเติม
                                </button>
                            </div>

                            {/* License Plate Graphic */}
                            <div className="flex flex-col justify-center">
                                <LicensePlate text="5ขจ-8765" province="ปทุมธานี" className="shadow-md" scale={1.2} />
                            </div>
                        </div>

                        {/* Red Reason Footer - Sticky bottom of left col */}
                        <div className="mt-auto bg-[#FFCDD2] text-[#B71C1C] px-4 py-3 rounded text-sm font-bold text-center border border-[#EF9A9A] shadow-sm">
                            เหตุผล : หลบหนีคดีอาญา
                        </div>
                    </div>

                    {/* Right: Map */}
                    <div className="bg-gray-100 rounded-lg border border-gray-300 flex flex-col h-full relative overflow-hidden min-h-[400px] shadow-inner">
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-bold text-gray-700 bg-white/90 backdrop-blur px-3 py-1.5 rounded shadow border border-gray-200">
                            <Settings size={18} className="text-red-600"/> Sequence
                        </div>
                        
                        <MapPlaceholder className="w-full h-full" />
                        
                        {/* Overlay Floating Video on Map */}
                        <div className="absolute top-20 right-5 w-56 bg-white p-2.5 rounded-lg shadow-xl z-20 border border-gray-200">
                            <div className="bg-black aspect-video mb-2 relative flex items-center justify-center rounded overflow-hidden">
                                <div className="absolute top-1 left-1 text-[8px] bg-black/50 text-white px-1">CAM-001</div>
                                <MonitorPlay size={24} className="text-white opacity-80" />
                            </div>
                            <div className="text-[10px] space-y-1 font-medium text-gray-600">
                                <div className="flex justify-between border-b border-gray-100 pb-0.5"><span className="text-yellow-600">ทะเบียน:</span> <span>กข 1234</span></div>
                                <div className="flex justify-between border-b border-gray-100 pb-0.5"><span className="text-yellow-600">กล้อง:</span> <span>CAM-001</span></div>
                                <div className="flex justify-between pt-0.5"><span className="text-red-600 font-bold">สถานะ:</span> <span className="text-red-600 bg-red-50 px-1 rounded">พบคดี</span></div>
                            </div>
                            {/* Connector Triangle */}
                            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
                        </div>
                        {/* Connecting line to marker */}
                        <div className="absolute top-[160px] right-[130px] w-0.5 h-20 bg-red-500/50 border-l border-dashed border-red-600 transform rotate-12 origin-top"></div>
                    </div>
                </div>
            </div>
          </div>

          {/* Blacklist Table */}
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 border-l-4 border-green-600 pl-3">รายการบัญชีดำ (7 รายการ)</h3>
                <button className="flex items-center gap-2 border border-gray-300 px-4 py-1.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                   <LogOut size={14} /> ส่งออก
                </button>
             </div>

             <div className="space-y-2.5">
                {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                   <div key={index} className="bg-gray-50 rounded border border-gray-200 p-2 pl-4 flex flex-wrap items-center justify-between gap-4 text-xs hover:bg-white hover:shadow-md hover:border-green-200 transition-all cursor-pointer group">
                      
                      {/* Left Block: Plate Graphic + Info */}
                      <div className="flex items-center gap-4 w-1/3">
                         <LicensePlate text={`กข-${1234 + index}`} province="กทม" scale={0.6} className="bg-white border-gray-300 shadow-none group-hover:border-black transition-colors" />
                         
                         <div className="flex flex-col gap-1">
                            <span className="bg-gray-200 px-2 py-0.5 rounded text-[9px] w-fit text-gray-600">รถยนต์</span>
                            <div className="flex items-center gap-1 font-bold text-gray-700 text-sm">
                                <Car size={14} className="text-yellow-600"/> ทะเบียน : กข 1234
                            </div>
                         </div>
                      </div>

                      {/* Middle Data */}
                      <div className="flex flex-1 justify-around text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5 w-32">
                            <Video size={14} className="text-yellow-600"/> กล้อง : CAM-001
                        </div>
                        <div className="flex items-center gap-1.5 w-40">
                            <MapPin size={14} className="text-yellow-600"/> สถานที่ : สี่แยกราชดำเนิน
                        </div>
                        <div className="flex items-center gap-1.5 w-32">
                            <AlertTriangle size={14} className="text-purple-600"/> จุดที่ผ่าน : 3 ตำแหน่ง
                        </div>
                      </div>
                      
                      {/* Right Block: Time & Actions */}
                      <div className="flex items-center gap-4 ml-auto text-gray-400 pl-4 border-l border-gray-200">
                         <span className="font-mono text-gray-500">23-07-2568 : 09:30</span>
                         <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-blue-50 rounded text-blue-400 hover:text-blue-600 transition-colors"><Video size={16} /></button>
                            <button className="p-1.5 hover:bg-green-50 rounded text-green-400 hover:text-green-600 transition-colors"><Car size={16} /></button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </main>

      {/* Modals Container */}
      {modalType === 'angles' && <ViewAnglesModal />}
      {modalType === 'add' && <AddBlacklistModal />}

    </div>
  );
}