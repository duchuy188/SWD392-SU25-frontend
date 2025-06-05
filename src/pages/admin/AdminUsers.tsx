import React, { useState } from 'react';
import { Search, Edit, Trash, UserPlus, Check, X, ChevronDown } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Filter users based on search term and role
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === '' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
    // In a real app, this would call an API to delete the user
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600">Quản lý tài khoản người dùng, phân quyền và trạng thái hoạt động</p>
      </div>
      
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Tìm kiếm người dùng..."
              leftIcon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          
          <div className="relative">
            <select
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              <option value="student">Học sinh</option>
              <option value="teacher">Giáo viên</option>
              <option value="counselor">Tư vấn viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        
        <Button
          variant="primary"
          icon={<UserPlus size={18} />}
          onClick={() => {
            setCurrentUser(null);
            setIsModalOpen(true);
          }}
        >
          Thêm người dùng
        </Button>
      </div>
      
      {/* Users Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="h-10 w-10 object-cover" />
                          ) : (
                            <div className="h-10 w-10 bg-primary-100 flex items-center justify-center text-primary-700">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          {user.province && (
                            <div className="text-xs text-gray-500">{user.province}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'counselor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' && 'Quản trị viên'}
                        {user.role === 'teacher' && 'Giáo viên'}
                        {user.role === 'counselor' && 'Tư vấn viên'}
                        {user.role === 'student' && 'Học sinh'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-error-600 hover:text-error-900"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {currentUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h3>
                
                <div className="space-y-4">
                  <Input
                    label="Họ tên"
                    defaultValue={currentUser?.fullName || ''}
                    fullWidth
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={currentUser?.email || ''}
                    fullWidth
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò
                    </label>
                    <select
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      defaultValue={currentUser?.role || 'student'}
                    >
                      <option value="student">Học sinh</option>
                      <option value="teacher">Giáo viên</option>
                      <option value="counselor">Tư vấn viên</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-primary-600"
                          name="status"
                          value="active"
                          defaultChecked
                        />
                        <span className="ml-2">Hoạt động</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-error-600"
                          name="status"
                          value="inactive"
                        />
                        <span className="ml-2">Bị khóa</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  className="w-full sm:w-auto sm:ml-3"
                  icon={<Check size={18} />}
                >
                  {currentUser ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={closeModal}
                  icon={<X size={18} />}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;