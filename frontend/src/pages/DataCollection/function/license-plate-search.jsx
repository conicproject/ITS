// frontend/src/pages/Enforcement/function/license-plate-search.jsx
import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';

function LicensePlateSearch() {
    const [violations, setViolations] = useState([
        {
            lpr: '1กก-1234',
            camera: 'CAM-002',
            type: 'รถยนต์',
            date: '2025-01-24 14:25',
            status: 'สูง',
            location: 'แยกรัชดา-ห้วยขวาง',
            speed: '85 km/h',
        },
        {
            lpr: '1กก-1234',
            camera: 'CAM-002',
            type: 'รถยนต์',
            date: '2025-01-24 14:25',
            status: 'สูง',
            location: 'แยกรัชดา-ห้วยขวาง',
            speed: '85 km/h',
        },
        {
            lpr: '1กก-1234',
            camera: 'CAM-002',
            type: 'รถยนต์',
            date: '2025-01-24 14:25',
            status: 'สูง',
            location: 'แยกรัชดา-ห้วยขวาง',
            speed: '85 km/h',
        },
        {
            lpr: '1กก-1234',
            camera: 'CAM-002',
            type: 'รถยนต์',
            date: '2025-01-24 14:25',
            status: 'สูง',
            location: 'แยกรัชดา-ห้วยขวาง',
            speed: '85 km/h',
        },
        {
            lpr: '1กก-1234',
            camera: 'CAM-002',
            type: 'รถยนต์',
            date: '2025-01-24 14:25',
            status: 'สูง',
            location: 'แยกรัชดา-ห้วยขวาง',
            speed: '85 km/h',
        },
    ]);

    const handleSearch = (params) => {
        console.log("SEARCH PARAMS:", params);
        // TODO: connect API
    };

    const sidebarStats = {
        totalDays: 3,
        hasViolation: true,
        violations: [
            { camera: 'CAM-002', datetime: '2025-01-24 08:01', type: 'ฝ่าฝืนจราจร' }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto p-6">

                {/* Header */}
                <div className="flex items-center gap-2 text-red-600 mb-4">
                    <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
                        <span className="text-xs">!</span>
                    </div>
                    <span className="text-sm">ระบบตรวจจับการฝ่าสัญญาณไฟ</span>
                </div>

                {/* Filter */}
                <Filter type="license" onSearch={handleSearch} />

                {/* Layout 2 + 1 */}
                <div className="grid grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="col-span-2">
                        <ViolationList
                            title="รายการ"
                            violations={violations}
                            type="lprsearch"
                        />
                    </div>

                    {/* Sidebar */}
                    <div>
                        <MapSidebar
                            cameraId="CAM-002"
                            position={[13.7563, 100.5018]}
                            stats={sidebarStats}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LicensePlateSearch;
