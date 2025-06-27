import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogIn,  School, MessageSquare} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../ui/NotificationBell';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Ngành học', path: '/majors' },
    { name: 'Hướng nghiệp', path: '/career' },
    { name: 'Chatbot', path: '/chatbot' },
    { name: 'Bài test', path: '/tests' },
  ];

  const profileLinks = [
    { name: 'Trang cá nhân', path: '/profile', icon: <User size={16} /> },
    { name: 'Lịch sử chat', path: '/chat-history', icon: <MessageSquare size={16} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center font-bold text-xl text-primary-700"
            >
              <School className="mr-2" size={28} />
              <span>EduBot</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'text-primary-700 font-semibold'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-3 py-2">
                  <NotificationBell />
                </div>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-200">
                      {currentUser?.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700">
                          {currentUser?.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-sm">{currentUser?.fullName}</span>
                    <ChevronDown size={16} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
                      >
                        {profileLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <span className="mr-2">{link.icon}</span>
                            {link.name}
                          </Link>
                        ))}                      <button
                          onClick={() => logout()}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogIn size={16} className="mr-2" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center p-2"
            onClick={toggleMenu}
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path)
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="flex items-center px-3 py-2">
                      <NotificationBell />
                    </div>
                    {profileLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      >
                        <span className="mr-2">{link.icon}</span>
                        {link.name}
                      </Link>
                    ))}                    <button
                      onClick={() => logout()}
                      className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    >
                      <LogIn size={16} className="mr-2" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Link to="/login">
                      <Button variant="outline" fullWidth>
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" fullWidth>
                        Đăng ký
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

export default Navbar;