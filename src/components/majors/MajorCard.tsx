import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import { Major } from '../../types';

interface MajorCardProps {
  major: Major;
}

const MajorCard: React.FC<MajorCardProps> = ({ major }) => {
  return (
    <Link to={`/majors/${major.id}`}>
      <Card hoverable className="h-full transition-all duration-300">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={major.image} 
            alt={major.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardBody>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {major.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {major.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {major.subjects.slice(0, 3).map((subject, index) => (
              <span 
                key={index}
                className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
              >
                {subject}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {major.universities.length} trường đại học
            </span>
            <div className="text-primary-600 flex items-center text-sm font-medium">
              <span>Chi tiết</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default MajorCard;