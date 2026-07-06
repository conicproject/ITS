import { useState, useEffect } from 'react';
import apiClient from "../../../../../service/client";

function ManageVip() {
  const [plateNumber, setPlateNumber] = useState('');
  const [province, setProvince]       = useState('');
  const [color, setColor]             = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [listType, setListType]       = useState('blacklist');
  const [note, setNote]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(false);
  const [records, setRecords]         = useState([]);

  // ── Fetch all records from DB ────────────────────────────────────────────────
  const fetchBlacklist = async () => {
    try {
      setFetching(true);
      const response = await apiClient.get('/api/get_blacklist');
      setRecords(response.data);
    } catch (error) {
      console.error('Fetch blacklist error:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  // ── Insert ───────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!plateNumber || !province || !color || !vehicleType) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const payload = {
      license_plate:  plateNumber,
      plate_province: province,
      color:          color,
      type:           listType,
      note:           note,
    };

    try {
      setLoading(true);
      await apiClient.post('/api/insert_blacklist', payload);
      setPlateNumber('');
      setProvince('');
      setColor('');
      setVehicleType('');
      setListType('blacklist');
      setNote('');
      await fetchBlacklist();
    } catch (error) {
      console.error('Insert blacklist error:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มรายการ');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('ต้องการลบรายการนี้หรือไม่?');
    if (!confirmDelete) return;
    try {
      await apiClient.delete(`/api/delete_blacklist/${id}`);
      await fetchBlacklist();
    } catch (error) {
      console.error('Delete blacklist error:', error);
      alert('เกิดข้อผิดพลาดในการลบรายการ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Blacklist</h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">เพิ่มรายการ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="ทะเบียนรถ"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="border p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="จังหวัดป้ายทะเบียน"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="border p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="สี"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="ประเภทรถ"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="border p-3 rounded-lg"
            />
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="หมายเหตุ (ถ้ามี)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">ประเภท</label>
            <select
              value={listType}
              onChange={(e) => setListType(e.target.value)}
              className="border p-3 rounded-lg w-full"
            >
              <option value="blacklist">Blacklist</option>
              <option value="greenlist">Greenlist</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'กำลังบันทึก...' : 'เพิ่มรายการ'}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">รายการทั้งหมด</h2>

          {fetching ? (
            <p className="text-gray-400">กำลังโหลด...</p>
          ) : records.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีข้อมูล</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ทะเบียน</th>
                  <th className="text-left p-2">จังหวัด</th>
                  <th className="text-left p-2">สี</th>
                  <th className="text-left p-2">สถานะ</th>
                  <th className="text-left p-2">หมายเหตุ</th>
                  <th className="text-left p-2">วันที่</th>
                  <th className="text-left p-2">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.license_plate}</td>
                    <td className="p-2">{item.plate_province}</td>
                    <td className="p-2">{item.color}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-white text-sm ${
                        item.type === 'blacklist' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-2 text-gray-500 text-sm">{item.note || '-'}</td>
                    <td className="p-2 text-gray-500 text-sm">{item.created_date || '-'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageVip;
