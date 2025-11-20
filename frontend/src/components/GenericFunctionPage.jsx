// frontend/src/components/GenericFunctionPage.jsx
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function GenericFunctionPage({ title, items = [] }) {
  const navigate = useNavigate();

  return (
    <div className="h-screen p-8">
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
            onClick={() => navigate(item.path)} // 👈 เพิ่ม navigate ตรงนี้
          >
            <Card className="w-32 h-32 flex items-center justify-center shadow-md hover:shadow-lg transition bg-white">
              <CardContent className="flex items-center justify-center p-4">
                <img src={item.icon} alt={item.name} className="w-16 h-16" />
              </CardContent>
            </Card>
            <p className="mt-2 text-sm text-gray-600 text-center">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default GenericFunctionPage;
