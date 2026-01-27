// src/components/Icon_Incident/relate-accident.jsx
import React from 'react';
import { 
  FaCarCrash,    // ชนทั่วไป
  FaCarSide,     // พลิกคว่ำ/ตะแคง
  FaMotorcycle,  // จยย. ล้ม
  FaAmbulance    // มีผู้บาดเจ็บ (อาจมาจากการแจ้งเหตุด้วยคน)
} from "react-icons/fa";

// Mapping ตามสิ่งที่ AI Detect ได้
const ICONS = {
  default: FaCarCrash,
  crash: FaCarCrash,          // AI: Vehicle Collision
  rollover: FaCarSide,        // AI: Overturned Vehicle
  motorcycle_fall: FaMotorcycle, // AI: Motorcycle Fall
  injury: FaAmbulance         // (Optional) Serious Injury
};

const RelateAccidentIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.55;
  const SelectedIcon = ICONS[variant] || ICONS['default'];

  return (
    <div className={className} style={{
      backgroundColor: '#EF4444', // Red-500
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid white',
      boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
      color: 'white',
      fontSize: `${iconSize}px`
    }}>
      <SelectedIcon />
    </div>
  );
};

export default RelateAccidentIcon;