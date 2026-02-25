import React from 'react';
import { FaBoxOpen, FaWalking, FaDog, FaExclamationTriangle, FaTree, FaBuilding } from "react-icons/fa";

const ICONS = {
  default: FaExclamationTriangle,
  debris: FaBoxOpen,
  pedestrian: FaWalking,
  animal: FaDog,
  natural: FaTree,    // เพิ่มสิ่งกีดขวางธรรมชาติ
  collapse: FaBuilding // เพิ่มตึก/สิ่งก่อสร้างถล่ม
};

const RoadObstructionIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];
  return (
    <div className={className} style={{
      backgroundColor: '#EAB308', width: `${size}px`, height: `${size}px`,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '2px solid white', boxShadow: '0 3px 6px rgba(0,0,0,0.4)', color: 'white'
    }}>
      <SelectedIcon style={{ fontSize: `${iconSize}px` }} />
    </div>
  );
};
export default RoadObstructionIcon;