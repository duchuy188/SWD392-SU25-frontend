import React from 'react';
import { motion } from 'framer-motion';
import { QuickReply } from '../../types';

interface QuickReplyButtonProps {
  reply: QuickReply;
  onClick: (reply: QuickReply) => void;
}

const QuickReplyButton: React.FC<QuickReplyButtonProps> = ({ reply, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(reply)}
      className="bg-white border border-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      {reply.text}
    </motion.button>
  );
};

export default QuickReplyButton;