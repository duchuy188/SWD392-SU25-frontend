import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import MajorCard from '../components/majors/MajorCard';
import Input from '../components/ui/Input';
import { majorServices } from '../services/majorService';
import { Major } from '../types';

// Define types for API responses
interface MajorListResponse {
  majors: Major[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  filters?: {
    departments: string[];
    subjects: string[];
    campuses: string[];
  };
}

// Thêm interface này sau interface MajorListResponse
interface ApiMajor {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  department?: string;
  code?: string;
  subjectCombinations?: string[];
  availableAt?: string[];
  careerProspects?: Array<{title: string, description: string}>;
  isNewProgram?: boolean;
 
}

const Majors: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 
  useEffect(() => {
    const fetchMajors = async () => {
      setLoading(true);
      try {
        const response = await majorServices.getAllMajors(page, searchTerm, selectedDepartment);
        const data = response.data as { 
          majors: ApiMajor[]; 
          totalPages: number;
          currentPage: number;
          totalItems: number;
          filters?: MajorListResponse['filters'];
        };
        
        const formattedMajors = data.majors.map(apiMajor => ({
          id: apiMajor.id,
          name: apiMajor.name,
          description: apiMajor.description || '',
          image: apiMajor.imageUrl || '',
          universities: [], // Không có trong BE model
          careers: apiMajor.careerProspects?.map(c => c.title) || [],
          subjects: apiMajor.subjectCombinations || [],
          category: apiMajor.department || ''
        }));
        
        setMajors(formattedMajors);
        setTotalPages(data.totalPages);
        
        // Set departments for filtering if available
        if (data.filters?.departments) {
          setDepartments(data.filters.departments);
        }
      } catch (err) {
        console.error('Error fetching majors:', err);
        setError('Không thể tải dữ liệu ngành học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, [page, searchTerm, selectedDepartment]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle department filter change
  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

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
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Filter and Results */}
      <section className="py-12">
        <Container>
          {/* Department Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedDepartment === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleDepartmentChange('')}
            >
              Tất cả
            </button>
            {departments.map((department) => (
              <button
                key={department}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedDepartment === department
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleDepartmentChange(department)}
              >
                {department}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-500">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && (
            <div className="mb-6">
              <p className="text-gray-600">
                Tìm thấy {majors.length} ngành học
                {selectedDepartment && ` trong khoa "${selectedDepartment}"`}
                {searchTerm && ` với từ khóa "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* Major Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majors.map((major) => (
                <MajorCard key={major.id} major={major} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && majors.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Không tìm thấy ngành học phù hợp
              </h3>
              <p className="text-gray-600">
                Vui lòng thử lại với từ khóa khác hoặc bỏ bộ lọc hiện tại
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Trước
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show at most 5 page buttons
                  let pageNum;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    // If near the start, show first 5 pages
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    // If near the end, show last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Otherwise show 2 before and 2 after current page
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        pageNum === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tiếp
                </button>
              </nav>
            </div>
          )}
        </Container>
      </section>
    </MainLayout>
  );
};

export default Majors;