// src/components/Icon_Incident/road-obstruction.jsx
import React from 'react';
import { 
  FaBoxOpen,     // ของตกหล่น
  FaWalking,     // คนเดินเท้า
  FaDog,         // สัตว์
  FaExclamationTriangle // สิ่งกีดขวางทั่วไป
} from "react-icons/fa";

const ICONS = {
  default: FaExclamationTriangle,
  debris: FaBoxOpen,       // AI: Dropped Object
  pedestrian: FaWalking,   // AI: Pedestrian on Highway
  animal: FaDog            // AI: Animal Detection
};

const RoadObstructionIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];

  return (
    <div className={className} style={{
      backgroundColor: '#EAB308', // Yellow-500
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

export default RoadObstructionIcon;