import React from 'react';
import { ChevronRight, BookOpen, Briefcase, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      title: 'Tư vấn ngành học',
      description: 'Khám phá các ngành học phù hợp với sở thích, năng lực và định hướng tương lai của bạn.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      title: 'Định hướng nghề nghiệp',
      description: 'Hiểu rõ về các lộ trình nghề nghiệp và cơ hội việc làm trong tương lai.'
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: 'Kỹ năng học tập',
      description: 'Nâng cao phương pháp học tập hiệu quả và kỹ năng chuẩn bị cho kỳ thi.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'Trò chuyện thông minh',
      description: 'Tương tác với EduBot mọi lúc, mọi nơi để được giải đáp thắc mắc.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-light to-secondary-light py-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              EduBot – Đồng hành cùng học sinh THPT
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Nền tảng trí tuệ nhân tạo giúp học sinh THPT định hướng ngành học, nghề nghiệp tương lai và nâng cao kỹ năng học tập hiệu quả.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/chatbot" className="btn-primary flex items-center justify-center">
                Bắt đầu tư vấn
                <ChevronRight className="ml-1 w-5 h-5" />
              </Link>
              <Link to="/majors" className="btn-outline flex items-center justify-center">
                Khám phá ngành học
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">EduBot giúp gì cho bạn?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp giải pháp toàn diện để hỗ trợ học sinh THPT trong hành trình phát triển bản thân và lựa chọn tương lai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:border-primary transition-all duration-300">
              <div className="bg-gray-50 p-4 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Sẵn sàng khám phá tương lai của bạn?
                </h2>
                <p className="text-white text-opacity-90 mb-8">
                  EduBot luôn sẵn sàng trò chuyện, giải đáp mọi thắc mắc và giúp bạn tìm ra con đường phù hợp nhất.
                </p>
                <Link
                  to="/chatbot"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition duration-300 shadow-md inline-flex items-center justify-center"
                >
                  Trò chuyện ngay với EduBot
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Link>
              </div>
              <div className="md:w-1/2 relative">
                <img
                  src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg"
                  alt="Học sinh đang học"
                  className="object-cover w-full h-full min-h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Người dùng nói gì về EduBot?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hàng nghìn học sinh THPT đã tìm ra định hướng tương lai nhờ sự hỗ trợ từ EduBot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card">
              <div className="flex space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "EduBot đã giúp mình hiểu rõ hơn về bản thân và các ngành học phù hợp. Mình đã quyết định được ngành học đại học dựa trên sự tư vấn của EduBot."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
                  {['H', 'M', 'T'][item - 1]}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-800">
                    {['Hoàng Minh', 'Minh Anh', 'Thảo Nguyên'][item - 1]}
                  </h4>
                  <p className="text-sm text-gray-500">Học sinh lớp {10 + item}, THPT Chu Văn An</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;