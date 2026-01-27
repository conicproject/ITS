// src/components/Icon_Incident/special-event.jsx
import React from 'react';
import { 
  FaFlag,          // กิจกรรมทั่วไป (Default)
  FaUsers,         // ฝูงชน/รวมตัว (Crowd)
  FaBullhorn,      // ประท้วง/ม็อบ (Protest)
  FaFistRaised,    // ทะเลาะวิวาท/จลาจล (Violence)
  FaRunning,       // วิ่งหนี/ตื่นตระหนก (Panic)
  FaWalking        // เดินขบวน/พาเหรด (Procession)
} from "react-icons/fa";

// Mapping ตามพฤติกรรมมนุษย์ที่ AI ตรวจจับได้
const ICONS = {
  default: FaFlag,
  crowd: FaUsers,           // AI: Crowd Density / Gathering
  protest: FaBullhorn,      // AI: Protest / Banner Detection
  violence: FaFistRaised,   // AI: Fighting / Aggressive Behavior
  panic: FaRunning,         // AI: Panic / Rapid Movement
  procession: FaWalking     // AI: People Walking on Road (Group)
};

const SpecialEventIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];

  return (
    <div className={className} style={{
      backgroundColor: '#8B5CF6', // Purple-500 (สีม่วงสื่อถึงกิจกรรมพิเศษ)
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

export default SpecialEventIcon;