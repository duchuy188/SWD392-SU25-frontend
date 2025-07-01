import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isLatestBot?: boolean;
  highlight?: boolean;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(({ message, isLatestBot = false, highlight = false }, ref) => {
  const isBot = message.role === 'bot';
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Kiểm tra nếu tin nhắn có chứa URL Cloudinary
    if (message.content.includes('cloudinary.com')) {
      // Tìm URL Cloudinary trong nội dung tin nhắn
      const urlMatch = message.content.match(/(https?:\/\/res\.cloudinary\.com\/[^\s"]+)/);
      if (urlMatch && urlMatch[1]) {
        setImageUrl(urlMatch[1]);
      }
    }
    // Vẫn giữ lại code cũ để tương thích với tin nhắn cũ
    else if (message.content.includes('[Đã gửi hình ảnh:')) {
      const match = message.content.match(/\[Đã gửi hình ảnh: (.+?)\]/);
      if (match && match[1]) {
        const fileName = match[1];
        try {
          const storedImage = localStorage.getItem(`edubot_image_${fileName}`);
          if (storedImage) {
            setImageUrl(storedImage);
          }
        } catch (error) {
          console.error("Lỗi khi lấy hình ảnh từ localStorage:", error);
        }
      }
    }
  }, [message.content]);
  
  // Hàm để lấy nội dung tin nhắn không bao gồm phần URL hình ảnh
  const getMessageContent = () => {
    if (message.content.includes('cloudinary.com')) {
      // Loại bỏ URL Cloudinary khỏi nội dung hiển thị
      return message.content.replace(/(https?:\/\/res\.cloudinary\.com\/[^\s"]+)/, '').trim();
    }
    else if (message.content.includes('[Đã gửi hình ảnh:')) {
      return message.content.replace(/\[Đã gửi hình ảnh: .+?\]/, '').trim();
    }
    return message.content;
  };
  
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
        {isBot ? (
          <div className="prose prose-sm">
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  />
                ),
                p: ({children}) => <p className="mb-3">{children}</p>,
                ul: ({children}) => <ul className="mb-3 pl-5">{children}</ul>,
                ol: ({children}) => <ol className="mb-3 pl-5">{children}</ol>,
                li: ({children}) => <li className="mb-2">{children}</li>,
                img: ({src, alt}) => (
                  <img 
                    src={src} 
                    alt={alt || 'Image'} 
                    className="max-w-full h-auto rounded-lg my-2"
                  />
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div>
            {/* Hiển thị nội dung tin nhắn nếu có */}
            {getMessageContent() && (
              <div className="whitespace-pre-line mb-3">{getMessageContent()}</div>
            )}
            
            {/* Hiển thị hình ảnh nếu có */}
            {imageUrl && (
              <div className="my-2">
                <img 
                  src={imageUrl} 
                  alt="Uploaded image" 
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error("Lỗi khi tải hình ảnh:", e);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-primary-200 italic">(Không thể hiển thị hình ảnh)</div>';
                  }}
                />
              </div>
            )}
            
            {(message.content.includes('[Đã gửi hình ảnh:') || message.content.includes('cloudinary.com')) && !imageUrl && (
              <div className="text-primary-200 italic">
                (Không thể hiển thị hình ảnh)
              </div>
            )}
          </div>
        )}
        
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