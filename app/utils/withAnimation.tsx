import { motion } from 'framer-motion';
import { ComponentType } from 'react';

interface WithAnimationProps {
  // 你可以在这里定义任何需要的额外属性
}

const withAnimation = <P extends object>(Component: ComponentType<P>) => {
  return (props: P & WithAnimationProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Component {...props} />
    </motion.div>
  );
};

export default withAnimation;