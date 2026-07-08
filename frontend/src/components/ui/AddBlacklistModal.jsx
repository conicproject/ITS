import React, { useState, useRef } from 'react';
import { 
  X, Plus, MapPin, Image as ImageIcon, 
  Car, AlertTriangle, FileText, Save, Ban, UploadCloud, Monitor
} from 'lucide-react';

const AddBlacklistModal = ({ onClose }) => {
  // --- State สำหรับเก็บข้อมูล Form ---
  const [formData, setFormData] = useState({
    plate: '',
    province: '',
    type: 'sedan',
    brand: '',
    model: '',
    color: '',
    reason: ''
  });

  // State สำหรับรูปภาพตัวอย่าง
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // State สำหรับจำลองการปักหมุดแผนที่
  const [locationPinned, setLocationPinned] = useState(false);

  // --- Functions ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", { ...formData, locationPinned, previewImage });
    // เรียก API ตรงนี้
    alert("บันทึกข้อมูลเรียบร้อย");
    onClose();
  };

  return (
    // 1. Backdrop: ใช้สีดำจางๆ (Black/50) เพื่อให้ Modal สีขาวเด่นขึ้นมา
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* 2. Modal Container: White Theme */}
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 font-sans">
        
        {/* Header */}
        <div className="border-b border-slate-200 py-4 px-6 flex justify-between items-center shrink-0 shadow-sm relative z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                    <AlertTriangle className="text-red-600" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">เพิ่มบัญชีดำ (Blacklist)</h2>
                    <p className="text-slate-500 text-xs">ระบบติดตามและเฝ้าระวังยานพาหนะต้องสงสัย</p>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all"
            >
                <X size={24} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* --- Left Column: Inputs (7 cols) --- */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: ข้อมูลรถ */}
              <div className="p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <Car size={18} className="text-blue-600"/> ข้อมูลยานพาหนะ
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* License Plate */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">เลขทะเบียน <span className="text-red-500">*</span></label>
                        <input
                            name="plate"
                            value={formData.plate}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="เช่น 1กข 1234"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Province */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">จังหวัด</label>
                        <select 
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
                        >
                            <option value="">เลือกจังหวัด...</option>
                            <option value="Bangkok">กรุงเทพมหานคร</option>
                            <option value="Chiang Mai">เชียงใหม่</option>
                            <option value="Khon Kaen">ขอนแก่น</option>
                        </select>
                    </div>

                    {/* Brand/Model/Color */}
                    <div className="col-span-2 grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">ยี่ห้อ</label>
                            <input 
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="Honda..." 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">รุ่น</label>
                            <input 
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="Civic..." 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">สี</label>
                            <select 
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                            >
                                <option value="">เลือก...</option>
                                <option value="Black">ดำ</option>
                                <option value="White">ขาว</option>
                                <option value="Grey">เทา</option>
                                <option value="Red">แดง</option>
                            </select>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Card 2: Reason */}
              <div className="p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <FileText size={18} className="text-amber-500"/> รายละเอียด
                 </h3>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">เหตุผล / พฤติการณ์</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none h-24 resize-none placeholder:text-slate-400"
                        placeholder="ระบุพฤติการณ์ หรือสาเหตุที่ต้องเฝ้าระวัง..."
                    ></textarea>
                 </div>
              </div>
            </div>

            {/* --- Right Column: Visuals (5 cols) --- */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Map Section */}
              <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[280px]">
                 <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Monitor size={14} className="text-slate-500"/> จุดที่ตรวจพบ (Last Location)
                    </span>
                    {locationPinned && <span className="text-xs text-green-600 font-medium">Selected</span>}
                 </div>

                {/* Simulated Light Map Background */}
                <div 
                    onClick={() => setLocationPinned(true)}
                    className="flex-1 bg-slate-100 w-full h-full relative cursor-crosshair group overflow-hidden"
                >   
                    {/* Map Pattern Overlay (Light) */}
                    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')]"></div>
                    
                    {/* Roads/Grid Simulation */}
                    <div className="absolute top-[30%] left-0 w-full h-2 bg-slate-300/50 transform -rotate-6"></div>
                    <div className="absolute top-0 right-[40%] h-full w-2 bg-slate-300/50 transform rotate-12"></div>

                    {locationPinned ? (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                             <MapPin size={36} className="text-red-600 fill-red-600 drop-shadow-md" />
                             <div className="w-8 h-2 bg-black/20 rounded-[100%] absolute -bottom-1 left-1 blur-sm animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-600 group-hover:scale-105 transition-transform">
                                คลิกเพื่อปักหมุด
                            </span>
                        </div>
                    )}
                </div>
              </div>

              {/* Upload Section */}
              <div className="rounded-xl border border-slate-200 shadow-sm p-1">
                <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg h-44 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group relative overflow-hidden bg-slate-50/50"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                    
                    {previewImage ? (
                        <div className="relative w-full h-full">
                            <img src={previewImage} alt="Preview" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium flex items-center gap-2">
                                    <ImageIcon size={16}/> เปลี่ยนรูปภาพ
                                </span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-3 rounded-full shadow-sm mb-3 group-hover:shadow-md group-hover:scale-110 transition-all">
                                <UploadCloud className="text-slate-400 group-hover:text-blue-600" size={28} />
                            </div>
                            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">อัปโหลดหลักฐาน</p>
                            <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG, MP4</p>
                        </>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                 <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                 >
                    <Save size={18} /> บันทึกบัญชีดำ
                 </button>
                 <button 
                    type="button"
                    onClick={onClose}
                    className="w-full border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-semibold py-2.5 px-4 rounded-lg transition-all"
                 >
                    ยกเลิก
                 </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddBlacklistModal;