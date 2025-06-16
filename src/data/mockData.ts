import { User, Major, ChatSession, Career, SystemStatus, SystemLog, QuickReply } from '../types';

// export const mockUsers: User[] = [
// //   {
//     id: 'user_1',
//     fullName: 'Nguyễn Văn An',
//     email: 'student@example.com',
//     role: 'student',
//     avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=200',
//     grade: 11,
//     school: 'THPT Chu Văn An',
//     province: 'Hà Nội',
//     interests: ['CNTT', 'Toán học', 'Vật lý'],
//     createdAt: '2023-09-15T08:00:00Z'
//   }, 
//   {
//     id: 'user_2',
//     fullName: 'Trần Thị Bình',
//     email: 'teacher@example.com',
//     role: 'teacher',
//     avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
//     school: 'THPT Nguyễn Huệ',
//     province: 'TP.HCM',
//     createdAt: '2023-08-10T10:30:00Z'
//   },
//   {
//     id: 'user_3',
//     fullName: 'Lê Văn Công',
//     email: 'counselor@example.com',
//     role: 'counselor',
//     avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
//     province: 'Đà Nẵng',
//     createdAt: '2023-07-05T09:15:00Z'
//   },
//   {
//     id: 'user_4',
//     fullName: 'Phạm Thị Dung',
//     email: 'admin@example.com',
//     role: 'admin',
//     avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
//     createdAt: '2023-06-20T14:20:00Z'
//   }
// ];

export const mockMajors: Major[] = [
  {
    id: 'major_1',
    name: 'Công nghệ thông tin',
    description: 'Ngành học về lập trình, thiết kế và phát triển phần mềm, hệ thống thông tin, trí tuệ nhân tạo và an ninh mạng.',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
    universities: [
      { id: 'uni_1', name: 'Đại học Bách khoa Hà Nội', location: 'Hà Nội', websiteUrl: 'https://hust.edu.vn' },
      { id: 'uni_2', name: 'Đại học Công nghệ - ĐHQGHN', location: 'Hà Nội', websiteUrl: 'https://uet.vnu.edu.vn' },
      { id: 'uni_3', name: 'Đại học FPT', location: 'Nhiều cơ sở', websiteUrl: 'https://fpt.edu.vn' }
    ],
    careers: ['Lập trình viên', 'Kỹ sư phần mềm', 'Chuyên gia an ninh mạng', 'Quản trị hệ thống'],
    subjects: ['Toán', 'Vật lý', 'Tiếng Anh'],
    category: 'Kỹ thuật'
  },
  {
    id: 'major_2',
    name: 'Y đa khoa',
    description: 'Ngành học về chẩn đoán, điều trị và phòng ngừa bệnh tật ở người, đào tạo bác sĩ đa khoa.',
    image: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=600',
    universities: [
      { id: 'uni_4', name: 'Đại học Y Hà Nội', location: 'Hà Nội', websiteUrl: 'https://hmu.edu.vn' },
      { id: 'uni_5', name: 'Đại học Y Dược TP.HCM', location: 'TP.HCM', websiteUrl: 'https://yds.edu.vn' }
    ],
    careers: ['Bác sĩ đa khoa', 'Bác sĩ chuyên khoa', 'Nghiên cứu y học'],
    subjects: ['Sinh học', 'Hóa học', 'Vật lý'],
    category: 'Y tế'
  },
  {
    id: 'major_3',
    name: 'Thiết kế đồ họa',
    description: 'Ngành học về nghệ thuật thị giác, thiết kế hình ảnh, quảng cáo, giao diện và trải nghiệm người dùng.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    universities: [
      { id: 'uni_6', name: 'Đại học Mỹ thuật Việt Nam', location: 'Hà Nội', websiteUrl: 'https://mthuat.vn' },
      { id: 'uni_7', name: 'Đại học Kiến trúc TP.HCM', location: 'TP.HCM', websiteUrl: 'https://uah.edu.vn' },
      { id: 'uni_8', name: 'Đại học FPT', location: 'Nhiều cơ sở', websiteUrl: 'https://fpt.edu.vn' }
    ],
    careers: ['Nhà thiết kế đồ họa', 'Nhà thiết kế UI/UX', 'Giám đốc nghệ thuật'],
    subjects: ['Văn học', 'Mỹ thuật', 'Tiếng Anh'],
    category: 'Nghệ thuật'
  },
  {
    id: 'major_4',
    name: 'Quản trị kinh doanh',
    description: 'Ngành học về quản lý doanh nghiệp, marketing, tài chính và chiến lược phát triển kinh doanh.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
    universities: [
      { id: 'uni_9', name: 'Đại học Kinh tế Quốc dân', location: 'Hà Nội', websiteUrl: 'https://neu.edu.vn' },
      { id: 'uni_10', name: 'Đại học Ngoại thương', location: 'Nhiều cơ sở', websiteUrl: 'https://ftu.edu.vn' }
    ],
    careers: ['Quản lý dự án', 'Chuyên viên marketing', 'Giám đốc điều hành'],
    subjects: ['Toán', 'Tiếng Anh', 'Văn học'],
    category: 'Kinh tế'
  },
  {
    id: 'major_5',
    name: 'Kỹ thuật điện - điện tử',
    description: 'Ngành học về hệ thống điện, thiết bị điện tử, tự động hóa và các ứng dụng công nghệ cao.',
    image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=600',
    universities: [
      { id: 'uni_1', name: 'Đại học Bách khoa Hà Nội', location: 'Hà Nội', websiteUrl: 'https://hust.edu.vn' },
      { id: 'uni_11', name: 'Đại học Bách khoa TP.HCM', location: 'TP.HCM', websiteUrl: 'https://hcmut.edu.vn' }
    ],
    careers: ['Kỹ sư điện', 'Kỹ sư điện tử', 'Chuyên gia tự động hóa'],
    subjects: ['Toán', 'Vật lý', 'Hóa học'],
    category: 'Kỹ thuật'
  },
  {
    id: 'major_6',
    name: 'Ngôn ngữ Anh',
    description: 'Ngành học về ngôn ngữ, văn hóa và văn học Anh-Mỹ, đào tạo các kỹ năng ngôn ngữ Anh toàn diện.',
    image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=600',
    universities: [
      { id: 'uni_12', name: 'Đại học Ngoại ngữ - ĐHQGHN', location: 'Hà Nội', websiteUrl: 'https://ulis.vnu.edu.vn' },
      { id: 'uni_13', name: 'Đại học Sư phạm TP.HCM', location: 'TP.HCM', websiteUrl: 'https://hcmue.edu.vn' }
    ],
    careers: ['Biên phiên dịch', 'Giáo viên tiếng Anh', 'Chuyên viên quan hệ quốc tế'],
    subjects: ['Tiếng Anh', 'Văn học', 'Lịch sử'],
    category: 'Ngôn ngữ'
  }
];

