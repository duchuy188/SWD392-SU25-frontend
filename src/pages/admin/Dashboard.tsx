import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, GraduationCap as Graduation, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockSystemStatus } from '../../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của hệ thống EduBot</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Người dùng trực tuyến</p>
                  <h3 className="text-2xl font-bold text-gray-900">{mockSystemStatus.activeUsers}</h3>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingUp className="text-success-500 mr-1" size={16} />
                <span className="text-success-700 font-medium">+5.2%</span>
                <span className="text-gray-500 ml-1">so với tuần trước</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-secondary-100 text-secondary-600">
                  <MessageSquare size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng phiên chat</p>
                  <h3 className="text-2xl font-bold text-gray-900">{mockSystemStatus.totalSessions}</h3>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingUp className="text-success-500 mr-1" size={16} />
                <span className="text-success-700 font-medium">+12.8%</span>
                <span className="text-gray-500 ml-1">so với tuần trước</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
                  <Graduation size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tỷ lệ hoàn thành</p>
                  <h3 className="text-2xl font-bold text-gray-900">73.4%</h3>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingUp className="text-success-500 mr-1" size={16} />
                <span className="text-success-700 font-medium">+3.6%</span>
                <span className="text-gray-500 ml-1">so với tuần trước</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-secondary-100 text-secondary-600">
                  <BookOpen size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Thời gian phản hồi</p>
                  <h3 className="text-2xl font-bold text-gray-900">{mockSystemStatus.responseTime}s</h3>
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingDown className="text-error-500 mr-1" size={16} />
                <span className="text-error-700 font-medium">+0.3s</span>
                <span className="text-gray-500 ml-1">so với tuần trước</span>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
      
      {/* System Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h2>
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`h-4 w-4 rounded-full ${
                  mockSystemStatus.status === 'online' ? 'bg-success-500' : 
                  mockSystemStatus.status === 'maintenance' ? 'bg-warning-500' : 'bg-error-500'
                } mr-2`}></div>
                <span className="font-medium">
                  {mockSystemStatus.status === 'online' ? 'Hệ thống đang hoạt động' : 
                   mockSystemStatus.status === 'maintenance' ? 'Đang bảo trì' : 'Hệ thống ngưng hoạt động'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Cập nhật lần cuối: {new Date(mockSystemStatus.lastUpdated).toLocaleString('vi-VN')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Thời gian hoạt động</div>
                <div className="text-lg font-semibold">{mockSystemStatus.uptime}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full" 
                    style={{ width: `${mockSystemStatus.uptime}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Sử dụng CPU</div>
                <div className="text-lg font-semibold">42.8%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: '42.8%' }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Sử dụng RAM</div>
                <div className="text-lg font-semibold">68.3%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-warning-500 h-2 rounded-full" 
                    style={{ width: '68.3%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
        <Card>
          <CardBody>
            <div className="space-y-4">
              {[
                { 
                  time: '10:23', 
                  text: 'Cập nhật dữ liệu điểm chuẩn năm 2023 thành công',
                  user: 'Hệ thống',
                  type: 'success'
                },
                { 
                  time: '09:41', 
                  text: 'Người dùng "Nguyễn Văn An" đã đăng ký mới',
                  user: 'Admin',
                  type: 'info'
                },
                { 
                  time: '08:15', 
                  text: 'Phát hiện tải CPU cao (85%) trong 5 phút',
                  user: 'Hệ thống',
                  type: 'warning'
                },
                { 
                  time: 'Hôm qua', 
                  text: 'Không thể kết nối đến dịch vụ AI phân tích dữ liệu',
                  user: 'Hệ thống',
                  type: 'error'
                },
                { 
                  time: 'Hôm qua', 
                  text: 'Thêm 12 câu hỏi mới vào cơ sở dữ liệu',
                  user: 'Tư vấn viên',
                  type: 'info'
                },
              ].map((activity, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className={`h-3 w-3 rounded-full mt-1.5 ${
                      activity.type === 'success' ? 'bg-success-500' :
                      activity.type === 'warning' ? 'bg-warning-500' :
                      activity.type === 'error' ? 'bg-error-500' :
                      'bg-primary-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-500">bởi {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;