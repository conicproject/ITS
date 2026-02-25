import React from 'react';
import { FaTools, FaExchangeAlt, FaHistory, FaBan, FaHardHat, FaTrafficLight } from "react-icons/fa";

const ICONS = {
  default: FaTools,
  stopped_vehicle: FaTools,
  wrong_way: FaExchangeAlt,
  reversing: FaHistory,
  illegal_parking: FaBan,
  road_work: FaHardHat,      // เพิ่มงานถนน/ก่อสร้าง
  traffic_light: FaTrafficLight, // เพิ่มไฟจราจรขัดข้อง
  breakdown: FaTools
};

const IrregularitieIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];
  return (
    <div className={className} style={{
      backgroundColor: '#F97316', width: `${size}px`, height: `${size}px`,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '2px solid white', boxShadow: '0 3px 6px rgba(0,0,0,0.4)', color: 'white'
    }}>
      <SelectedIcon style={{ fontSize: `${iconSize}px` }} />
    </div>
  );
};
export default IrregularitieIcon;