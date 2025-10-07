import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkshopCardProps {
  id: number;
  name: string;
  location: string;
  commercialRegistrationNumber: string;
  verified: boolean;
  imageUrl: string; // New prop for the image URL
  className?: string;
}

const WorkshopCard = ({
  id,
  name,
  location,
  commercialRegistrationNumber,
  verified,
  imageUrl, // Destructure the new prop
  className,
}: WorkshopCardProps) => {
  return (
    <div 
      className={cn(
        'glass-card premium-hover overflow-hidden transition-all duration-300 border border-border/50 shadow-sm',
        className
      )}
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover transition-transform duration-700" 
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-medium text-lg leading-tight">{name}</h3>
          {verified && (
            <CheckCircle size={20} className="text-green-500" aria-label="Verified" />
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        <div className="mb-4">
          <span className="text-xs font-medium">رقم التسجيل التجاري: {commercialRegistrationNumber}</span>
        </div>

        <Link 
          to={`/workshop/${id}`}
          className="block w-full button-primary text-center text-sm"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default WorkshopCard;
