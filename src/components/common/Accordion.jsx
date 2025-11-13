import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 w-full">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {/* Header */}
          <motion.button
            onClick={() => toggleAccordion(index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileHover={{ backgroundColor: "#f9fafb" }}
            whileTap={{ backgroundColor: "#f3f4f6" }}
          >
            <div className="flex items-center gap-3 flex-1 text-left">
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                )}
              </div>
            </div>

            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 ml-4"
            >
              <ChevronDown size={20} className="text-gray-600" />
            </motion.div>
          </motion.button>

          {/* Content */}
          <motion.div
            initial={false}
            animate={{
              height: openIndex === index ? "auto" : 0,
              opacity: openIndex === index ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <motion.div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {item.content}
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default Accordion;