export const mockCareers: Career[] = [
  {
    id: 'career_1',
    name: 'Kỹ sư phần mềm',
    description: 'Phát triển, thiết kế và bảo trì phần mềm cho nhiều lĩnh vực khác nhau như web, mobile, AI.',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=600',
    personalityType: ['Hướng nội', 'Phân tích', 'Logic'],
    relatedMajors: ['Công nghệ thông tin', 'Kỹ thuật máy tính'],
    skills: ['Lập trình', 'Giải quyết vấn đề', 'Làm việc nhóm', 'Tiếng Anh'],
    salary: { min: 15000000, max: 60000000, currency: 'VND' }
  },
  {
    id: 'career_2',
    name: 'Bác sĩ đa khoa',
    description: 'Khám, chẩn đoán và điều trị bệnh cho bệnh nhân, tư vấn chăm sóc sức khỏe.',
    image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600',
    personalityType: ['Hướng ngoại', 'Cảm thông', 'Chăm chỉ'],
    relatedMajors: ['Y đa khoa', 'Y học cổ truyền'],
    skills: ['Kiến thức y khoa', 'Giao tiếp', 'Đồng cảm', 'Quyết đoán'],
    salary: { min: 20000000, max: 100000000, currency: 'VND' }
  },
  {
    id: 'career_3',
    name: 'Nhà thiết kế đồ họa',
    description: 'Sáng tạo hình ảnh, logo, ấn phẩm quảng cáo và giao diện số cho thương hiệu và sản phẩm.',
    image: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=600',
    personalityType: ['Sáng tạo', 'Nghệ thuật', 'Chi tiết'],
    relatedMajors: ['Thiết kế đồ họa', 'Mỹ thuật ứng dụng'],
    skills: ['Thiết kế', 'Sáng tạo', 'Phần mềm đồ họa', 'Thẩm mỹ'],
    salary: { min: 10000000, max: 40000000, currency: 'VND' }
  },
  {
    id: 'career_4',
    name: 'Giáo viên trung học',
    description: 'Giảng dạy, hướng dẫn và đánh giá học sinh, phát triển giáo trình và tổ chức hoạt động ngoại khóa.',
    image: 'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=600',
    personalityType: ['Kiên nhẫn', 'Hướng ngoại', 'Tổ chức'],
    relatedMajors: ['Sư phạm', 'Ngôn ngữ'],
    skills: ['Giao tiếp', 'Thuyết trình', 'Quản lý lớp học', 'Chuyên môn'],
    salary: { min: 8000000, max: 25000000, currency: 'VND' }
  },
  {
    id: 'career_5',
    name: 'Nhà quản trị kinh doanh',
    description: 'Lập kế hoạch, điều hành và phát triển chiến lược kinh doanh cho doanh nghiệp.',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
    personalityType: ['Quyết đoán', 'Lãnh đạo', 'Giao tiếp'],
    relatedMajors: ['Quản trị kinh doanh', 'Marketing', 'Tài chính - Ngân hàng'],
    skills: ['Lãnh đạo', 'Ra quyết định', 'Giao tiếp', 'Phân tích'],
    salary: { min: 20000000, max: 80000000, currency: 'VND' }
  }
];

