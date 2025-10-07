import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  ChevronRight, 
  Calendar, 
  Fuel, 
  Gauge, 
  MapPin, 
  Settings, 
  ArrowLeftRight, 
  Users, 
  Heart, 
  Share2, 
  Phone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios from '../config/axiosConfig'; // Import the Axios instance

const CarDetails = () => {
  const { id } = useParams();
  console.log(id)
  const [cars, setCars] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [phoneVisible, setPhoneVisible] = useState(false);
  const { toast } = useToast();

  // Fetch car data from the API
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}`); // Adjust the endpoint as necessary
        const carsRes = await axios.get(`/api/cars`); // Adjust the endpoint as necessary
        console.log(response.data)
        console.log(carsRes.data.data)
        setCar(response.data);
        console.log(response.data);
        setCars(carsRes.data.data);
        setMainImage(response.data.images[0].url || ''); // Set the first image as the main image
        
      } catch (error) {
        console.error("Error fetching car data:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات السيارة.",
        });
      }
    };

    fetchCarData();
  }, [id]);

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  const handleSaveClick = () => {
    toast({
      title: "تمت الإضافة إلى المفضلة",
      description: "تمت إضافة السيارة إلى قائمة المفضلة الخاصة بك.",
    });
  };

  const handleShareClick = () => {
    toast({
      title: "تمت مشاركة الإعلان",
      description: "تم نسخ رابط الإعلان إلى الحافظة.",
    });
  };

  const handleContactClick = () => {
    setPhoneVisible(true);
  };

  if (!car) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <MainLayout>
      <div className="container-custom py-28">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronRight size={16} />
          <Link to="/car-listings" className="hover:text-primary">السيارات</Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{car.name}</span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gallery section (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg mb-4">
              <img 
                src={mainImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'} 
                alt={car.name} 
                className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {car.images && car.images.length > 0 ? (
                car.images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className={`overflow-hidden rounded-lg cursor-pointer border-2 ${mainImage === image ? 'border-syria-terracotta' : 'border-transparent'}`}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt={`صورة ${index + 1}`} 
                      className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              ) : (
                // عرض صور افتراضية إذا لم تكن هناك صور
                [1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="overflow-hidden rounded-lg cursor-pointer border-2 border-transparent"
                  >
                    <img 
                      src={`https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=200&h=150&crop=entropy`} 
                      alt={`صورة افتراضية ${item}`} 
                      className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Car details tab section */}
            <div className="mt-8">
              <Tabs defaultValue="details" dir="rtl" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="details">التفاصيل</TabsTrigger>
                  <TabsTrigger value="features">المواصفات</TabsTrigger>
                  <TabsTrigger value="seller">معلومات البائع</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50">
                    <h3 className="text-lg font-bold mb-4">معلومات السيارة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">سنة الصنع</p>
                          <p className="font-medium">{car.year}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Gauge size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">المسافة المقطوعة</p>
                          <p className="font-medium">{car.mileage.toLocaleString()} كم</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Fuel size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">نوع الوقود</p>
                          <p className="font-medium">{car.fuel_type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ArrowLeftRight size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">ناقل الحركة</p>
                          <p className="font-medium">{car.transmission}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Settings size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">قوة المحرك</p>
                          <p className="font-medium">{car.horsepower} حصان</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">عدد المقاعد</p>
                          <p className="font-medium">{car.seats}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-bold mb-4">وصف السيارة</h3>
                    <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-muted-foreground" />
                      <p>الموقع: {car.offer ? car.offer.location: '' || ''}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50">
                    <h3 className="text-lg font-bold mb-4">مميزات السيارة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                      {car.offer && car.offer.additional_features.split(',').map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-syria-terracotta"></div>
                          <span>{feature.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="seller" className="mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50">
                    <h3 className="text-lg font-bold mb-4">معلومات البائع</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                        {car.owner.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{car.owner.name}</h4>
                        <p className="text-sm text-muted-foreground">{car.owner.email}</p>
                        {car.owner.phone && (
                          <p className="text-sm text-muted-foreground">{car.owner.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    {car.owner.phone && (
                      <Button 
                        variant="secondary" 
                        className="w-full mb-4"
                        onClick={handleContactClick}
                      >
                        {phoneVisible ? car.owner.phone : "عرض رقم الهاتف"}
                      </Button>
                    )}
                    
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                      <h4 className="font-medium mb-3">اتصل بالبائع</h4>
                      <Input placeholder="الاسم" className="mb-3" />
                      <Input placeholder="البريد الإلكتروني" className="mb-3" />
                      <Input placeholder="رقم الهاتف" className="mb-3" />
                      <textarea 
                        placeholder="الرسالة" 
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                        rows={4}
                      ></textarea>
                      <Button className="w-full"> إرسال</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar (1/3 width on desktop) */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold">{car.name}</h2>
                </div>
                <div className="text-3xl font-bold text-syria-terracotta mb-4">
                  ${car.offer ? car.offer.price.toLocaleString() : ''}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <MapPin size={14} />
                  <span>{car.offer? car.offer.location : ''}</span>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <Button className="flex-1" onClick={handleContactClick}>
                    <Phone size={18} className="mr-2" />
                    {phoneVisible && car.owner.phone ? car.owner.phone : "اتصل الآن"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleSaveClick}
                  >
                    <Heart size={18} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleShareClick}
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">سنة الصنع</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عداد المسافة</span>
                    <span className="font-medium">{car.mileage.toLocaleString()} كم</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ناقل الحركة</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">نوع الوقود</span>
                    <span className="font-medium">{car.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد المقاعد</span>
                    <span className="font-medium">{car.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">اللون</span>
                    <span className="font-medium">{car.color}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50">
              <h3 className="font-bold mb-4">سيارات مشابهة</h3>
              
              <div className="space-y-4">
                {cars && cars.slice(0, 3).map((similarCar: any) => (
                  <Link key={similarCar.id} to={`/car/${similarCar.id}`}>
                    <div className="flex gap-3">
                      <img 
                        src={similarCar.images && similarCar.images.length > 0 ? similarCar.images[0] : 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=100&h=100&crop=entropy'} 
                        alt={similarCar.name} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{similarCar.name}</h4>
                        <p className="text-syria-terracotta font-bold text-sm">${similarCar.offer.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{similarCar.mileage.toLocaleString()} كم • {similarCar.offer.location?similarCar.offer.location:'' }</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Link to="/car-listings">عرض المزيد</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CarDetails;