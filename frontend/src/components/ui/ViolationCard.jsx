/**
 * Component สำหรับแสดงรายการฝ่าฝืนแต่ละรายการ
 * @param {Object} violation - ข้อมูลการฝ่าฝืน
 * @param {string} type - ประเภท 'enforcement' หรือ 'barrier'
 */
export const ViolationCard = ({ violation, type = 'enforcement' }) => {
  const statusColors = {
    'รอชำระ': 'bg-red-500',
    'รอชำระค่าปรับ': 'bg-red-500',
    'ชำระแล้ว': 'bg-green-500'
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 grid grid-cols-4 gap-4">
          {/* คอลัมน์ที่ 1: ข้อมูลเบื้องต้น */}
          <div>
            <div className="text-sm text-gray-600 mb-1">รอบ: {violation.round}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{violation.camera}</span>
              <span className={`px-2 py-1 text-xs text-white rounded ${statusColors[violation.status]}`}>
                {violation.status}
              </span>
            </div>
          </div>

          {/* คอลัมน์ที่ 2: ทะเบียน */}
          <div>
            <div className="text-sm text-gray-600 mb-1">ทะเบียนรถ</div>
            <div className="font-medium">{violation.licensePlate}</div>
            <div className="text-xs text-gray-500">{violation.datetime}</div>
          </div>

          {/* คอลัมน์ที่ 3: กล้อง/หมายเลข */}
          <div>
            <div className="text-sm text-gray-600 mb-1">
              {type === 'enforcement' ? 'กล้องที่บันทึกภาพ' : 'หมู่ที่'}
            </div>
            <div className="text-sm">{violation.location}</div>
          </div>

          {/* คอลัมน์ที่ 4: กล้อง/หมู่ */}
          <div>
            <div className="text-sm text-gray-600 mb-1">
              {type === 'enforcement' ? 'กล้องที่ออกจาก' : 'หมู่ที่'}
            </div>
            <div className="text-sm">{violation.exitLocation}</div>
          </div>
        </div>

        {/* เวลา */}
        <div className="text-sm text-gray-400 ml-4 whitespace-nowrap">
          {violation.time}
        </div>
      </div>

      {/* บรรทัดเพิ่มเติมสำหรับบางรายการ */}
      {violation.additionalInfo && (
        <div className="mt-2 text-xs text-gray-500 pl-2 border-l-2 border-gray-300">
          {violation.additionalInfo}
        </div>
      )}
    </div>
  );
};
