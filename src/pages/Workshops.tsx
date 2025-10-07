import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import axiosInstance from "@/config/axiosConfig";
import axios from "@/config/axiosConfig";
import WorkshopCard from "@/components/WorkshopCard";
import Spinner from "@/components/ui/Spinner";

const Workshops = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workShops, setWorkShops] = useState([]);
  const [selectedCity, setSelectedCity] = useState("جميع المدن");
  const [cities, setCities] = useState(["جميع المدن"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workshops data from the API
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const response = await axios.get("api/workshops");
        setWorkShops(response.data.data);
        console.log(response.data.data);
        
        // Extract unique cities from workshops
        const uniqueCities = [...new Set(response.data.data.map(item => item.city))];
        setCities(["جميع المدن", ...uniqueCities]);
        
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError("حدث خطأ أثناء تحميل ورش العمل");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Filter workshops based on selected city and search query
  const filteredWorkshops = useMemo(() => {
    return workShops.filter(workshop => {
      // Filter by city
      const cityMatch = selectedCity === "جميع المدن" || workshop.city === selectedCity;
      
      // Filter by search query
      const searchMatch = searchQuery === "" || 
        workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (workshop.description && workshop.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (workshop.services && workshop.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      return cityMatch && searchMatch;
    });
  }, [workShops, selectedCity, searchQuery]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-28 flex justify-center items-center h-96">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container-custom py-28 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO
        title="ورش السيارات في سوريا - مراكز الصيانة والفحص | مركز السيارات السوري"
        description="تصفح قائمة ورش السيارات والمراكز المعتمدة للفحص والصيانة في جميع المدن السورية. ورش توفر ضمان على السيارات المستعملة."
        canonicalUrl="/workshops"
        keywords="ورش سيارات سوريا, مراكز صيانة, فحص سيارات, ضمان سيارات مستعملة, ميكانيك سيارات"
      />
      <div className="container-custom py-28">
        <div className="mb-8">
          <h1 className="heading-2 mb-4">ورش السيارات المعتمدة</h1>
          <p className="text-muted-foreground max-w-3xl">
            تصفح قائمة ورش السيارات والمراكز المعتمدة للفحص والصيانة في جميع
            المدن السورية. بعض هذه الورش توفر ضمان على السيارات المستعملة بعد
            فحصها والتأكد من سلامتها.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث عن ورشة أو خدمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* City Tabs */}
        <Tabs
          defaultValue={selectedCity}
          onValueChange={setSelectedCity}
          className="mb-10"
        >
          <TabsList className="w-full justify-start overflow-auto">
            {cities.map((city) => (
              <TabsTrigger key={city} value={city} className="px-6">
                {city}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCity}>
            {filteredWorkshops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    id={workshop.id}
                    name={workshop.name}
                    location={workshop.location || workshop.address}
                    commercialRegistrationNumber={workshop.commercial_registration_number}
                    verified={workshop.warrantyOffered || false}
                    imageUrl={workshop.imageUrl || ""}
                    rating={workshop.rating}
                    reviewCount={workshop.reviewCount}
                    description={workshop.description}
                    phone={workshop.phone}
                    workingHours={workshop.workingHours}
                    services={workshop.services}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <Building2
                  size={48}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <h3 className="text-xl font-medium mb-2">
                  لا توجد ورش مطابقة للبحث
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `لم نتمكن من العثور على أي ورش تطابق "${searchQuery}"`
                    : `لا توجد ورش في ${selectedCity === "جميع المدن" ? "أي مدينة" : selectedCity}`
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Workshops;