import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Trash2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import apiClient from "../../../../../service/client";

// ── Theme tokens — matches src/pages/Login.jsx (ITS Command / SMART TRAFFIC) ──
const theme = {
  pageBg:
    "linear-gradient(rgba(8, 13, 28, 0.97), rgba(8, 13, 28, 0.99)), radial-gradient(circle at 20% 10%, rgba(59, 91, 219, 0.12), transparent 40%)",
  cardBg: "linear-gradient(rgba(10, 17, 35, 0.85), rgba(8, 13, 28, 0.92))",
  cardBorder: "1px solid rgba(255, 255, 255, 0.07)",
  cardShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
  inputBorder: "1px solid rgba(255, 255, 255, 0.15)",
  cyan: "rgb(56, 189, 248)",
  cyanSoft: "rgb(125, 211, 252)",
  brandGradient: "linear-gradient(135deg, #7C93F5 0%, #4F6DE0 50%, #3B5BDB 100%)",
};

// ── Small reusable pieces ─────────────────────────────────────────────────────

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
      style={{
        background: isError
          ? "linear-gradient(135deg, #E5484D 0%, #B3271E 100%)"
          : theme.brandGradient,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
      role="status"
    >
      {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

function ConfirmDialog({ open, plate, onCancel, onConfirm, deleting }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: theme.cardBg, border: theme.cardBorder, boxShadow: theme.cardShadow, backdropFilter: "blur(20px)" }}
      >
        <h3 className="text-lg font-semibold mb-1 text-white">ลบรายการนี้?</h3>
        <p className="text-sm text-gray-400 mb-5">
          ทะเบียน <span className="font-medium text-gray-100">{plate}</span> จะถูกลบออกจากระบบอย่างถาวร
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #E5484D 0%, #B3271E 100%)" }}
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            ลบรายการ
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyForm = {
  plateNumber: '',
  province: '',
  color: '',
  vehicleType: '',
  listType: 'blacklist',
  note: '',
};

const FIELD_LABELS = {
  plateNumber: 'ทะเบียนรถ',
  province: 'จังหวัดป้ายทะเบียน',
  color: 'สี',
  vehicleType: 'ประเภทรถ',
};

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function themedInputWrapperProps() {
  return {
    onFocus: (e) => (e.currentTarget.style.borderColor = theme.cyan),
    onBlur: (e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"),
  };
}

// ── Main component ────────────────────────────────────────────────────────────

function ManageBlacklist() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | blacklist | greenlist
  const [toast, setToast] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const firstFieldRef = useRef(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchBlacklist = async () => {
    try {
      setFetching(true);
      const response = await apiClient.get('/api/get_blacklist');
      setRecords(response.data || []);
    } catch (error) {
      console.error('Fetch blacklist error:', error);
      showToast('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: false }));
  };

  const validate = () => {
    const required = ['plateNumber', 'province', 'color', 'vehicleType'];
    const nextErrors = {};
    required.forEach((key) => {
      if (!form[key].trim()) nextErrors[key] = true;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
  };

  const handleAdd = async () => {
    if (!validate()) {
      showToast(`กรุณากรอก ${FIELD_LABELS[Object.keys(errors)[0]] || 'ข้อมูล'} ให้ครบ`, 'error');
      firstFieldRef.current?.focus();
      return;
    }

    const payload = {
      license_plate: form.plateNumber.trim(),
      plate_province: form.province.trim(),
      color: form.color.trim(),
      type: form.listType,
      note: form.note.trim(),
    };

    try {
      setLoading(true);
      await apiClient.post('/api/insert_blacklist', payload);
      resetForm();
      await fetchBlacklist();
      showToast('เพิ่มรายการเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Insert blacklist error:', error);
      showToast('เกิดข้อผิดพลาดในการเพิ่มรายการ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmTarget) return;
    try {
      setDeletingId(confirmTarget.id);
      await apiClient.delete(`/api/delete_blacklist/${confirmTarget.id}`);
      await fetchBlacklist();
      showToast('ลบรายการเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Delete blacklist error:', error);
      showToast('เกิดข้อผิดพลาดในการลบรายการ', 'error');
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.type === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.license_plate?.toLowerCase().includes(q) ||
        item.plate_province?.toLowerCase().includes(q) ||
        item.color?.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [records, query, statusFilter]);

  const counts = useMemo(
    () => ({
      total: records.length,
      blacklist: records.filter((r) => r.type === 'blacklist').length,
      greenlist: records.filter((r) => r.type === 'greenlist').length,
    }),
    [records]
  );

  const inputFocusProps = themedInputWrapperProps();

  return (
    <div className="min-h-screen p-6" style={{ background: theme.pageBg }}>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmDialog
        open={!!confirmTarget}
        plate={confirmTarget?.license_plate}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleDeleteConfirmed}
        deleting={!!deletingId}
      />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Blacklist</h1>
            <p className="text-xs tracking-widest text-gray-500 font-semibold mt-1">
              SMART TRAFFIC · ACCESS CONTROL
            </p>
          </div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="px-2.5 py-1 rounded-full text-gray-300" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              ทั้งหมด {counts.total}
            </span>
            <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(229, 72, 77, 0.12)", color: "#F87171", border: "1px solid rgba(229, 72, 77, 0.25)" }}>
              Blacklist {counts.blacklist}
            </span>
            <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(56, 189, 248, 0.12)", color: theme.cyanSoft, border: "1px solid rgba(56, 189, 248, 0.25)" }}>
              Greenlist {counts.greenlist}
            </span>
          </div>
        </div>

        {/* Form */}
        <div
          className="p-6 rounded-2xl mb-6"
          style={{ background: theme.cardBg, border: theme.cardBorder, boxShadow: theme.cardShadow, backdropFilter: "blur(20px)" }}
        >
          <h2 className="text-lg font-semibold mb-4 text-white">เพิ่มรายการ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'plateNumber', ref: firstFieldRef },
              { key: 'province' },
              { key: 'color' },
              { key: 'vehicleType' },
            ].map(({ key, ref }) => (
              <div key={key}>
                <div
                  className="flex items-center rounded px-3 transition-all"
                  style={{ border: errors[key] ? "1px solid #E5484D" : theme.inputBorder }}
                  {...inputFocusProps}
                >
                  <input
                    ref={ref}
                    type="text"
                    placeholder={FIELD_LABELS[key].toUpperCase()}
                    value={form[key]}
                    onChange={setField(key)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="w-full py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                    aria-invalid={!!errors[key]}
                  />
                </div>
                {errors[key] && (
                  <p className="text-xs mt-1" style={{ color: "#F87171" }}>
                    กรุณากรอก{FIELD_LABELS[key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center rounded px-3 transition-all" style={{ border: theme.inputBorder }} {...inputFocusProps}>
              <input
                type="text"
                placeholder="หมายเหตุ (ถ้ามี)"
                value={form.note}
                onChange={setField('note')}
                className="w-full py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-xs tracking-wider text-gray-400 font-semibold">ประเภท</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'blacklist', label: 'Blacklist', icon: ShieldAlert, color: "#F87171", bg: "rgba(229, 72, 77, 0.12)", bd: "rgba(229, 72, 77, 0.4)" },
                { value: 'greenlist', label: 'Greenlist', icon: ShieldCheck, color: theme.cyanSoft, bg: "rgba(56, 189, 248, 0.12)", bd: "rgba(56, 189, 248, 0.4)" },
              ].map(({ value, label, icon: Icon, color, bg, bd }) => {
                const active = form.listType === value;
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm((f) => ({ ...f, listType: value }))}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: active ? bg : "transparent",
                      border: `1px solid ${active ? bd : "rgba(255,255,255,0.12)"}`,
                      color: active ? color : "#9CA3AF",
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="px-6 py-3 rounded-lg disabled:opacity-50 flex items-center gap-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
              style={{ background: theme.brandGradient, boxShadow: "0 4px 14px rgba(59, 91, 219, 0.4)" }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'กำลังบันทึก...' : 'เพิ่มรายการ'}
            </button>
            <button
              onClick={resetForm}
              disabled={loading}
              className="px-6 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 disabled:opacity-50"
            >
              ล้างฟอร์ม
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: theme.cardBg, border: theme.cardBorder, boxShadow: theme.cardShadow, backdropFilter: "blur(20px)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-white">รายการทั้งหมด</h2>

            <div className="flex gap-2 w-full sm:w-auto">
              <div
                className="relative flex-1 sm:w-56 flex items-center rounded px-3"
                style={{ border: theme.inputBorder }}
                {...inputFocusProps}
              >
                <Search size={15} className="text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="ค้นหาทะเบียน, จังหวัด, สี..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded px-3 py-2 text-sm bg-transparent text-gray-200 focus:outline-none"
                style={{ border: theme.inputBorder, colorScheme: "dark" }}
              >
                <option value="all" style={{ background: "#0A1123" }}>ทั้งหมด</option>
                <option value="blacklist" style={{ background: "#0A1123" }}>Blacklist</option>
                <option value="greenlist" style={{ background: "#0A1123" }}>Greenlist</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th className="p-3 font-medium text-gray-400">ทะเบียน</th>
                  <th className="p-3 font-medium text-gray-400">จังหวัด</th>
                  <th className="p-3 font-medium text-gray-400">สี</th>
                  <th className="p-3 font-medium text-gray-400">สถานะ</th>
                  <th className="p-3 font-medium text-gray-400">หมายเหตุ</th>
                  <th className="p-3 font-medium text-gray-400">วันที่</th>
                  <th className="p-3 font-medium text-gray-400 w-16">จัดการ</th>
                </tr>
              </thead>

              {fetching ? (
                <TableSkeleton />
              ) : (
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Inbox size={28} className="text-gray-600" />
                          {records.length === 0
                            ? 'ยังไม่มีข้อมูล'
                            : 'ไม่พบรายการที่ตรงกับการค้นหา'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td className="p-3 font-medium text-gray-100">{item.license_plate}</td>
                        <td className="p-3 text-gray-400">{item.plate_province}</td>
                        <td className="p-3 text-gray-400">{item.color}</td>
                        <td className="p-3">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={
                              item.type === 'blacklist'
                                ? { background: "rgba(229, 72, 77, 0.12)", color: "#F87171", border: "1px solid rgba(229, 72, 77, 0.25)" }
                                : { background: "rgba(56, 189, 248, 0.12)", color: theme.cyanSoft, border: "1px solid rgba(56, 189, 248, 0.25)" }
                            }
                          >
                            {item.type === 'blacklist' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                            {item.type}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{item.note || '-'}</td>
                        <td className="p-3 text-gray-500">{item.created_date || '-'}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setConfirmTarget(item)}
                            disabled={deletingId === item.id}
                            className="p-2 rounded-lg disabled:opacity-50 transition-colors"
                            style={{ color: "#F87171" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229, 72, 77, 0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            aria-label="ลบรายการ"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageBlacklist;