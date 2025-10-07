import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import CarCard from "../components/CarCard";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SEO from "../components/SEO";
import axios from "../config/axiosConfig";
import Spinner from "@/components/ui/Spinner";

const CarListings = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const carsPerPage = 6; // Number of cars to display per page

  // Fetch car data from the API with pagination
  const fetchCars = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: carsPerPage.toString(),
        ...filters
      });

      const response = await axios.get(`/api/cars?${params}`);
      setCars(response.data.data);
      setTotalPages(response.data.pagination.last_page);
      setTotalCars(response.data.pagination.total);
      setLoading(false);
      console.log(response.data.pagination)
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("حدث خطأ أثناء تحميل السيارات");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const handleFilter = () => {
    const brand = document.querySelector('select[name="carBrand"]').value;
    const pricemin = priceRange[0];
    const pricemax = priceRange[1];
    
    const filters = {};
    if (brand) filters.brand = brand;
    if (pricemin > 0) filters['price[min]'] = pricemin;
    if (pricemax < 100000) filters['price[max]'] = pricemax;
    
    setCurrentPage(1); // Reset to first page when filtering
    fetchCars(1, filters);
  };

  // Structured data for the car listings page
  const carListingsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Car",
        name: car.title,
        offers: {
          "@type": "Offer",
          price: car.price,
          priceCurrency: "USD",
        },
        vehicleModelDate: car.year,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: car.kilometers,
          unitCode: "KMT",
        },
      },
    })),
  };

  return (
    <MainLayout structuredData={carListingsStructuredData}>
      <SEO
        title="تصفح السيارات المتاحة في سوريا | مركز السيارات السوري"
        description="تصفح مجموعتنا الواسعة من السيارات الجديدة والمستعملة في سوريا. مجموعة متنوعة من العلامات التجارية والموديلات والأسعار."
        canonicalUrl="/car-listings"
        keywords="سيارات للبيع في سوريا, سيارات مستعملة, سيارات جديدة, شراء سيارات"
      />
      <div className="container-custom py-28">
        <h1 className="heading-2 mb-6">تصفح السيارات المتاحة</h1>

        {/* Search and Filters Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث عن سيارة..."
                className="w-full pr-10 py-2 pl-4 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1 /2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>فلترة</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {showFilters && (
            <div className="items-center grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border/50">
              <div>
                <h3 className="font-medium mb-3">نطاق السعر</h3>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={100000}
                  step={1000}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} $</span>
                  <span>{priceRange[1]} $</span>
                </div>
              </div>

              <div>
                <select
                  name="carBrand"
                  className="w-full bg-white border border-input rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="">جميع الماركات</option>
                  <option value="toyota">تويوتا</option>
                  <option value="honda">هوندا</option>
                  <option value="bmw">بي إم دبليو</option>
                  <option value="mercedes">مرسيدس</option>
                  <option value="kia">كيا</option>
                </select>
              </div>

              <div>
                <Button onClick={handleFilter}>ابحث</Button>
              </div>
            </div>
          )}
        </div>

        {/* Featured Cars Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">السيارات المميزة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
      <Spinner />
    ) : (
      cars
        .filter((car) => car.is_featured)
        .map((car) => (
          <CarCard
            key={car.id}
            id={car.id}
            title={car.name}
            price={car.offer?.price || 0}
            location={car.offer?.location || ""}
            year={car.year}
            mileage={car.mileage}
            fuel={car.fuel_type}
            imageUrl={car.images?.[0] || ""}
            featured={car.offer?.featured || false} // Add optional chaining here
            images={car.images}          />
        ))
    )}
          </div>
        </div>

        {/* All Cars Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">جميع السيارات المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
      <Spinner />
    ) : (
      cars.map((car) => (
        <CarCard
          key={car.id}
          id={car.id}
          title={car.name}
          price={car.offer?.price || 0}
          location={car.offer?.location || ""}
          year={car.year}
          mileage={car.mileage}
          fuel={car.fuel_type}
          imageUrl={car.images?.[0] || ""}
          featured={car.offer?.featured || false} // Add optional chaining here
          images={car.images}        />
      ))
    )}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              السابق
            </Button>
            <span className="mx-4">
              صفحة {currentPage} من {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CarListings;