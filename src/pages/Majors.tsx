import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import MajorCard from '../components/majors/MajorCard';
import Input from '../components/ui/Input';
import { mockMajors } from '../data/mockData';
import { Major } from '../types';

const Majors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract unique categories
  const categories = Array.from(new Set(mockMajors.map(major => major.category)));

  // Filter majors based on search term and category
  const filteredMajors = mockMajors.filter(major => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          major.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || major.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Khám phá ngành học
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Tìm hiểu chi tiết về các ngành học đại học tại Việt Nam, từ chương trình đào tạo đến cơ hội việc làm
            </p>
            <div className="max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Tìm kiếm ngành học..."
                fullWidth
                leftIcon={<Search size={18} />}
                className="bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Filter and Results */}
      <section className="py-12">
        <Container>
          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Tìm thấy {filteredMajors.length} ngành học
              {selectedCategory && ` trong nhóm "${selectedCategory}"`}
              {searchTerm && ` với từ khóa "${searchTerm}"`}
            </p>
          </div>

          {/* Major Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMajors.map((major) => (
              <MajorCard key={major.id} major={major} />
            ))}
          </div>

          {/* No Results */}
          {filteredMajors.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Không tìm thấy ngành học phù hợp
              </h3>
              <p className="text-gray-600">
                Vui lòng thử lại với từ khóa khác hoặc bỏ bộ lọc hiện tại
              </p>
            </div>
          )}
        </Container>
      </section>
    </MainLayout>
  );
};

export default Majors;