import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Image } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ChatBubble from '../components/chat/ChatBubble';
import Button from '../components/ui/Button';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import { chatServices } from '../services/chatService';
import { useLocation } from 'react-router-dom';

const Chatbot: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightLatestBot, setHighlightLatestBot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestBotMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatIdFromURL = queryParams.get('chatId');
  
  /*
  const [currentChatId, setCurrentChatId] = useState<string | null>(
    chatIdFromURL || localStorage.getItem('edubot_current_chat_id')
  );
  */
  
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
            // setCurrentChatId(response.data.conversation._id);
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

  // Focus vào câu trả lời mới nhất của bot
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'bot' && latestBotMessageRef.current) {
        // Bật highlight cho tin nhắn mới
        setHighlightLatestBot(true);
        
        // Delay một chút để đảm bảo animation và scroll hoàn tất
        setTimeout(() => {
          latestBotMessageRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          latestBotMessageRef.current?.focus({ preventScroll: true });
          
          // Tắt highlight sau 3 giây
          setTimeout(() => {
            setHighlightLatestBot(false);
          }, 3000);
        }, 500);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
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

  // Thêm state mới để lưu trữ file đã chọn
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);

  // Sửa hàm handleFileSelect để đảm bảo lưu đúng định dạng base64
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Kiểm tra kích thước file trước khi xử lý
    if (file.size > 2 * 1024 * 1024) { // Giảm xuống 2MB để đảm bảo
      alert("Hình ảnh quá lớn, vui lòng chọn hình ảnh nhỏ hơn 2MB");
      return;
    }
    
    // Đọc file thành base64
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const base64String = event.target.result.toString();
        
        // Kiểm tra xem có phải là base64 hợp lệ không
        if (!base64String.startsWith('data:image/')) {
          console.error("Định dạng base64 không hợp lệ");
          return;
        }
        
        setSelectedFile(file);
        setSelectedFilePreview(base64String);
        
        // Lưu vào localStorage
        try {
          console.log("Đang lưu hình ảnh vào localStorage...");
          localStorage.setItem(`edubot_image_${file.name}`, base64String);
        } catch (error) {
          console.error("Lỗi khi lưu hình ảnh vào localStorage:", error);
          alert("Không thể lưu hình ảnh. Vui lòng thử lại với hình ảnh nhỏ hơn.");
        }
      }
    };
    reader.onerror = (error) => {
      console.error("Lỗi khi đọc file:", error);
    };
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra nếu không có nội dung tin nhắn và không có file được chọn
    if (inputValue.trim() === '' && !selectedFile) return;
    
    let userMessageContent = inputValue;
    let fileToSend = selectedFile;
    
    // Nếu có file được chọn, thêm thông tin về file vào nội dung tin nhắn
    if (selectedFile) {
      // Nếu có cả tin nhắn và hình ảnh
      if (inputValue.trim() !== '') {
        userMessageContent = `${inputValue}\n\n[Đã gửi hình ảnh: ${selectedFile.name}]`;
      } else {
        userMessageContent = `[Đã gửi hình ảnh: ${selectedFile.name}]`;
      }
    }
    
    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Reset input và file đã chọn
    setInputValue('');
    const tempInputValue = inputValue.trim(); // Lưu lại giá trị input trước khi reset
    setSelectedFile(null);
    setSelectedFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      let response;
      
      // Gửi file hoặc tin nhắn văn bản
      if (fileToSend) {
        // Gửi cả file và text nếu có
        response = await chatServices.sendMessage(fileToSend, tempInputValue);
      } else {
        response = await chatServices.sendMessage(userMessageContent);
      }
      
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
      
      // Kiểm tra xem response có chứa chat ID mới không
      if (response.data && response.data.conversation && response.data.conversation._id) {
        const chatId = response.data.conversation._id;
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

  /*
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
  */

  const startNewChat = async () => {
    try {
      // Xóa ID chat cũ
      localStorage.removeItem('edubot_current_chat_id');
      // setCurrentChatId(null);
      
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
    
    // Tạo URL cho file preview và lưu vào localStorage
    const imagePreviewUrl = URL.createObjectURL(file);
    localStorage.setItem(`edubot_image_${file.name}`, imagePreviewUrl);
    
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
        // setCurrentChatId(newChatId);
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

  // Thêm hàm này vào component Chatbot
  const checkLocalStorageAvailability = () => {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error("localStorage không khả dụng:", e);
      return false;
    }
  };

  // Sử dụng trong useEffect khi component mount
  useEffect(() => {
    const isLocalStorageAvailable = checkLocalStorageAvailability();
    if (!isLocalStorageAvailable) {
      console.error("Cảnh báo: localStorage không khả dụng. Tính năng lưu hình ảnh sẽ không hoạt động.");
      // Có thể hiển thị thông báo cho người dùng
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex bg-gray-50 pt-16 h-screen">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full top-16 overflow-hidden flex flex-col">
          {/* Logo/Header trong sidebar */}
          <div className="bg-primary-600 text-white p-4 flex-shrink-0">
            <h1 className="text-xl font-semibold">Chat với EduBot</h1>
          </div>
          
          {/* Navigation buttons */}
          <div className="p-4 space-y-3 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={startNewChat}
              className="w-full justify-start text-left hover:bg-gray-50 border border-gray-200"
              icon={<Plus size={18} />}
            >
              Trò chuyện mới
            </Button>
            <div className="w-full p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <h2 className="text-primary-700 font-semibold text-sm">EduBot Tư vấn</h2>
              <p className="text-primary-600 text-xs mt-1">Trợ lý AI hỗ trợ học tập</p>
            </div>
          </div>
        </div>
        
        {/* Main Content với margin-left để tránh sidebar */}
        <div className="flex-1 p-4 ml-64">
          <div className="h-full bg-white rounded-xl shadow-soft overflow-hidden flex flex-col">
            
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
                  {messages.map((message, index) => {
                    const isLastBotMessage = message.role === 'bot' && index === messages.length - 1;
                    return (
                      <ChatBubble 
                        key={message.id} 
                        message={message} 
                        isLatestBot={isLastBotMessage}
                        ref={isLastBotMessage ? latestBotMessageRef : undefined}
                        highlight={highlightLatestBot && isLastBotMessage} // Thêm prop highlight
                      />
                    );
                  })}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white text-gray-500 rounded-2xl px-4 py-3 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-300 typing-dot-1"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 typing-dot-2"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 typing-dot-3"></div>
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
                <>
                  {selectedFilePreview && (
                    <div className="mb-3 relative">
                      <div className="relative inline-block">
                        <img 
                          src={selectedFilePreview} 
                          alt="Preview" 
                          className="h-20 rounded-lg object-cover" 
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                          onClick={() => {
                            setSelectedFile(null);
                            setSelectedFilePreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="flex space-x-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                      aria-label="Upload image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      icon={<Image size={20} />}
                      className={`rounded-full ${selectedFile ? 'bg-primary-100' : ''}`}
                      title="Chọn hình ảnh"
                    >
                      <span className="sr-only">Chọn hình ảnh</span>
                    </Button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={selectedFile ? "Nhập nội dung kèm theo hình ảnh (tùy chọn)..." : "Nhập câu hỏi của bạn..."}
                      className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button 
                      type="submit" 
                      variant="primary"
                      icon={<Send size={20} />}
                      className="rounded-full px-6 py-3"
                      disabled={isTyping || (inputValue.trim() === '' && !selectedFile)}
                    >
                      Gửi
                    </Button>
                  </form>
                </>
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
        </div>
      </div>
    </div>
  );
};

export default Chatbot;