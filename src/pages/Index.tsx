import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import CarCard from "../components/CarCard";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Clock, Car, HelpCircle } from "lucide-react";
import SEO from "../components/SEO";
import axios from "../config/axiosConfig"; // Import the Axios instance
import Spinner from "@/components/ui/Spinner";

// // Sample car data (in a real app, this would come from an API or state management)
// const featuredCars = [
//   {
//     id: '1',
//     title: 'Toyota Camry 2020',
//     price: 20000,
//     location: 'Damascus, Syria',
//     year: 2020,
//     mileage: 45000,
//     fuel: 'Petrol',
//     imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1336&q=80',
//     featured: true,
//   },
//   {
//     id: '2',
//     title: 'Honda Accord 2019',
//     price: 18500,
//     location: 'Aleppo, Syria',
//     year: 2019,
//     mileage: 50000,
//     fuel: 'Petrol',
//     imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1325&q=80',
//     featured: true,
//   },
//   {
//     id: '3',
//     title: 'Kia Sportage 2021',
//     price: 23000,
//     location: 'Damascus, Syria',
//     year: 2021,
//     mileage: 30000,
//     fuel: 'Petrol',
//     imageUrl: 'https://images.unsplash.com/photo-1583267746897-2cf33717a5d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1780&q=80',
//     featured: true,
//   },
// ];

// // Sample recent cars
// const recentCars = [
//   {
//     id: '4',
//     title: 'Mercedes C-Class 2018',
//     price: 27000,
//     location: 'Lattakia, Syria',
//     year: 2018,
//     mileage: 60000,
//     fuel: 'Petrol',
//     imageUrl: 'https://images.unsplash.com/photo-1617624085810-3df2165bd11b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
//   },
//   {
//     id: '5',
//     title: 'BMW 3 Series 2019',
//     price: 29000,
//     location: 'Damascus, Syria',
//     year: 2019,
//     mileage: 55000,
//     fuel: 'Petrol',
//     imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
//   },
//   {
//     id: '6',
//     title: 'Hyundai Tucson 2020',
//     price: 21000,
//     location: 'Homs, Syria',
//     year: 2020,
//     mileage: 40000,
//     fuel: 'Petrol',
//     imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
//   },
//   {
//     id: '7',
//     title: 'Nissan X-Trail 2017',
//     price: 18000,
//     location: 'Damascus, Syria',
//     year: 2017,
//     mileage: 70000,
//     fuel: 'Diesel',
//     imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
//   },
// ];

const Index = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [recentCars, setRecentCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  

  // Fetch featured and recent cars from the API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await axios.get("/api/car-offers");
        setCars(cars.data.data);
        console.log(cars.data);
        setFeaturedCars(cars.data.data);
        setRecentCars(cars.data.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("حدث خطأ أثناء تحميل السيارات");
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    console.log(isAuthenticated)

    fetchCars();
  }, [isAuthenticated]);

  // Structured data for the homepage
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "مركز السيارات السوري",
    url: "https://syrianautohub.com",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://syrianautohub.com/car-listings?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // if (loading) {
  //   return <div>Loading...</div>; // Show loading state
  // }

  // if (error) {
  //   return <div>{error}</div>; // Show error message
  // }

  return (
    <MainLayout structuredData={homeStructuredData}>
      <SEO
        title="مركز السيارات السوري - سوق السيارات الرائد في سوريا"
        description="أكبر سوق للسيارات الجديدة والمستعملة في سوريا. تصفح آلاف السيارات من الوكلاء الموثوقين والبائعين الخاصين."
        canonicalUrl="/"
        keywords="سيارات سوريا, بيع سيارات, شراء سيارات, سيارات مستعملة, سيارات جديدة, سوق السيارات"
      />
      <div className="flex flex-col">
        <Hero />

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">خدماتنا</h2>
              <p className="subtitle mx-auto">
                كل ما تحتاجه لرحلتك في عالم السيارات في مكان واحد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                {
                  icon: <Car className="h-8 w-8 text-syria-terracotta" />,
                  title: "سيارات جديدة ومستعملة",
                  description:
                    "تصفح مجموعتنا الواسعة من المركبات الجديدة والمستعملة من وكلاء موثوقين.",
                  link: "/car-listings",
                },
                {
                  icon: <Clock className="h-8 w-8 text-syria-turquoise" />,
                  title: "تأجير السيارات",
                  description:
                    "استأجر سيارة ليوم أو أسبوع أو أكثر من شبكة مزودي خدمة التأجير لدينا.",
                  link: "/rentals",
                },
                {
                  icon: <ShoppingBag className="h-8 w-8 text-syria-olive" />,
                  title: "قطع غيار",
                  description:
                    "ابحث عن قطع غيار أصلية وبديلة لجميع الماركات والموديلات.",
                  link: "/spare-parts",
                },
                {
                  icon: <HelpCircle className="h-8 w-8 text-syria-gold" />,
                  title: "اعرف احتياجاتك",
                  description:
                    "أجب على بعض الأسئلة وسنساعدك في العثور على السيارة المناسبة لك.",
                  link: "/know-your-needs",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="glass-card p-6 premium-hover animate-fade-up flex flex-col h-full"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {service.description}
                  </p>
                  <Link
                    to={service.link}
                    className="inline-flex items-center text-sm font-medium text-syria-terracotta hover:text-syria-terracotta/80 transition-colors mt-auto"
                  >
                    المزيد <ArrowRight size={16} className="mr-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="heading-2 mb-2">سيارات مميزة</h2>
                <p className="text-muted-foreground">
                  مركبات فاخرة مختارة خصيصاً لك
                </p>
              </div>
              <Link to="/car-listings" className="button-primary mt-4 sm:mt-0">
                عرض الكل
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ?
              <Spinner />
              :
              
              cars
                .filter((car, i) => car.car.is_featured)
                .map((car, i) => (
                  <div
                    key={car.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                  >
                    <CarCard
                      key={car.id}
                      id={car.id}
                      title={car.car.name}
                      price={car.price}
                      location={car.location}
                      year={car.car.year}
                      mileage={car.car.mileage}
                      fuel={car.car.fuel_type}
                      imageUrl={car.car.images[0]}
                      featured={car.featured}
                      images={car.images}
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 bg-[url('https://img.freepik.com/premium-vector/arabesque-pattern-seamless-arabic-geometric-pattern-background_8580-1014.jpg')] bg-repeat bg-[length:400px_400px]"></div>

          <div className="container-custom relative z-10">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                لماذا تختار مركز السيارات السوري
              </h2>
              <p className="subtitle mx-auto">
                سوق السيارات الموثوق في سوريا لأكثر من عقد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "بائعون موثوقون",
                  description:
                    "يتم التحقق من جميع الوكلاء والبائعين الخاصين لضمان معاملة آمنة وموثوقة.",
                },
                {
                  title: "تشكيلة واسعة",
                  description:
                    "من الفاخرة إلى الاقتصادية، اعثر على أوسع مجموعة من المركبات المتاحة في سوريا.",
                },
                {
                  title: "أسعار تنافسية",
                  description:
                    "قارن الأسعار من عدة بائعين للتأكد من حصولك على أفضل صفقة ممكنة.",
                },
                {
                  title: "دعم من الخبراء",
                  description:
                    "خبراؤنا في السيارات متاحون لإرشادك خلال رحلة الشراء الخاصة بك.",
                },
                {
                  title: "ضمان الجودة",
                  description:
                    "تخضع جميع المركبات لعملية فحص شاملة قبل إدراجها.",
                },
                {
                  title: "تغطية على مستوى البلاد",
                  description:
                    "اعثر على السيارات والخدمات في جميع المدن والم ناطق الرئيسية في سوريا.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 border border-border/40 rounded-lg premium-hover animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="heading-2 mb-2">إعلانات حديثة</h2>
                <p className="text-muted-foreground">أحدث الإضافات إلى سوقنا</p>
              </div>
              <Link to="/car-listings" className="button-primary mt-4 sm:mt-0">
                عرض الكل
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cars.slice(-4).map((car) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  title={car.car.name}
                  price={car.price}
                  location={car.location}
                  year={car.car.year}
                  mileage={car.car.mileage}
                  fuel={car.car.fuel_type}
                  imageUrl={car.car.images[0]}
                  featured={car.featured}
                  images={car.images}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-syria-turquoise/90 to-syria-terracotta/90 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 max-w-2xl mx-auto">
              هل أنت مستعد لبيع سيارتك؟ أضفها اليوم وتواصل مع آلاف المشترين
              المحتملين.
            </h2>
            <Link
              to="/add-car"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-syria-terracotta rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              أضف سيارتك
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