export const mockChatSessions: ChatSession[] = [
  {
    id: 'chat_1',
    userId: 'user_1',
    title: 'Tư vấn ngành CNTT',
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Tôi muốn tìm hiểu về ngành Công nghệ thông tin',
        timestamp: '2024-05-10T09:30:00Z'
      },
      {
        id: 'msg_2',
        role: 'bot',
        content: 'Chào bạn! Công nghệ thông tin là một ngành học rất phổ biến và có nhiều cơ hội việc làm. Bạn quan tâm đến lĩnh vực nào trong CNTT (phát triển phần mềm, mạng máy tính, an ninh mạng, trí tuệ nhân tạo...)?',
        timestamp: '2024-05-10T09:30:05Z'
      },
      {
        id: 'msg_3',
        role: 'user',
        content: 'Tôi thích lập trình và trí tuệ nhân tạo',
        timestamp: '2024-05-10T09:31:00Z'
      },
      {
        id: 'msg_4',
        role: 'bot',
        content: 'Tuyệt vời! Lập trình và trí tuệ nhân tạo là những lĩnh vực đang phát triển mạnh. Để học tốt những lĩnh vực này, bạn nên có nền tảng tốt về toán học, đặc biệt là đại số, thống kê và giải tích. Một số trường đại học có thế mạnh về AI ở Việt Nam bao gồm: Đại học Bách khoa Hà Nội, Đại học Công nghệ - ĐHQGHN, Đại học FPT. Bạn đang học lớp mấy?',
        timestamp: '2024-05-10T09:31:15Z'
      }
    ],
    createdAt: '2024-05-10T09:30:00Z',
    updatedAt: '2024-05-10T09:31:15Z'
  },
  {
    id: 'chat_2',
    userId: 'user_1',
    title: 'Hỏi về kỳ thi THPT',
    messages: [
      {
        id: 'msg_5',
        role: 'user',
        content: 'Làm thế nào để chuẩn bị tốt cho kỳ thi THPT Quốc gia?',
        timestamp: '2024-05-12T14:20:00Z'
      },
      {
        id: 'msg_6',
        role: 'bot',
        content: 'Để chuẩn bị tốt cho kỳ thi THPT Quốc gia, bạn nên:\n\n1. Lập kế hoạch ôn tập chi tiết cho từng môn học\n2. Tập trung vào các dạng bài thường gặp trong đề thi\n3. Làm nhiều đề thi thử và đề thi các năm trước\n4. Tham gia các nhóm học tập để trao đổi kiến thức\n5. Đảm bảo sức khỏe và tinh thần thoải mái\n\nBạn cần hỗ trợ cụ thể cho môn học nào?',
        timestamp: '2024-05-12T14:20:10Z'
      }
    ],
    createdAt: '2024-05-12T14:20:00Z',
    updatedAt: '2024-05-12T14:20:10Z'
  }
];

export const mockQuickReplies: QuickReply[] = [
  { id: 'qr_1', text: 'Tư vấn ngành học phù hợp', action: 'SUGGEST_MAJOR' },
  { id: 'qr_2', text: 'Thông tin về kỳ thi THPT', action: 'EXAM_INFO' },
  { id: 'qr_3', text: 'Điểm chuẩn các trường đại học', action: 'ADMISSION_SCORES' },
  { id: 'qr_4', text: 'Tư vấn nghề nghiệp theo tính cách', action: 'PERSONALITY_CAREER' },
  { id: 'qr_5', text: 'Học bổng du học', action: 'SCHOLARSHIP_INFO' }
];

export const mockSystemStatus: SystemStatus = {
  status: 'online',
  uptime: 98.7,
  lastUpdated: '2024-05-15T08:00:00Z',
  activeUsers: 245,
  totalSessions: 1879,
  responseTime: 1.2
};

export const mockSystemLogs: SystemLog[] = [
  {
    id: 'log_1',
    level: 'info',
    message: 'Hệ thống khởi động thành công',
    timestamp: '2024-05-15T06:00:00Z',
    source: 'system'
  },
  {
    id: 'log_2',
    level: 'warning',
    message: 'Tải CPU cao (85%) trong 5 phút',
    timestamp: '2024-05-15T10:15:00Z',
    source: 'monitoring'
  },
  {
    id: 'log_3',
    level: 'error',
    message: 'Không thể kết nối đến dịch vụ AI phân tích dữ liệu',
    timestamp: '2024-05-15T12:30:00Z',
    source: 'ai-service'
  },
  {
    id: 'log_4',
    level: 'info',
    message: 'Cập nhật dữ liệu điểm chuẩn 2023 thành công',
    timestamp: '2024-05-15T14:45:00Z',
    source: 'data-updater'
  }
];