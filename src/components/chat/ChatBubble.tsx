import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === 'bot';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
          isBot
            ? 'bg-white text-gray-800 border border-gray-200'
            : 'bg-primary-600 text-white'
        }`}
      >
        <div className="whitespace-pre-line">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isBot ? 'text-gray-500' : 'text-primary-200'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;