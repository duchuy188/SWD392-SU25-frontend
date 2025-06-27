import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isLatestBot?: boolean;
  highlight?: boolean;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(({ message, isLatestBot = false, highlight = false }, ref) => {
  const isBot = message.role === 'bot';
  
  return (
    <motion.div
      ref={isBot && isLatestBot ? ref : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 transition-all duration-300 ${
          isBot
            ? `bg-white text-gray-800 border border-gray-200 ${
                isLatestBot || highlight ? 'ring-2 ring-primary-300 shadow-lg' : ''
              }`
            : 'bg-primary-600 text-white'
        }`}
        tabIndex={isBot && isLatestBot ? 0 : -1}
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
});

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;