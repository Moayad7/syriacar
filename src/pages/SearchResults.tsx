import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import CarCard from "../components/CarCard";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import axios from "../config/axiosConfig";
import Spinner from "@/components/ui/Spinner";
import { useCarContext } from "@/components/CarProvider";

// Define the shape of the car data
interface CarData {
  id: string;
  name?: string;
  year?: number;
  mileage?: number;
  fuel_type?: string;
  imageUrl?: string;
  featured?: boolean;
  offer?: {
    price: number;
    location: string;
  } | null;
}

const SearchResults = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchResults } = useCarContext();

  // تحقق من أن searchResults موجود وليس null
  const safeSearchResults = searchResults || [];

  return (
    <MainLayout>
      <SEO
        title="نتائج البحث عن السيارات"
        description="استعرض نتائج البحث عن السيارات المتاحة."
        canonicalUrl="/search-results"
        keywords="سيارات للبيع, سيارات مستعملة, سيارات جديدة"
      />
      <div className="container-custom py-28">
        <h1 className="heading-2 mb-6">نتائج البحث:</h1>

        {/* Cars Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">السيارات المتاحة</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : safeSearchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeSearchResults.map((car: CarData) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  title={car.name || "سيارة بدون اسم"}
                  price={car.offer?.price || 0}
                  location={car.offer?.location || "موقع غير محدد"}
                  year={car.year}
                  mileage={car.mileage}
                  fuel={car.fuel_type}
                  imageUrl={car.imageUrl}
                  featured={car.featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">لا توجد نتائج مطابقة</h3>
              <p className="text-muted-foreground">
                لم نتمكن من العثور على أي سيارات تطابق معايير البحث الخاصة بك.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResults;