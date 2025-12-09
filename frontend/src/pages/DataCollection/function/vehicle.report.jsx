import { useState } from 'react';

function VehicleReport() {
  const [activeTab, setActiveTab] = useState('basic');
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [format, setFormat] = useState('pdf');
  
  // Advanced options
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeStructure, setIncludeStructure] = useState(true);
  const [includeComparison, setIncludeComparison] = useState(false);

  const handleGenerate = () => {
    console.log('Generating report...', {
      reportType,
      startDate,
      endDate,
      duration,
      format,
      includeCharts,
      includeStructure,
      includeComparison
    });
    alert('กำลังสร้างรายงาน...');
  };

  const handleReset = () => {
    setReportType('');
    setStartDate('');
    setEndDate('');
    setDuration('');
    setFormat('pdf');
    setIncludeCharts(true);
    setIncludeStructure(true);
    setIncludeComparison(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ระบบสร้างรายงาน</h1>
          <p className="text-gray-500">เลือกตัวเลือกและกำหนดค่าสำหรับการสร้างรายงานของคุณ</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
              activeTab === 'basic'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            ตัวเลือกพื้นฐาน
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
              activeTab === 'advanced'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            ตัวเลือกขั้นสูง
          </button>
        </div>

        {/* Basic Tab Content */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">ตัวเลือกพื้นฐาน</h2>
            <p className="text-gray-500 text-sm mb-8">เลือกประเภทรายงานและช่วงเวลาที่ต้องการ</p>

            {/* Report Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทรายงาน
              </label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-gray-700"
                  style={{ color: reportType ? '#111827' : '#9CA3AF' }}
                >
                  <option value="" disabled>เลือกประเภทรายงาน</option>
                  <option value="vehicle-usage">รายงานการใช้งานยานพาหนะ</option>
                  <option value="maintenance">รายงานการบำรุงรักษา</option>
                  <option value="fuel">รายงานการใช้เชื้อเพลิง</option>
                  <option value="expenses">รายงานค่าใช้จ่าย</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่เริ่มต้น
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่สิ้นสุด
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Duration Preset */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกช่วงเวลาด่วน
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { value: 'day', label: 'วันนี้' },
                  { value: 'week', label: '7 วันที่แล้ว' },
                  { value: 'month', label: '30 วันที่แล้ว' },
                  { value: 'custom', label: 'เลือกเอง' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDuration(option.value)}
                    className={`px-5 py-2.5 rounded-lg border-2 font-medium transition-all ${
                      duration === option.value
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปแบบไฟล์
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat('pdf')}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    format === 'pdf'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      format === 'pdf' ? 'border-gray-900' : 'border-gray-400'
                    }`}>
                      {format === 'pdf' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                    </div>
                    <span className="text-gray-900">PDF</span>
                  </div>
                </button>
                <button
                  onClick={() => setFormat('excel')}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    format === 'excel'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      format === 'excel' ? 'border-gray-900' : 'border-gray-400'
                    }`}>
                      {format === 'excel' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                    </div>
                    <span className="text-gray-900">Excel</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                ล้างข้อมูล
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                สร้างรายงาน
              </button>
            </div>
          </div>
        )}

        {/* Advanced Tab Content */}
        {activeTab === 'advanced' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">ตัวเลือกขั้นสูง</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">กำหนดค่าเพิ่มเติมสำหรับรายงานของคุณ</p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                เนื้อหาที่ต้องการรวมในรายงาน
              </label>
              
              <div className="space-y-3">
                {/* Chart Option */}
                <div
                  onClick={() => setIncludeCharts(!includeCharts)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    includeCharts ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      includeCharts ? 'bg-gray-900 border-gray-900' : 'border-gray-400 bg-white'
                    }`}>
                      {includeCharts && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-0.5">รวมกราฟและแผนภูมิ</div>
                      <div className="text-sm text-gray-600">แสดงข้อมูลในรูปแบบกราฟและแผนภูมิ</div>
                    </div>
                  </div>
                </div>

                {/* Structure Option */}
                <div
                  onClick={() => setIncludeStructure(!includeStructure)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    includeStructure ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      includeStructure ? 'bg-gray-900 border-gray-900' : 'border-gray-400 bg-white'
                    }`}>
                      {includeStructure && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-0.5">สรุปโครงสร้าง</div>
                      <div className="text-sm text-gray-600">แสดงสรุปโครงสร้างและหัวข้อย่อยภาพรวม</div>
                    </div>
                  </div>
                </div>

                {/* Comparison Option */}
                <div
                  onClick={() => setIncludeComparison(!includeComparison)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    includeComparison ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      includeComparison ? 'bg-gray-900 border-gray-900' : 'border-gray-400 bg-white'
                    }`}>
                      {includeComparison && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-0.5">รวมเชิงเปรียบเทียบเดิม</div>
                      <div className="text-sm text-gray-600">แสดงข้อมูลสถิติของครอบเปเดียบเทียบก่อน</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                ล้างข้อมูล
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                สร้างรายงาน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleReport;