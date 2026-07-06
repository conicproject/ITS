import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function GenericFunction({ title, subtitle, items = [] }) {
  const navigate = useNavigate();

  const handleClick = (e, path) => {
    if (!path) return;
    if (e.ctrlKey || e.metaKey) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: "linear-gradient(180deg, #0a1123 0%, #080d1c 100%)" }}>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">เลือกฟังก์ชันที่ต้องการใช้งาน</p>
        <h2 className="text-2xl font-bold text-white">
          {title} <span className="text-gray-400 font-normal">· {subtitle}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center"
            style={{
              background: "linear-gradient(135deg, rgba(30,41,68,0.6), rgba(15,23,42,0.6))",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onClick={(e) => handleClick(e, item.path)}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-sky-400"
              style={{
                background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.08))",
              }}
            >
              {item.icon}
            </div>
            <p className="text-white font-semibold text-sm">{item.name}</p>
            <p className="text-gray-400 text-xs mt-1">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default GenericFunction;