import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function GenericFunction({ title, items = [] }) {
  const navigate = useNavigate();

  // --- Card & CardContent รวมไว้ในไฟล์เดียว ---
  const Card = ({ children, className = "" }) => {
    return (
      <div className={`bg-white shadow rounded-2xl p-4 ${className}`}>
        {children}
      </div>
    );
  };

  const CardContent = ({ children, className = "" }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
  };
  // --------------------------------------------

  const handleClick = (e, path) => {
    if (!path) return; // ป้องกันกรณีไม่มี path
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+Click หรือ Cmd+Click → เปิด tab ใหม่
      window.open(path, "_blank");
    } else {
      // Click ปกติ → navigate ปกติ
      navigate(path);
    }
  };

  return (
    <div className="fix-function-page-y-auto h-screen p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <hr className="mt-2 border-gray-300" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {items.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="w-40 flex flex-col items-center cursor-pointer"
            onClick={(e) => handleClick(e, item.path)}
          >
            <Card className="w-32 h-32 flex items-center justify-center shadow-md hover:shadow-lg transition bg-white">
              <CardContent className="flex items-center justify-center p-4">
                <img src={item.icon} alt={item.name} className="w-16 h-16" />
              </CardContent>
            </Card>
            <p className="mt-2 text-sm text-gray-600 text-center whitespace-pre-line">
              {item.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default GenericFunction;
