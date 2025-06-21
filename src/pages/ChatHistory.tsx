import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Trash2, MessageSquare } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { chatServices } from '../services/chatService';

// Định nghĩa interface cho dữ liệu chat từ API
interface ChatConversation {
  _id: string;
  student: string;
  startTime: string;
  interactions: {
    _id: string;
    timestamp: string;
    query: string;
    response: string;
    imageUrl: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

const ChatHistory: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch chat history from API
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await chatServices.getChatHistory();
        
        if (response.data && Array.isArray(response.data)) {
          setChatSessions(response.data);
        } else if (response.data && response.data.conversations && Array.isArray(response.data.conversations)) {
          // Nếu API trả về dạng { conversations: [...] }
          setChatSessions(response.data.conversations);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Định dạng dữ liệu không hợp lệ');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setError('Không thể tải lịch sử trò chuyện');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchChatHistory();
    }
  }, [isAuthenticated]);

  // Filter chat sessions based on search term
  const filteredSessions = chatSessions.filter(session => {
    if (!searchTerm) return true;
    
    // Tìm kiếm trong nội dung của các tin nhắn
    return session.interactions.some(interaction => 
      interaction.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.response.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lấy tin nhắn đầu tiên làm tiêu đề
  const getChatTitle = (session: ChatConversation) => {
    if (session.interactions && session.interactions.length > 0) {
      const firstQuery = session.interactions[0].query;
      return firstQuery.length > 30 ? `${firstQuery.substring(0, 30)}...` : firstQuery;
    }
    return 'Cuộc trò chuyện mới';
  };

  // Lấy tin nhắn cuối cùng làm preview
  const getSessionPreview = (session: ChatConversation) => {
    if (session.interactions && session.interactions.length > 0) {
      const lastInteraction = session.interactions[session.interactions.length - 1];
      const preview = lastInteraction.response;
      return preview.length > 100 ? `${preview.substring(0, 100)}...` : preview;
    }
    return 'Không có tin nhắn';
  };

  const handleDeleteClick = (id: string) => {
    setDeletingChatId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingChatId) return;
    
    try {
      // Gọi API để xóa chat
      await chatServices.deleteChat(deletingChatId);
      
      // Cập nhật state để xóa chat khỏi UI
      setChatSessions(prevSessions => prevSessions.filter(session => session._id !== deletingChatId));
      
      // Nếu chat bị xóa là chat hiện tại, xóa khỏi localStorage
      const currentChatId = localStorage.getItem('edubot_current_chat_id');
      if (currentChatId === deletingChatId) {
        localStorage.removeItem('edubot_current_chat_id');
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
      alert('Không thể xóa cuộc trò chuyện. Vui lòng thử lại sau.');
    } finally {
      // Đóng modal xác nhận
      setShowDeleteConfirm(false);
      setDeletingChatId(null);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                Lịch sử trò chuyện
              </h1>
              
              <div className="w-full md:w-64">
                <Input
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  leftIcon={<Search size={18} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-500">Đang tải lịch sử trò chuyện...</p>
              </div>
            ) : error ? (
              <Card className="text-center py-8">
                <CardBody>
                  <div className="text-error-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Đã xảy ra lỗi
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="primary"
                  >
                    Thử lại
                  </Button>
                </CardBody>
              </Card>
            ) : filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card hoverable className="transition-all duration-300">
                      <CardBody>
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {getChatTitle(session)}
                            </h3>
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {getSessionPreview(session)}
                            </p>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(session.createdAt)}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                <span>{formatTime(session.updatedAt)}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <MessageSquare size={14} className="mr-1" />
                                <span>{session.interactions.length} tin nhắn</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-4 md:mt-0 space-x-3">
                            <a 
                              href={`/chatbot?chatId=${session._id}`}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-primary-500 bg-primary-50 text-primary-700 hover:bg-primary-100"
                            >
                              Tiếp tục
                            </a>
                            
                            <button
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-error-500 bg-error-50 text-error-700 hover:bg-error-100"
                              onClick={() => handleDeleteClick(session._id)}
                            >
                              <Trash2 size={16} className="mr-1" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardBody>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <MessageSquare size={24} className="text-gray-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không có cuộc trò chuyện nào
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {searchTerm 
                      ? `Không tìm thấy cuộc trò chuyện nào với từ khóa "${searchTerm}"`
                      : 'Bạn chưa có cuộc trò chuyện nào với EduBot'
                    }
                  </p>
                  
                  <a 
                    href="/chatbot"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Bắt đầu trò chuyện
                  </a>
                </CardBody>
              </Card>
            )}
          </div>
          
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Xác nhận xóa
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa cuộc trò chuyện này?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                    onClick={confirmDelete}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </MainLayout>
  );
};

export default ChatHistory;