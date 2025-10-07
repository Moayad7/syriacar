import React, { useEffect, useState } from "react";
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
import Spinner from "@/components/ui/Spinner";

// Mock data for workshops
const workshopsMockData = {
  دمشق: [
    {
      id: "w1",
      name: "ورشة النخبة للسيارات",
      description:
        "متخصصون في صيانة وفحص السيارات الألمانية واليابانية، مع خبرة أكثر من 15 عام.",
      address: "المزة - شارع الفيلات الغربية، دمشق",
      phone: "+963 11 123 4567",
      rating: 4.8,
      reviewCount: 124,
      workingHours: "8:00 ص - 6:00 م",
      services: [
        "فحص سيارات قبل الشراء",
        "صيانة دورية",
        "برمجة كمبيوتر",
        "إصلاح ميكانيك",
        "إصلاح كهرباء",
      ],
      warrantyOffered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1613214149028-69e4fd713edb?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "w2",
      name: "مركز الأمان للسيارات",
      description:
        "مركز متكامل لصيانة وإصلاح جميع أنواع السيارات الأوروبية والأمريكية والآسيوية.",
      address: "المالكي - شارع عبد المنعم رياض، دمشق",
      phone: "+963 11 234 5678",
      rating: 4.5,
      reviewCount: 89,
      workingHours: "9:00 ص - 7:00 م",
      services: [
        "فحص سيارات شامل",
        "صيانة محركات",
        "إصلاح أنظمة التعليق",
        "ضبط زوايا",
        "تبديل زيوت",
      ],
      warrantyOffered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    },
  ],
  حلب: [
    {
      id: "w3",
      name: "مركز الخبير للسيارات",
      description:
        "نقدم خدمات صيانة وإصلاح احترافية للسيارات بأيدي خبراء مهرة في مجال ميكانيك السيارات.",
      address: "الشهباء - شارع بارون، حلب",
      phone: "+963 21 345 6789",
      rating: 4.7,
      reviewCount: 112,
      workingHours: "8:30 ص - 6:30 م",
      services: [
        "فحص شامل للسيارات",
        "صيانة أنظمة التبريد",
        "إصلاح نظام الفرامل",
        "ميكانيك عام",
        "كهرباء سيارات",
      ],
      warrantyOffered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800",
    },
  ],
  حمص: [
    {
      id: "w4",
      name: "ورشة المحترف للسيارات",
      description:
        "نقدم خدمات صيانة احترافية لجميع أنواع السيارات مع ضمان الجودة والسرعة في الإنجاز.",
      address: "الحمراء - شارع الملعب، حمص",
      phone: "+963 31 456 7890",
      rating: 4.3,
      reviewCount: 67,
      workingHours: "8:00 ص - 5:30 م",
      services: [
        "فحص قبل الشراء",
        "برمجة كمبيوتر",
        "صيانة دورية",
        "تصليح العادم",
        "ميزان وضبط زوايا",
      ],
      warrantyOffered: false,
      imageUrl:
        "https://images.unsplash.com/photo-1570470835458-064ce9be6325?auto=format&fit=crop&q=80&w=800",
    },
  ],
  اللاذقية: [
    {
      id: "w5",
      name: "مركز الساحل للسيارات",
      description:
        "ورشة متخصصة بصيانة السيارات الأوروبية والأمريكية مع خبرة تتجاوز 20 عاماً.",
      address: "الصليبة - شارع 8 آذار، اللاذقية",
      phone: "+963 41 567 8901",
      rating: 4.6,
      reviewCount: 93,
      workingHours: "9:00 ص - 6:00 م",
      services: [
        "فحص شامل",
        "صيانة دورية",
        "برمجة كمبيوتر",
        "إصلاح ميكانيك",
        "إصلاح كهرباء",
        "تبديل زيوت",
      ],
      warrantyOffered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800",
    },
  ],
  طرطوس: [
    {
      id: "w6",
      name: "مركز الجودة للسيارات",
      description:
        "نقدم خدمات متكاملة لفحص وصيانة وإصلاح جميع أنواع السيارات بأحدث التقنيات.",
      address: "المشبكة - شارع الثورة، طرطوس",
      phone: "+963 43 678 9012",
      rating: 4.4,
      reviewCount: 71,
      workingHours: "8:30 ص - 5:30 م",
      services: [
        "فحص شامل",
        "صيانة محركات",
        "تشخيص أعطال",
        "ميكانيك عام",
        "كهرباء سيارات",
      ],
      warrantyOffered: true,
      imageUrl:
        "https://images.unsplash.com/photo-1606521568221-d8e04e2126df?auto=format&fit=crop&q=80&w=800",
    },
  ],
};

const Workshops = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workShops, setWorkShops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [selectedCity, setSelectedCity] = useState("ريف دمشق");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch car data from the API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("api/workshops"); // Adjust the endpoint as necessary
        setWorkShops(response.data.data);
        // setLoading(false);
        console.log(response.data.data);
        const cities2 = [];
        workShops.map((item) => {
          cities2.push(item.city);
        });

        const newCities = [...new Set(cities2)];
        setCities(newCities);
        // filterWorkshos()
        setLoading(true);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("حدث خطأ أثناء تحميل السيارات");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
    // city();
  }, []);

  // const cities = Object.keys(workshopsMockData);

  // const city = () => {
  //   const cities2 = [];
  //   workShops.map((item) => {
  //     cities2.push(item.city);
  //   });
  // const newCities = [...new Set(cities2)];
  // };

  // cities.push();
  // console.log(cities);
  // console.log(cities)
  // console.log(workShops);
  // console.log(workshopsMockData);

  // Filter workshops based on search query
  // const filterWorkshos = () => {
  //   const filteredWorkshops = workShops[selectedCity].filter(
  //     (workshop) =>
  //       workshop.name.includes(searchQuery) ||
  //       workshop.description.includes(searchQuery) ||
  //       workshop.services.some((service) => service.includes(searchQuery))
  //   );

  //   setFilteredWorkshops(filteredWorkshops);
  // };

  if (loading) {
    return <div>loading</div>;
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
        {/* <Tabs
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

          {cities.map((city) => (
            <TabsContent key={city} value={city}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWorkshops.length > 0 ? (
                  filteredWorkshops.map((workshop) => (
                    <Card key={workshop.id} className="overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={workshop.imageUrl}
                          alt={workshop.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{workshop.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} fill="currentColor" />
                            <span className="font-medium">
                              {workshop.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({workshop.reviewCount} تقييم)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <MapPin size={14} />
                          <span>{workshop.address}</span>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          {workshop.description}
                        </p>

                        {workshop.warrantyOffered && (
                          <div className="mb-4">
                            <Badge className="bg-green-600 text-white hover:bg-green-700 flex gap-1 items-center w-fit">
                              <ShieldCheck size={14} />
                              <span>يقدم ضمان على السيارات المفحوصة</span>
                            </Badge>
                          </div>
                        )}

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <Clock
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm">
                              {workshop.workingHours}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm">{workshop.phone}</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium mb-2">الخدمات المقدمة:</h4>
                          <div className="flex flex-wrap gap-2">
                            {workshop.services.map((service, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-muted"
                              >
                                <Wrench size={12} className="mr-1" />
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1">
                            <Phone size={16} className="ml-2" />
                            اتصل الآن
                          </Button>
                          <Link to={`/car-listings`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              <ShieldCheck size={16} className="ml-2" />
                              تصفح السيارات المضمونة
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
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
                      لم نتمكن من العثور على أي ورش تطابق معايير البحث الخاصة
                      بك.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs> */}
      </div>
    </MainLayout>
  );
};

export default Workshops;
