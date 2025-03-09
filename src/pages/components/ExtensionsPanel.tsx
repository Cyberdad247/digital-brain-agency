import { motion } from 'framer-motion/dist/es';

const ExtensionsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Panel content goes here */}
    </motion.div>
  );
};

export default ExtensionsPanel;
