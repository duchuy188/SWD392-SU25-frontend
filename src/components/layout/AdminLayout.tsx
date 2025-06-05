import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, Server, Users, FileText, BookOpen, School, ChevronLeft, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  // Redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login\" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hệ thống', href: '/admin/system', icon: Server },
    { name: 'Quản lý người dùng', href: '/admin/users', icon: Users },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
    { name: 'Ngành học', href: '/admin/majors', icon: BookOpen },
    { name: 'Hướng nghiệp', href: '/admin/careers', icon: School }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white shadow-sm">
          <Link to="/" className="flex items-center">
            <School className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">EduBot</span>
          </Link>

          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-black lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <Link to="/" className="flex items-center">
                    <School className="h-8 w-8 text-primary-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">EduBot</span>
                  </Link>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-600 focus:outline-none"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`mr-4 h-5 w-5 ${
                            isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <Link
                    to="/"
                    className="flex items-center px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                  >
                    <ChevronLeft className="mr-4 h-5 w-5 text-gray-400" />
                    Quay lại trang chính
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-5 border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center justify-center px-4">
            <Link to="/" className="flex items-center">
              <School className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduBot</span>
            </Link>
          </div>
          <div className="mt-8 flex-1 flex flex-col px-3">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <ChevronLeft className="mr-3 h-5 w-5 text-gray-400" />
              Quay lại trang chính
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;