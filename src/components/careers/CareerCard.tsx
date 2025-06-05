import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import { Career } from '../../types';

interface CareerCardProps {
  career: Career;
}

const CareerCard: React.FC<CareerCardProps> = ({ career }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Link to={`/career/${career.id}`}>
      <Card hoverable className="h-full transition-all duration-300">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={career.image} 
            alt={career.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardBody>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {career.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {career.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {career.personalityType.slice(0, 2).map((type, index) => (
              <span 
                key={index}
                className="inline-block bg-secondary-50 text-secondary-700 text-xs px-2 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-700 mb-3">
            <span className="font-medium">Mức lương: </span>
            <span>{formatCurrency(career.salary.min)} - {formatCurrency(career.salary.max)}</span>
          </div>
          <div className="flex justify-end items-center">
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

export default CareerCard;