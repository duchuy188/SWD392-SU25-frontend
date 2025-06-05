import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Trash2, MessageSquare } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { mockChatSessions } from '../data/mockData';
import { ChatSession } from '../types';

const ChatHistory: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Filter chat sessions based on search term and current user
  const filteredSessions = mockChatSessions.filter(session => {
    // Only show sessions for current user
    if (currentUser && session.userId !== currentUser.id) return false;
    
    // Search in title and messages
    return (
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.messages.some(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
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

  const getSessionPreview = (session: ChatSession) => {
    return session.messages[session.messages.length - 1]?.content.slice(0, 100) + 
           (session.messages[session.messages.length - 1]?.content.length > 100 ? '...' : '');
  };

  const deleteSession = (id: string) => {
    console.log('Delete session:', id);
    // In a real app, this would call an API to delete the session
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
            
            {filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card hoverable className="transition-all duration-300">
                      <CardBody>
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {session.title}
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
                                <span>{session.messages.length} tin nhắn</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-4 md:mt-0 space-x-3">
                            <Button
                              as="a"
                              href={`/chatbot?session=${session.id}`}
                              variant="outline"
                              size="sm"
                            >
                              Xem chi tiết
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-error-600 hover:bg-error-50"
                              onClick={() => deleteSession(session.id)}
                              icon={<Trash2 size={16} />}
                            >
                              Xóa
                            </Button>
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
                  
                  <Button
                    as="a"
                    href="/chatbot"
                    variant="primary"
                  >
                    Bắt đầu trò chuyện
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default ChatHistory;