import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import CareerCard from '../components/careers/CareerCard';
import Input from '../components/ui/Input';
import { mockCareers } from '../data/mockData';

const Career: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');

  // Extract unique personality types
  const personalityTypes = Array.from(
    new Set(mockCareers.flatMap(career => career.personalityType))
  ).sort();

  // Filter careers based on search term and personality type
  const filteredCareers = mockCareers.filter(career => {
    const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPersonality = selectedPersonality === '' || 
                               career.personalityType.includes(selectedPersonality);
    return matchesSearch && matchesPersonality;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary-500 to-secondary-700 py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Định hướng nghề nghiệp
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Khám phá các nghề nghiệp phù hợp với tính cách, sở thích và khả năng của bạn
            </p>
            <div className="max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Tìm kiếm nghề nghiệp..."
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

      {/* Personality Types Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tìm nghề phù hợp theo tính cách
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              className={`p-4 rounded-lg border text-center transition-all ${
                selectedPersonality === ''
                  ? 'bg-secondary-100 border-secondary-300 text-secondary-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPersonality('')}
            >
              <span className="block font-semibold">Tất cả</span>
            </button>
            {personalityTypes.map((type) => (
              <button
                key={type}
                className={`p-4 rounded-lg border text-center transition-all ${
                  selectedPersonality === type
                    ? 'bg-secondary-100 border-secondary-300 text-secondary-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPersonality(type)}
              >
                <span className="block font-semibold">{type}</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Career Cards */}
      <section className="py-12">
        <Container>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Tìm thấy {filteredCareers.length} nghề nghiệp
              {selectedPersonality && ` phù hợp với tính cách "${selectedPersonality}"`}
              {searchTerm && ` với từ khóa "${searchTerm}"`}
            </p>
          </div>

          {/* Career Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>

          {/* No Results */}
          {filteredCareers.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Không tìm thấy nghề nghiệp phù hợp
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

export default Career;