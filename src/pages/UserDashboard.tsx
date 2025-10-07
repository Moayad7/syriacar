import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Car, 
  Heart, 
  Settings, 
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Store,
  Wrench
} from "lucide-react";
import axios from "../config/axiosConfig";
import Spinner from "@/components/ui/Spinner";
import SEO from "../components/SEO";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [userCars, setUserCars] = useState([]);
  const [userStores, setUserStores] = useState([]);
  const [userWorkshops, setUserWorkshops] = useState([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    totalStores: 0,
    totalWorkshops: 0,
    totalViews: 0,
    totalFavorites: 0,
    pendingCars: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(5);
  const [storesPerPage] = useState(5);
  const [workshopsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  const user_role = localStorage.getItem('role');
  
  if(user_role == "admin"){
    navigate('/admin')
  }
  if(user_role == "workshop"){
    navigate('/workshops-dashboard')
  }


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const user_id = localStorage.getItem('user_id');

        // جلب جميع السيارات
        const carsResponse = await axios.get(`/api/cars`);
        const allCarsData = carsResponse.data.data;
        setAllCars(allCarsData);

        // جلب سيارات المستخدم
        const userCarsResponse = await axios.get(`/api/cars?user_id=${user_id}&per_page=100&`);
        const userCarsData = userCarsResponse.data.data;
        setUserCars(userCarsData);

        // جلب متاجر المستخدم
        const storesResponse = await axios.get(`/api/stores?user_id=${user_id}`);
        const userStoresData = storesResponse.data.data;
        setUserStores(userStoresData);
        console.log(userStoresData)

        // جلب ورش المستخدم
        const workshopsResponse = await axios.get(`/api/workshop-ads?workshop_id=${user_id}`);
        const userWorkshopsData = workshopsResponse.data.data;
        console.log(workshopsResponse.data.data)
        setUserWorkshops(userWorkshopsData);

        setStats(prev => ({ 
          ...prev, 
          totalCars: userCarsData.length,
          totalStores: userStoresData.length,
          totalWorkshops: userWorkshopsData.length
        }));

      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // باقي الدوال الحالية...

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    };
  
    const deleteCar = async (carId) => {
      if (window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
        try {
          await axios.delete(`/api/cars/${carId}`);
          
          // تحديث القوائم المحلية بعد الحذف
          setAllCars(allCars.filter(car => car.id !== carId));
          setUserCars(userCars.filter(car => car.id !== carId));
          toast.success("تم حذف العقار بنجاح");
          setStats(prev => ({ 
            ...prev, 
            totalCars: prev.totalCars - 1 
          }));
          
        } catch (error) {
          console.error("Error deleting car:", error);
          alert("حدث خطأ أثناء حذف السيارة");
        }
      }
    };
  
    // دالة مساعدة للحصول على صورة السيارة
    const getCarImage = (car) => {
      return car.car?.images?.[0] || car.images[0]?.url || "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    };
  
    // دالة مساعدة للحصول على اسم السيارة
    const getCarName = (car) => {
      return car.car?.name || car.name || "سيارة";
    };
  
    // دالة مساعدة للحصول على تفاصيل السيارة
    const getCarDetails = (car) => {
      return {
        year: car.car?.year || car.year,
        mileage: car.car?.mileage || car.mileage,
        fuel: car.car?.fuel_type || car.fuel_type,
        price: car.offer?.price || car.price,
        location: car.offer?.location || car.location
      };
    };

  // دوال جديدة لإدارة المتاجر
  const deleteStore = async (storeId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المتجر؟")) {
      try {
        await axios.delete(`/api/stores/${storeId}`);
        setUserStores(userStores.filter(store => store.id !== storeId));
        toast.success("تم حذف المتجر بنجاح");
        setStats(prev => ({ 
          ...prev, 
          totalStores: prev.totalStores - 1 
        }));
      } catch (error) {
        console.error("Error deleting store:", error);
        alert("حدث خطأ أثناء حذف المتجر");
      }
    }
  };

  // دوال جديدة لإدارة الورش
  const deleteWorkshop = async (workshopId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الورشة؟")) {
      try {
        await axios.delete(`/api/workshops/${workshopId}`);
        setUserWorkshops(userWorkshops.filter(workshop => workshop.id !== workshopId));
        toast.success("تم حذف الورشة بنجاح");
        setStats(prev => ({ 
          ...prev, 
          totalWorkshops: prev.totalWorkshops - 1 
        }));
      } catch (error) {
        console.error("Error deleting workshop:", error);
        alert("حدث خطأ أثناء حذف الورشة");
      }
    }
  };

  // باقي الكود الحالي...
  // Filter cars based on search term and status filter
    const filteredCars = userCars.filter(car => {
      const carName = getCarName(car).toLowerCase();
      const matchesSearch = carName.includes(searchTerm.toLowerCase()) || 
                           (getCarDetails(car).year && getCarDetails(car).year.toString().includes(searchTerm));
      
      const matchesStatus = statusFilter === "all" || car.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  
    // Get current cars for pagination
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
    const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  
  
    if (loading) {
      return (
        <MainLayout>
          <div className="flex justify-center items-center h-96">
            <Spinner size="lg" />
          </div>
        </MainLayout>
      );
    }
  

  return (
    <MainLayout>
      <SEO
        title="لوحة التحكم - مركز السيارات السوري"
        description="إدارة حسابك وعروض سياراتك في مركز السيارات السوري"
        canonicalUrl="/dashboard"
      />
      
      {/* شريط التنعل العلوي */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* ... العناصر الحالية ... */}
              <div className="relative">
                              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <Bell className="h-5 w-5 text-gray-600" />
                                {unreadNotifications > 0 && (
                                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {unreadNotifications}
                                  </span>
                                )}
                              </button>
                            </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-6">
<div className="w-16 h-16 bg-syria-terracotta/10 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-syria-terracotta" />
                </div>
                <div>
                  <h3 className="font-medium">{user?.name || "مستخدم"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
                  <p className="text-xs text-syria-terracotta bg-syria-terracotta/10 px-2 py-1 rounded-full inline-block mt-1">
                    {user?.membership || "عضو قياسي"}
                  </p>
                </div>              </div>

              <nav className="space-y-1">
                {/* العناصر الحالية في القائمة الجانبية */}
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "overview"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 ml-3" />
                  نظرة عامة
                </button>
                
                <button
                  onClick={() => setActiveTab("my-cars")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "my-cars"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Car className="h-5 w-5 ml-3" />
                  سياراتي
                  <span className="mr-auto bg-syria-terracotta text-white text-xs rounded-full px-2 py-1">
                    {userCars.length}
                  </span>
                </button>
                
                {/* قسم المتاجر الجديد */}
                <button
                  onClick={() => setActiveTab("my-stores")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "my-stores"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Store className="h-5 w-5 ml-3" />
                  متاجري
                  <span className="mr-auto bg-syria-terracotta text-white text-xs rounded-full px-2 py-1">
                    {userStores.length}
                  </span>
                </button>
                
                {/* قسم الورش الجديد */}
                {/* <button
                  onClick={() => setActiveTab("my-workshops")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "my-workshops"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Wrench className="h-5 w-5 ml-3" />
                  ورشي
                  <span className="mr-auto bg-syria-terracotta text-white text-xs rounded-full px-2 py-1">
                    {userWorkshops.length}
                  </span>
                </button> */}
                
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "settings"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Settings className="h-5 w-5 ml-3" />
                  الإعدادات
                </button>
              </nav>
            </div>

            <div className="space-y-3">
              <Link
                to="/add-car"
                className="button-primary w-full flex items-center justify-center py-3 rounded-lg"
              >
                <PlusCircle className="h-5 w-5 ml-2" />
                إضافة سيارة
              </Link>
              
              <Link
                to="/add-store"
                className="button-primary w-full flex items-center justify-center py-3 rounded-lg"
              >
                <PlusCircle className="h-5 w-5 ml-2" />
                إنشاء متجر
              </Link>
              
              {/* <Link
                to="/add-workshop"
                className="button-primary w-full flex items-center justify-center py-3 rounded-lg"
              >
                <PlusCircle className="h-5 w-5 ml-2" />
                إنشاء ورشة
              </Link> */}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {activeTab === "overview" && (
              <div>
                
                {/* سياراتي الأخيرة */}
                {/* ... الكود الحالي لعرض السيارات ... */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">سياراتي الأخيرة</h3>
                    <button 
                      onClick={() => setActiveTab("my-cars")} 
                      className="text-sm text-syria-terracotta hover:underline"
                    >
                      عرض الكل
                    </button>
                  </div>
                  
                  {userCars.slice(0, 3).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {userCars.slice(0, 3).map(car => {
                        const carDetails = getCarDetails(car);
                        return (
                          <div key={car.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                            <div className="relative">
                              <img 
                                src={getCarImage(car)} 
                                alt={getCarName(car)}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                                {car.status === "active" ? "نشط" : "قيد المراجعة"}
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium mb-1">{getCarName(car)}</h4>
                              <p className="text-sm text-gray-500 mb-3">{carDetails.year} • {carDetails.mileage?.toLocaleString()} كم</p>
                              <p className="text-lg font-bold text-syria-terracotta mb-4">{carDetails.price?.toLocaleString()} ل.س</p>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2 space-x-reverse">
                                  <span className="flex items-center text-sm text-gray-500">
                                    <Eye className="h-4 w-4 ml-1" /> {car.views || 0}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <Heart className="h-4 w-4 ml-1" /> {car.likes || 0}
                                  </span>
                                </div>
                                
                                <Link
                                  to={`/car/${car.id}`}
                                  className="text-syria-terracotta hover:text-syria-terracotta/80 text-sm"
                                >
                                  التفاصيل
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد سيارات معروضة</p>
                      <Link to="/add-car" className="text-syria-terracotta hover:underline mt-2 inline-block">
                        أضف أول سيارة لك
                      </Link>
                    </div>
                  )}
                {/* متاجري الأخيرة */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">متاجري الأخيرة</h3>
                    <button 
                      onClick={() => setActiveTab("my-stores")} 
                      className="text-sm text-syria-terracotta hover:underline"
                    >
                      عرض الكل
                    </button>
                  </div>
                  
                  {userStores.slice(0, 3).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {userStores.slice(0, 3).map(store => (
                        <div key={store.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                          <div className="relative">
                            <img 
                              src={store.image || "https://images.unsplash.com/photo-1563014959-7aaa83350992?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                              alt={store.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                              {store.status === "active" ? "نشط" : "قيد المراجعة"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium mb-1">{store.name}</h4>
                            <p className="text-sm text-gray-500 mb-3">{store.category} • {store.location}</p>
                            <p className="text-sm text-gray-500 mb-4">{store.description?.substring(0, 60)}...</p>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2 space-x-reverse">
                                <span className="flex items-center text-sm text-gray-500">
                                  <Eye className="h-4 w-4 ml-1" /> {store.views || 0}
                                </span>
                              </div>
                              
                              <Link
                                to={`/store/${store.id}`}
                                className="text-syria-terracotta hover:text-syria-terracotta/80 text-sm"
                              >
                                التفاصيل
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد متاجر</p>
                      <Link to="/add-store" className="text-syria-terracotta hover:underline mt-2 inline-block">
                        إنشاء متجر جديد
                      </Link>
                    </div>
                  )}
                </div>

                {/* ورشي الأخيرة */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">ورشي الأخيرة</h3>
                    <button 
                      onClick={() => setActiveTab("my-workshops")} 
                      className="text-sm text-syria-terracotta hover:underline"
                    >
                      عرض الكل
                    </button>
                  </div>
                  
                  {/* {userWorkshops.slice(0, 3).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {userWorkshops.slice(0, 3).map(workshop => (
                        <div key={workshop.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                          <div className="relative">
                            <img 
                              src={workshop.image || "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                              alt={workshop.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                              {workshop.status === "active" ? "نشط" : "قيد المراجعة"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium mb-1">{workshop.name}</h4>
                            <p className="text-sm text-gray-500 mb-3">{workshop.specialization} • {workshop.location}</p>
                            <p className="text-sm text-gray-500 mb-4">{workshop.description?.substring(0, 60)}...</p>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2 space-x-reverse">
                                <span className="flex items-center text-sm text-gray-500">
                                  <Eye className="h-4 w-4 ml-1" /> {workshop.views || 0}
                                </span>
                              </div>
                              
                              <Link
                                to={`/workshop/${workshop.id}`}
                                className="text-syria-terracotta hover:text-syria-terracotta/80 text-sm"
                              >
                                التفاصيل
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد ورش</p>
                      <Link to="/add-workshop" className="text-syria-terracotta hover:underline mt-2 inline-block">
                        إنشاء ورشة جديدة
                      </Link>
                    </div>
                  )} */}
                </div>
              </div>
              </div>
           
            )}
            </div>
            {activeTab === "my-cars" && (
              // ... الكود الحالي لإدارة السيارات ...
              <div className="bg-white rounded-xl shadow-sm p-6">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <h2 className="text-xl font-medium mb-4 md:mb-0">إدارة سياراتي</h2>
                                
                                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 space-x-reverse">
                                  <div className="relative">
                                    <Search className="h-4 w-4 absolute top-3 right-3 text-gray-400" />
                                    <input 
                                      type="text" 
                                      placeholder="ابحث في سياراتك..."
                                      className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                                      value={searchTerm}
                                      onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                      }}
                                    />
                                  </div>
                                  
                                  {/* <select 
                                    className="px-4 py-2 border rounded-lg text-sm"
                                    value={statusFilter}
                                    onChange={(e) => {
                                      setStatusFilter(e.target.value);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    <option value="all">جميع الحالات</option>
                                    <option value="active">نشط</option>
                                    <option value="pending">قيد المراجعة</option>
                                    <option value="rejected">مرفوض</option>
                                  </select> */}
                                  
                                  <Link to="/add-car" className="button-primary flex items-center justify-center text-sm">
                                    <PlusCircle className="h-4 w-4 ml-2" />
                                    إضافة سيارة
                                  </Link>
                                </div>
                              </div>
                              
                              {filteredCars.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-right py-3 px-4">السيارة</th>
                                        <th className="text-right py-3 px-4">السعر</th>
                                        {/* <th className="text-right py-3 px-4">الحالة</th>
                                        <th className="text-right py-3 px-4">المشاهدات</th>
                                        <th className="text-right py-3 px-4">الإعجابات</th> */}
                                        <th className="text-right py-3 px-4">الإجراءات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {currentCars.map(car => {
                                        const carDetails = getCarDetails(car);
                                        return (
                                          <tr key={car.id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                              <div className="flex items-center">
                                                <img 
                                                  src={getCarImage(car)} 
                                                  alt={getCarName(car)}
                                                  className="w-16 h-12 object-cover rounded-md ml-4"
                                                />
                                                <div>
                                                  <p className="font-medium">{getCarName(car)}</p>
                                                  <p className="text-sm text-gray-500">{carDetails.year} • {carDetails.mileage?.toLocaleString()} كم</p>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="py-4 px-4">
                                              <span className="font-medium">{carDetails.price?.toLocaleString()} ل.س</span>
                                            </td>
                                            {/* <td className="py-4 px-4">
                                              <span className={`px-2 py-1 rounded-full text-xs ${
                                                car.status === "active" 
                                                  ? "bg-green-100 text-green-800" 
                                                  : car.status === "pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}>
                                                {car.status === "active" ? "نشط" : car.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                                              </span>
                                            </td>
                                            <td className="py-4 px-4">
                                              <div className="flex items-center">
                                                <Eye className="h-4 w-4 ml-1 text-gray-500" />
                                                <span>{car.views || 0}</span>
                                              </div>
                                            </td>
                                            <td className="py-4 px-4">
                                              <div className="flex items-center">
                                                <Heart className="h-4 w-4 ml-1 text-gray-500" />
                                                <span>{car.likes || 0}</span>
                                              </div>
                                            </td> */}
                                            <td className="py-4 px-4">
                                              <div className="flex items-center space-x-2 space-x-reverse">
                                                <Link
                                                  to={`/car/${car.id}`}
                                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                  title="عرض"
                                                >
                                                  <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                  to={`/edit-car/${car.id}`}
                                                  className="p-2 text-syria-terracotta hover:bg-orange-50 rounded-full"
                                                  title="تعديل"
                                                >
                                                  <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                  onClick={() => deleteCar(car.id)}
                                                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                  title="حذف"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                  <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                  <h3 className="text-lg font-medium mb-2">لا توجد سيارات معروضة</h3>
                                  <p className="text-muted-foreground mb-4">ابدأ بعرض سيارتك الأولى للبيع</p>
                                  <Link to="/add-car" className="button-primary">
                                    إضافة سيارة
                                  </Link>
                                </div>
                              )}
                              
                              {filteredCars.length > 0 && (
                                <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                                  <p className="text-sm text-gray-500 mb-4 md:mb-0">
                                    عرض {indexOfFirstCar + 1} إلى {Math.min(indexOfLastCar, filteredCars.length)} من {filteredCars.length} سيارة
                                  </p>
                                  
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    <button 
                                      onClick={() => paginate(currentPage - 1)} 
                                      disabled={currentPage === 1}
                                      className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                      <button
                                        key={page}
                                        onClick={() => paginate(page)}
                                        className={`px-3 py-1 rounded-lg text-sm ${currentPage === page ? 'bg-syria-terracotta text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                      >
                                        {page}
                                      </button>
                                    ))}
                                    
                                    <button 
                                      onClick={() => paginate(currentPage + 1)} 
                                      disabled={currentPage === totalPages}
                                      className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
            )}

            {activeTab === "my-stores" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-medium mb-4 md:mb-0">إدارة متاجري</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 space-x-reverse">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute top-3 right-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="ابحث في متاجرك..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    
                    <Link to="/add-store" className="button-primary flex items-center justify-center text-sm">
                      <PlusCircle className="h-4 w-4 ml-2" />
                      إنشاء متجر
                    </Link>
                  </div>
                </div>
                
                {userStores.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">المتجر</th>
                          <th className="text-right py-3 px-4">الفئة</th>
                          <th className="text-right py-3 px-4">الموقع</th>
                          <th className="text-right py-3 px-4">الحالة</th>
                          <th className="text-right py-3 px-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userStores.map(store => (
                          <tr key={store.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <img 
                                  src={store.image || "https://images.unsplash.com/photo-1563014959-7aaa83350992?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                                  alt={store.name}
                                  className="w-16 h-12 object-cover rounded-md ml-4"
                                />
                                <div>
                                  <p className="font-medium">{store.name}</p>
                                  <p className="text-sm text-gray-500">{store.description?.substring(0, 40)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium">{store.category}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium">{store.location}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                store.status === "active" 
                                  ? "bg-green-100 text-green-800" 
                                  : store.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {store.status === "active" ? "نشط" : store.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Link
                                  to={`/store/${store.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                  title="عرض"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={`/edit-store/${store.id}`}
                                  className="p-2 text-syria-terracotta hover:bg-orange-50 rounded-full"
                                  title="تعديل"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => deleteStore(store.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد متاجر</h3>
                    <p className="text-muted-foreground mb-4">ابدأ بإنشاء متجرك الأول</p>
                    <Link to="/add-store" className="button-primary">
                      إنشاء متجر
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "my-workshops" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-medium mb-4 md:mb-0">إدارة ورشي</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 space-x-reverse">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute top-3 right-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="ابحث في ورشك..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    
                    <Link to="/add-workshop" className="button-primary flex items-center justify-center text-sm">
                      <PlusCircle className="h-4 w-4 ml-2" />
                      إنشاء ورشة
                    </Link>
                  </div>
                </div>
                
                {userWorkshops.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">الورشة</th>
                          <th className="text-right py-3 px-4">التخصص</th>
                          <th className="text-right py-3 px-4">الموقع</th>
                          <th className="text-right py-3 px-4">الحالة</th>
                          <th className="text-right py-3 px-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userWorkshops.map(workshop => (
                          <tr key={workshop.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <img 
                                  src={workshop.image || "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                                  alt={workshop.name}
                                  className="w-16 h-12 object-cover rounded-md ml-4"
                                />
                                <div>
                                  <p className="font-medium">{workshop.name}</p>
                                  <p className="text-sm text-gray-500">{workshop.description?.substring(0, 40)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium">{workshop.specialization}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium">{workshop.location}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                workshop.status === "active" 
                                  ? "bg-green-100 text-green-800" 
                                  : workshop.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {workshop.status === "active" ? "نشط" : workshop.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Link
                                  to={`/workshop/${workshop.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                  title="عرض"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={`/edit-workshop/${workshop.id}`}
                                  className="p-2 text-syria-terracotta hover:bg-orange-50 rounded-full"
                                  title="تعديل"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => deleteWorkshop(workshop.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد ورش</h3>
                    <p className="text-muted-foreground mb-4">ابدأ بإنشاء ورشتك الأولى</p>
                    <Link to="/add-workshop" className="button-primary">
                      إنشاء ورشة
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              // ... الكود الحالي للإعدادات ...
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">الإعدادات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">معلومات الحساب</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                        <input type="text" className="w-full px-4 py-2 border rounded-lg" defaultValue={user?.name || "مستخدم"} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input type="email" className="w-full px-4 py-2 border rounded-lg" defaultValue={user?.email || "user@example.com"} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                        <input type="tel" className="w-full px-4 py-2 border rounded-lg" placeholder="أدخل رقم هاتفك" />
                      </div>
                      <button className="button-primary w-full">حفظ التغييرات</button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">تغيير كلمة المرور</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <button className="button-primary w-full">تغيير كلمة المرور</button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">إعدادات الإشعارات</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">الإشعارات البريدية</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-syria-terracotta"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">الإشعارات التطبيقية</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-syria-terracotta"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">عروض خاصة</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-syria-terracotta"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4 text-red-600">منطقة الخطر</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-700 mb-4">حذف الحساب بشكل دائم وإزالة جميع البيانات</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
                      حذف الحساب
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
     
    </MainLayout>
  );
};

export default Dashboard;