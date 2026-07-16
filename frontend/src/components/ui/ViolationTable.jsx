// frontend/src/components/ui/ViolationTable.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCaretUp, FaCaretDown, FaImage } from 'react-icons/fa';
import { violationTableConfigs, vehicleColorDots } from '../../config/ViolationConfig';

const directionStyle = (direction) => {
  const isIn = direction === "ขาเข้า";
  return {
    icon: isIn ? <FaCaretUp className="text-emerald-400" /> : <FaCaretDown className="text-amber-400" />,
    text: isIn ? "text-emerald-400" : "text-amber-400",
  };
};

export const ViolationTable = ({
  type = "helmet",
  violations = [],
  selectedId,
  onRowClick,
  pageSize = 8,
}) => {
  const [page, setPage] = useState(1);
  const columns = violationTableConfigs[type]?.columns ?? [];

  const totalPages = Math.max(1, Math.ceil(violations.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return violations.slice(start, start + pageSize);
  }, [violations, page, pageSize]);

  const rangeStart = violations.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, violations.length);

  // ── Drag-to-scroll ด้วยเมาส์ (สำหรับ desktop ที่ไม่มี trackpad/touch) ──
  const scrollRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, startScrollLeft: 0, moved: false });

  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (e) => {
    const el = scrollRef.current;
    if (!el || !dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - dragState.current.startX;
    if (Math.abs(walk) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - walk;
  };

  const endDrag = () => {
    dragState.current.isDown = false;
  };

  // แยก scroll ของตารางออกจากหน้าเว็บทั้งหมด: เมื่อเมาส์อยู่บนตาราง
  // การหมุนสกอร์ลจะเลื่อนแค่ตาราง (แนวนอน) เท่านั้น ไม่ดันให้หน้าเว็บเลื่อนตามไปด้วย
  //
  // หมายเหตุ: ต้องผูก listener แบบ native (ไม่ใช่ผ่าน prop onWheel ของ React)
  // เพราะ React ผูก wheel event เป็น passive listener โดยดีฟอลต์
  // ทำให้ e.preventDefault() ข้างในไม่มีผล หน้าเว็บจะยังเลื่อนตามอยู่ดี
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // กันไม่ให้การลากเมาส์ไป trigger การคลิกเลือกแถว (onRowClick) โดยไม่ตั้งใจ
  const handleRowClick = (row) => {
    if (dragState.current.moved) return;
    onRowClick?.(row);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1526] overflow-hidden">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        className="overflow-x-auto cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-white/[.04] text-[rgba(220,234,255,.45)] text-xs uppercase tracking-wide">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-[rgba(220,234,255,.35)]">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => {
                const isSelected = selectedId && row.lpr === selectedId;
                return (
                  <tr
                    key={row.lpr + idx}
                    onClick={() => handleRowClick(row)}
                    className={`cursor-pointer border-t border-white/5 transition-colors ${
                      isSelected ? "bg-white/[.06]" : "hover:bg-white/[.03]"
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 align-middle whitespace-nowrap">
                        {col.type === "image" && (
                          <div className="flex flex-col items-start gap-1">
                            {row.plateImage ? (
                              <img
                                src={row.plateImage}
                                alt={row.lpr}
                                className="w-16 h-11 object-cover rounded-md border border-white/10"
                              />
                            ) : (
                              <div className="w-16 h-11 rounded-md border border-white/10 bg-white/5 flex items-center justify-center">
                                <FaImage className="text-white/20" size={16} />
                              </div>
                            )}
                            <span className="text-[10px] text-[rgba(220,234,255,.4)]">{row.province}</span>
                          </div>
                        )}

                        {col.type === "plate" && (
                          <span className="font-bold text-white">{row[col.key]}</span>
                        )}

                        {col.type === "color" && (
                          <span className="flex items-center gap-2 text-[rgba(220,234,255,.75)]">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: vehicleColorDots[row.color] ?? "#9ca3af" }}
                            />
                            {row.color}
                          </span>
                        )}

                        {col.type === "direction" && (
                          <span className={`flex items-center gap-1 font-semibold ${directionStyle(row.direction).text}`}>
                            {directionStyle(row.direction).icon}
                            {row.direction}
                          </span>
                        )}

                        {col.type === "text" && (
                          <span className="text-[rgba(220,234,255,.75)]">{row[col.key] ?? "-"}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-[rgba(220,234,255,.4)]">
        <span>{rangeStart}-{rangeEnd} จาก {violations.length} รายการ</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            <FaChevronLeft size={10} /> ก่อนหน้า
          </button>
          <span className="px-2">หน้า {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            ถัดไป <FaChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};