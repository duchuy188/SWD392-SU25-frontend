import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Image } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import ChatBubble from '../components/chat/ChatBubble';
import Button from '../components/ui/Button';
import { ChatMessage, QuickReply } from '../types';
import { useAuth } from '../context/AuthContext';
import { chatServices } from '../services/chatService';
import { useLocation } from 'react-router-dom';

const Chatbot: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasChatSession, setHasChatSession] = useState<boolean>(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatIdFromURL = queryParams.get('chatId');
  
  const [currentChatId, setCurrentChatId] = useState<string | null>(
    chatIdFromURL || localStorage.getItem('edubot_current_chat_id')
  );
  
  useEffect(() => {
    if (chatIdFromURL) {
      localStorage.setItem('edubot_current_chat_id', chatIdFromURL);
      console.log("Setting chat ID from URL:", chatIdFromURL);
    }
  }, [chatIdFromURL]);

  // Thêm useEffect để debug
  useEffect(() => {
    // Log ra để kiểm tra
    console.log("Current chat ID from localStorage:", localStorage.getItem('edubot_current_chat_id'));
  }, []);

  // Thay đổi useEffect đầu tiên
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      setIsTyping(true); // Hiển thị trạng thái đang typing khi đang tải
      
      // Kiểm tra xem có ID chat đã lưu trong localStorage không
      const savedChatId = localStorage.getItem('edubot_current_chat_id');
      console.log("Checking for saved chat ID:", savedChatId);
      
      if (savedChatId) {
        // Nếu có ID chat đã lưu, tải tin nhắn của chat đó bằng API mới
        try {
          console.log('Đang tải chat với ID:', savedChatId);
          const response = await chatServices.getChatById(savedChatId);
          console.log("Chat data response:", response.data);
          
          // Kiểm tra cấu trúc đúng của API response
          if (response.data && response.data.conversation && response.data.conversation.interactions && response.data.conversation.interactions.length > 0) {
            // Format tin nhắn từ interactions
            const formattedMessages = response.data.conversation.interactions.map((interaction: any) => [
              // Tin nhắn người dùng
              {
                id: `user_${interaction._id}`,
                role: 'user',
                content: interaction.query,
                timestamp: interaction.timestamp
              },
              // Tin nhắn bot
              {
                id: `bot_${interaction._id}`,
                role: 'bot',
                content: interaction.response,
                timestamp: interaction.timestamp
              }
            ]).flat(); // Làm phẳng mảng vì mỗi interaction tạo ra 2 tin nhắn
            
            console.log("Loaded existing chat messages:", formattedMessages.length);
            setMessages(formattedMessages);
            
            // Cập nhật currentChatId
            setCurrentChatId(response.data.conversation._id);
          } else {
            console.log("No interactions found in existing chat, creating new chat");
            createNewChatSession();
          }
        } catch (error) {
          console.error('Lỗi khi tải chat theo ID:', error);
          // Nếu không tìm thấy chat (404) hoặc có lỗi khác, tạo mới
          createNewChatSession();
        } finally {
          // Đảm bảo tắt các trạng thái loading và typing
          setIsLoading(false);
          setIsTyping(false);
        }
      } else {
        console.log("No saved chat ID found, creating new chat");
        // Không có ID chat đã lưu, tạo mới
        createNewChatSession();
        // createNewChatSession sẽ tự xử lý việc tắt loading và typing
      }
    };
    
    initializeChat();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Chỉ gọi fetchChatHistory nếu không có chatId trong URL hoặc localStorage
      const savedChatId = chatIdFromURL || localStorage.getItem('edubot_current_chat_id');
      if (!savedChatId) {
        fetchChatHistory();
      }
    } else if (!localStorage.getItem('edubot_current_chat_id')) {
      // Chỉ gọi checkExistingChatOrCreateWelcome nếu không có chat ID
      checkExistingChatOrCreateWelcome();
    }
  }, [isAuthenticated, chatIdFromURL]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkExistingChatOrCreateWelcome = async () => {
    try {
      setIsLoading(true);
 
      const historyResponse = await chatServices.getChatHistory();
      
      if (historyResponse.data && historyResponse.data.length > 0) {
        // We have existing chats, format and display them
        const formattedMessages = historyResponse.data.flatMap((chat: any) => 
          chat.messages.map((msg: any) => ({
            id: msg._id || `msg_${Date.now() * Math.random()}`,
            role: msg.sender === 'user' ? 'user' : 'bot',
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString()
          }))
        );
        
        setMessages(formattedMessages);
      } else {
        // No existing chats, create welcome message
        fetchWelcomeMessage();
      }
    } catch (error) {
      console.error('Error checking chat history:', error);
      // If error occurs, try to create welcome message
      fetchWelcomeMessage();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWelcomeMessage = async () => {
    try {
      setIsTyping(true);
      
      // Create a new chat and get welcome message
      await chatServices.createNewChat();
      const welcomeResponse = await chatServices.sendMessage("Xin chào");
      
      setIsTyping(false);
      
      const welcomeText = welcomeResponse.data.response || 'Xin chào! Tôi là EduBot, trợ lý AI tư vấn học tập và hướng nghiệp. Bạn cần hỗ trợ gì?';
      
      const botMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        role: 'bot',
        content: welcomeText,
        timestamp: new Date().toISOString()
      };
      
      setMessages([botMessage]);
    } catch (error) {
      console.error('Error fetching welcome message:', error);
      setIsTyping(false);
      
      // Use default welcome message if error
      const defaultMessage: ChatMessage = {
        id: 'welcome',
        role: 'bot',
        content: 'Xin chào! Tôi là EduBot, trợ lý AI tư vấn học tập và hướng nghiệp. Bạn cần hỗ trợ gì?',
        timestamp: new Date().toISOString()
      };
      
      setMessages([defaultMessage]);
    }
  };

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await chatServices.getChatHistory();
      
      if (response.data && response.data.length > 0) {
        // Format chat history data
        const formattedMessages = response.data.flatMap((chat: any) => 
          chat.messages.map((msg: any) => ({
            id: msg._id || `msg_${Date.now() * Math.random()}`,
            role: msg.sender === 'user' ? 'user' : 'bot',
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString()
          }))
        );
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputValue;
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to API
      const response = await chatServices.sendMessage(currentInput);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response from API
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: response.data.response || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Kiểm tra xem response có chứa chat ID mới không (trong trường hợp tạo chat mới tự động)
      if (response.data && response.data.conversation && response.data.conversation._id) {
        const chatId = response.data.conversation._id;
        setCurrentChatId(chatId);
        localStorage.setItem('edubot_current_chat_id', chatId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'bot',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleQuickReply = async (reply: QuickReply) => {
    // Add user message from quick reply to UI immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: reply.text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to API
      const response = await chatServices.sendMessage(reply.text);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response from API
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: response.data.response || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending quick reply:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'bot',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const startNewChat = async () => {
    try {
      // Xóa ID chat cũ
      localStorage.removeItem('edubot_current_chat_id');
      setCurrentChatId(null);
      
      // Tạo chat mới
      await createNewChatSession();
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Lỗi khi tạo chat mới:', error);
      setIsTyping(false);
      setMessages([]); // Để trống tin nhắn thay vì hiển thị tin nhắn mặc định
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Add user message with image info
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: `[Đã gửi hình ảnh: ${file.name}]`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send image to API
      const response = await chatServices.sendMessage(file);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response from API
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: response.data.response || 'Xin lỗi, tôi không thể xử lý hình ảnh này.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending image:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'bot',
        content: 'Xin lỗi, không thể xử lý hình ảnh. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createNewChatSession = async () => {
    try {
      setIsTyping(true);
      
      // Tạo chat mới
      const newChatResponse = await chatServices.createNewChat();
      console.log('Tạo chat mới, response:', newChatResponse.data);
      
      // Lấy ID chat từ response
      let newChatId = null;
      if (newChatResponse.data && newChatResponse.data._id) {
        newChatId = newChatResponse.data._id;
      } else if (newChatResponse.data && newChatResponse.data.conversation && newChatResponse.data.conversation._id) {
        newChatId = newChatResponse.data.conversation._id;
      }
      
      if (newChatId) {
        console.log("New chat ID extracted:", newChatId);
        setCurrentChatId(newChatId);
        localStorage.setItem('edubot_current_chat_id', newChatId);
      }
      
      // Gửi tin nhắn chào mừng
      const welcomeResponse = await chatServices.sendMessage("Xin chào");
      setIsTyping(false);
      
      const welcomeText = welcomeResponse.data.response || 'Xin chào! Tôi là EduBot, trợ lý AI tư vấn học tập và hướng nghiệp. Bạn cần hỗ trợ gì?';
      
      const botMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        role: 'bot',
        content: welcomeText,
        timestamp: new Date().toISOString()
      };
      
      setMessages([botMessage]);
    } catch (error) {
      console.error('Lỗi khi tạo chat mới:', error);
      setIsTyping(false);
      setMessages([]); 
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pt-16 pb-8">
        <Container>
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-soft overflow-hidden flex flex-col h-[calc(100vh-120px)]">
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
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Đang tải tin nhắn...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white text-gray-500 rounded-2xl px-4 py-3 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-5 border-t border-gray-200 bg-white">
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    icon={<Image size={20} />}
                    className="rounded-full"
                    title="Gửi hình ảnh"
                  >
                    <span className="sr-only">Gửi hình ảnh</span>
                  </Button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={<Send size={20} />}
                    className="rounded-full px-6 py-3"
                    disabled={isTyping}
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
                    <a href="/login" className="inline-block">
                      <Button variant="outline" size="sm">
                        Đăng nhập
                      </Button>
                    </a>
                    <a href="/register" className="inline-block">
                      <Button variant="primary" size="sm">
                        Đăng ký
                      </Button>
                    </a>
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