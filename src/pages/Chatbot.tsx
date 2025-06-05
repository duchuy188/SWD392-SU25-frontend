import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import ChatBubble from '../components/chat/ChatBubble';
import QuickReplyButton from '../components/chat/QuickReplyButton';
import Button from '../components/ui/Button';
import { ChatMessage, QuickReply } from '../types';
import { mockQuickReplies } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const Chatbot: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: 'Xin chào! Tôi là EduBot, trợ lý AI tư vấn học tập và hướng nghiệp. Bạn cần hỗ trợ gì?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      // Add bot response after delay
      setIsTyping(false);
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const handleQuickReply = (reply: QuickReply) => {
    // Add user message from quick reply
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: reply.text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      // Add bot response after delay
      setIsTyping(false);
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: generateResponse(reply.text),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 'welcome_new',
        role: 'bot',
        content: 'Tôi đã bắt đầu cuộc trò chuyện mới. Bạn cần hỗ trợ gì?',
        timestamp: new Date().toISOString()
      }
    ]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Simple mock response generator
  const generateResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('ngành') && lowerMsg.includes('cntt')) {
      return 'Ngành Công nghệ thông tin (CNTT) là một lĩnh vực năng động với nhiều cơ hội việc làm. Ở Việt Nam, các trường đại học hàng đầu đào tạo CNTT bao gồm Đại học Bách khoa Hà Nội, Đại học Công nghệ - ĐHQGHN, và Đại học FPT.\n\nNgành này yêu cầu kiến thức về toán học, kỹ năng lập trình, và khả năng giải quyết vấn đề. Cơ hội việc làm rất đa dạng từ lập trình viên, kỹ sư phần mềm đến chuyên gia an ninh mạng, với mức lương khởi điểm khoảng 10-15 triệu đồng/tháng.\n\nBạn có quan tâm đến lĩnh vực cụ thể nào trong CNTT không?';
    }
    
    if (lowerMsg.includes('thi') && lowerMsg.includes('thpt')) {
      return 'Kỳ thi THPT Quốc gia là kỳ thi quan trọng xác định việc tốt nghiệp THPT và là căn cứ tuyển sinh đại học, cao đẳng.\n\nĐể chuẩn bị tốt, bạn nên:\n1. Lập kế hoạch ôn tập chi tiết cho từng môn\n2. Tập trung vào những dạng bài thường gặp\n3. Làm nhiều đề thi thử và đề các năm trước\n4. Tham gia các nhóm học tập để trao đổi\n5. Nghỉ ngơi đầy đủ, giữ tinh thần thoải mái\n\nBạn cần tư vấn cụ thể về môn nào?';
    }
    
    if (lowerMsg.includes('tính cách') || lowerMsg.includes('phù hợp')) {
      return 'Việc chọn ngành học và nghề nghiệp phù hợp với tính cách là rất quan trọng. Nếu bạn:\n\n- Thích giao tiếp, hướng ngoại: có thể phù hợp với ngành Marketing, Quản trị kinh doanh, Báo chí, Du lịch\n\n- Tỉ mỉ, logic, thích phân tích: có thể phù hợp với CNTT, Kỹ thuật, Tài chính, Kế toán\n\n- Sáng tạo, nghệ thuật: có thể phù hợp với Thiết kế, Kiến trúc, Truyền thông\n\n- Quan tâm đến người khác, đồng cảm: có thể phù hợp với Y khoa, Tâm lý học, Công tác xã hội\n\nBạn thấy mình có những đặc điểm tính cách nào nổi bật?';
    }
    
    return 'Cảm ơn bạn đã chia sẻ. Tôi có thể cung cấp thông tin chi tiết về các ngành học, tư vấn hướng nghiệp, hoặc giải đáp thắc mắc về kỳ thi THPT Quốc gia. Bạn cần tìm hiểu thêm về vấn đề gì?';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pt-16 pb-8">
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-soft overflow-hidden flex flex-col h-[calc(100vh-180px)]">
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold">EduBot Tư vấn</h1>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={startNewChat}
                className="text-white hover:bg-primary-700"
                icon={<Plus size={18} />}
              >
                Trò chuyện mới
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white text-gray-500 rounded-2xl px-4 py-3 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce\" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Quick Replies */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white overflow-x-auto">
              <div className="flex space-x-2">
                {mockQuickReplies.map((reply) => (
                  <QuickReplyButton
                    key={reply.id}
                    reply={reply}
                    onClick={handleQuickReply}
                  />
                ))}
              </div>
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={<Send size={18} />}
                    className="rounded-full"
                  >
                    Gửi
                  </Button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600 mb-3">
                    Đăng nhập để lưu lịch sử chat và nhận tư vấn cá nhân hóa
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button as="a" href="/login" variant="outline" size="sm">
                      Đăng nhập
                    </Button>
                    <Button as="a" href="/register" variant="primary" size="sm">
                      Đăng ký
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default Chatbot;