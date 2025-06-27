import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseApp } from '../../config/firebase';
import { FiBell } from 'react-icons/fi'; 
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const STORAGE_KEY = 'edubot_notifications';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
  },
  bellIcon: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  bellIconHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '50%',
    minWidth: '18px',
    height: '18px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    width: '350px',
    maxHeight: '500px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    overflow: 'hidden',
    marginTop: '8px',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: '0',
    fontSize: '18px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    color: '#2196f3',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  actionButtonHover: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  actionButtonDisabled: {
    color: '#ccc',
    cursor: 'default',
  },
  deleteAllButton: {
    color: '#f44336',
  },
  deleteAllButtonHover: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  listContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  noNotifications: {
    padding: '24px',
    textAlign: 'center',
    color: '#666',
  },
  list: {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  item: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    transition: 'background-color 0.2s',
  },
  itemHover: {
    backgroundColor: '#f9f9f9',
  },
  itemUnread: {
    backgroundColor: '#e3f2fd',
  },
  itemUnreadHover: {
    backgroundColor: '#bbdefb',
  },
  content: {
    flex: '1',
    paddingRight: '12px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '15px',
    fontWeight: '600',
  },
  body: {
    margin: '0 0 8px',
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.4',
  },
  time: {
    fontSize: '12px',
    color: '#888',
    display: 'block',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0 4px',
    alignSelf: 'flex-start',
    opacity: '0',
    transition: 'opacity 0.2s, color 0.2s',
  },
  deleteButtonVisible: {
    opacity: '1',
  },
  deleteButtonHover: {
    color: '#f44336',
  },
  debugPanel: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    zIndex: 9999,
    maxWidth: '300px',
  },
};

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const loadNotificationsFromStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        
        const formattedNotifications = parsedData.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        
        
        const uniqueNotifications = [];
        const seenIds = new Set();
        
        for (const notification of formattedNotifications) {
          if (!seenIds.has(notification.id)) {
            seenIds.add(notification.id);
            uniqueNotifications.push(notification);
          }
        }
        
        setNotifications(uniqueNotifications);
        
       
        const unread = uniqueNotifications.filter(n => !n.read).length;
        console.log("Số thông báo chưa đọc:", unread);
        setUnreadCount(unread);
      }
    } catch (error) {
    
      localStorage.removeItem(STORAGE_KEY);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

 
  const saveNotificationsToStorage = useCallback((notifs: Notification[]) => {
    try {
      const notifData = JSON.stringify(notifs);
      localStorage.setItem(STORAGE_KEY, notifData);
    } catch (error) {
      
    }
  }, []);

 
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
     
      if (prev.some(n => n.id === notification.id)) {
        return prev;
      }
      
      const updated = [notification, ...prev];
      
      // Lưu vào localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        // Handle silently
      }
      
    
      const unreadMessages = updated.filter(n => !n.read).length;
      setUnreadCount(unreadMessages);
      
      return updated;
    });
    
    // Hiển thị thông báo trình duyệt nếu được phép
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico'
        });
      } catch (error) {
        // Handle silently
      }
    }
  }, []);

  // Reset notifications for testing
  const resetNotifications = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize notifications and firebase messaging
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load existing notifications
    loadNotificationsFromStorage();
    
    // Track processed message IDs to avoid duplicates
    const processedMessageIds = new Set();
    
    try {
      const messaging = getMessaging(firebaseApp);
      
      // Option 1: Remove this direct onMessage listener completely
      // OR Option 2: Keep it but add deduplication logic
      const unsubscribe = onMessage(messaging, (payload) => {
        if (payload.notification) {
          // Generate a unique ID for this message
          const messageId = payload.data?.messageId || 
                           `${payload.notification.title}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
          
          // Skip if already processed
          if (processedMessageIds.has(messageId)) {
            return;
          }
          
          // Mark as processed
          processedMessageIds.add(messageId);
          
          const newNotification: Notification = {
            id: messageId,
            title: payload.notification.title || 'Thông báo mới',
            body: payload.notification.body || '',
            timestamp: new Date(),
            read: false,
            data: payload.data
          };
          
          addNotification(newNotification);
        }
      });
      
      // Setup service worker message listener with deduplication
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && (
              event.data.type === 'NEW_NOTIFICATION' || 
              (event.data.notification) ||
              (event.data.firebase)
            )) {
            
            // Get message ID for deduplication
            const messageId = event.data.messageId || 
                             `${event.data.notification?.title}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
            
            // Skip if already processed
            if (processedMessageIds.has(messageId)) {
              return;
            }
            
            // Mark as processed
            processedMessageIds.add(messageId);
            
            // Rest of your existing code...
            const notificationData = 
              event.data.notification || 
              (event.data.firebase && event.data.firebase.notification) || 
              event.data;
            
            const title = notificationData.title || 
                        (notificationData.notification && notificationData.notification.title) || 
                        'Thông báo mới';
            const body = notificationData.body || 
                       (notificationData.notification && notificationData.notification.body) || 
                       '';
            
            const newNotification: Notification = {
              id: messageId,
              title: title,
              body: body,
              timestamp: new Date(),
              read: false,
              data: event.data.data || {}
            };
            
            addNotification(newNotification);
          }
        });
      }
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
      
    } catch (error) {
      // Handle silently
    }
  }, [isAuthenticated, addNotification, loadNotificationsFromStorage]);

  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      );
      
      saveNotificationsToStorage(updated);
      return updated;
    });
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [saveNotificationsToStorage]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      saveNotificationsToStorage(updated);
      return updated;
    });
    
    setUnreadCount(0);
  }, [saveNotificationsToStorage]);

  // Delete a notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const updated = prev.filter(n => n.id !== id);
      
      saveNotificationsToStorage(updated);
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
  }, [saveNotificationsToStorage]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Add test notification (for debugging)
  const addTestNotification = useCallback(() => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'Thông báo test',
      body: 'Đây là thông báo test ' + new Date().toLocaleTimeString(),
      timestamp: new Date(),
      read: false
    };
    
    addNotification(newNotification);
  }, [addNotification]);

  // Format date for display
  const formatNotificationTime = (date: Date) => {
    try {
      return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Truncate text for display
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Toggle debug panel (hidden in production)
  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };

  // Handle bell icon hover
  const handleBellHover = (hovered: boolean) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = hovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent';
    };
  };

  // Thêm function này
  const requestNotificationPermission = async () => {
    try {
      await Notification.requestPermission();
    } catch (error) {
     
    }
  };

  
  const forceResetNotifications = () => {
    localStorage.removeItem(STORAGE_KEY);
    setNotifications([]);
    setUnreadCount(0);
    console.log("Đã reset toàn bộ thông báo");
  };

  return (
    <div style={styles.container}>
    
      <div 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: -1 }} 
        onDoubleClick={toggleDebug}
      />
      
      {/* Debug panel */}
      {showDebug && (
        <div style={styles.debugPanel}>
          <div>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
          <div>notificationCount: {notifications.length}</div>
          <div>unreadCount: {unreadCount}</div>
          <div>Thông báo chưa đọc thực tế: {notifications.filter(n => !n.read).length}</div>
          <button onClick={addTestNotification}>Add Test</button>
          <button onClick={resetNotifications}>Reset</button>
          <button onClick={forceResetNotifications} style={{backgroundColor: 'red', color: 'white'}}>
            Force Reset
          </button>
          <button onClick={requestNotificationPermission}>Request Permission</button>
          <button onClick={toggleDebug}>Close</button>
        </div>
      )}
      
      {/* Bell Icon */}
      <div 
        style={styles.bellIcon}
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseEnter={handleBellHover(true)}
        onMouseLeave={handleBellHover(false)}
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={styles.dropdown} ref={dropdownRef}>
          <div style={styles.header}>
            <h3 style={styles.headerTitle}>Thông báo</h3>
            <div style={styles.actions}>
              {notifications.length > 0 && (
                <>
                  <button 
                    style={{
                      ...styles.actionButton,
                      ...(unreadCount === 0 ? styles.actionButtonDisabled : {})
                    }}
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    onMouseEnter={(e) => {
                      if (unreadCount > 0) {
                        e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                  <button 
                    style={{
                      ...styles.actionButton,
                      ...styles.deleteAllButton
                    }}
                    onClick={clearAllNotifications}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Xóa tất cả
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={styles.listContainer}>
            {notifications.length === 0 ? (
              <div style={styles.noNotifications}>
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <ul style={styles.list}>
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    style={{
                      ...styles.item,
                      ...(notification.read ? {} : styles.itemUnread),
                      ...(hoveredItem === notification.id ? 
                          (notification.read ? styles.itemHover : styles.itemUnreadHover) 
                          : {})
                    }}
                    onClick={() => markAsRead(notification.id)}
                    onMouseEnter={() => setHoveredItem(notification.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={styles.content}>
                      <h4 style={styles.title}>{notification.title}</h4>
                      <p style={styles.body}>
                        {truncateText(notification.body, 100)}
                      </p>
                      <span style={styles.time}>
                        {formatNotificationTime(notification.timestamp)}
                      </span>
                    </div>
                    <button 
                      style={{
                        ...styles.deleteButton,
                        ...(hoveredItem === notification.id ? styles.deleteButtonVisible : {})
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f44336';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#999';
                      }}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;