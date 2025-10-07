import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Car, 
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Eye,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
  Settings,
  Key,
  UserMinus,
  UserPlus
} from "lucide-react";
import axios from "../config/axiosConfig";
import Spinner from "@/components/ui/Spinner";
import SEO from "../components/SEO";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [allCarsCount, setAllCarsCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [pendingCars, setPendingCars] = useState([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalViews: 0,
    pendingReviews: 0,
    activeCars: 0
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Pagination state
  const [carsCurrentPage, setCarsCurrentPage] = useState(1);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  

   const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([
    'user',
    'shop_manager',
    'workshop',
    'admin'
  ]);
  const [newRole, setNewRole] = useState("");


  // API Pagination state
  const [carsPagination, setCarsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [usersPagination, setUsersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من صلاحية المسؤول
    const user_role = localStorage.getItem('role');
    if (user_role !== "admin") {
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // جلب جميع السيارات مع Pagination
        const carsResponse = await axios.get(`/api/cars?page=${carsPagination.currentPage}&limit=${itemsPerPage}`);
        const allCarsData = carsResponse.data.data;
        setAllCars(allCarsData);
        setAllCarsCount(carsResponse.data.pagination.total);
        
        // تحديث pagination للسيارات
        setCarsPagination({
          currentPage: carsResponse.data.pagination.current_page,
          totalPages: carsResponse.data.pagination.last_page,
          totalItems: carsResponse.data.pagination.total,
          hasNext: carsResponse.data.pagination.current_page < carsResponse.data.pagination.total_pages,
          hasPrev: carsResponse.data.pagination.current_page > 1
        });
        
        console.log(allCars)
        // جلب جميع المستخدمين مع Pagination
        const usersResponse = await axios.get(`/api/users?page=${usersPagination.currentPage}&limit=${itemsPerPage}`);
        const allUsersData = usersResponse.data.data;
        setAllUsers(allUsersData);
        console.log(usersResponse.data.data)
        setAllUsersCount(usersResponse.data.pagination.total);
        
        // تحديث pagination للمستخدمين
        setUsersPagination({
          currentPage: usersResponse.data.pagination.current_page,
          totalPages: usersResponse.data.pagination.total_pages,
          totalItems: usersResponse.data.pagination.total,
          hasNext: usersResponse.data.pagination.current_page < usersResponse.data.pagination.total_pages,
          hasPrev: usersResponse.data.pagination.current_page > 1
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate, carsPagination.currentPage, usersPagination.currentPage, itemsPerPage]);


  // تعيين دور للمستخدم
  const assignRoleToUser = async (userId, role) => {
    try {
      await axios.post(`/api/users/${userId}/assign-role`, { role });
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, roles: [...(user.roles || []), role] } : user
      ));
      setShowRoleModal(false);
      toast.success("تم تعيين الدور بنجاح");
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("حدث خطأ أثناء تعيين الدور");
    }
  };

  // إزالة دور من المستخدم
  const removeRoleFromUser = async (userId, role) => {
    try {
      await axios.post(`/api/users/${userId}/remove-role`, { role });
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, roles: user.roles.filter(r => r !== role) } : user
      ));
      toast.success("تم إزالة الدور بنجاح");
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("حدث خطأ أثناء إزالة الدور");
    }
  };

  // تحديث بيانات المستخدم
  const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, userData);
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, ...response.data } : user
      ));
      setShowEditModal(false);
      toast.success("تم تحديث بيانات المستخدم بنجاح");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("حدث خطأ أثناء تحديث بيانات المستخدم");
    }
  };

  // حذف المستخدم
  const deleteUser = async (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته بما في ذلك السيارات المرتبطة به.")) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setAllUsers(allUsers.filter(user => user.id !== userId));
        setAllUsersCount(prev => prev - 1);
        toast.success("تم حذف المستخدم بنجاح");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("حدث خطأ أثناء حذف المستخدم");
      }
    }
  };

  // فتح نافذة تعيين الدور
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole("");
    // fetchAvailableRoles();
    setShowRoleModal(true);
  };

  // فتح نافذة تعديل المستخدم
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };


  // Change page for cars
  const paginateCars = (pageNumber) => {
    setCarsPagination(prev => ({
      ...prev,
      currentPage: pageNumber
    }));
    setCarsCurrentPage(pageNumber);
  };

  // Change page for users
  const paginateUsers = (pageNumber) => {
    setUsersPagination(prev => ({
      ...prev,
      currentPage: pageNumber
    }));
    setUsersCurrentPage(pageNumber);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const approveCar = async (carId) => {
    try {
      await axios.put(`/api/cars/${carId}/approve`);
      setAllCars(allCars.map(car => 
        car.id === carId ? { ...car, status: "active" } : car
      ));
      setPendingCars(pendingCars.filter(car => car.id !== carId));
      setStats(prev => ({ 
        ...prev, 
        pendingReviews: prev.pendingReviews - 1,
        activeCars: prev.activeCars + 1
      }));
      toast.success("تمت الموافقة على السيارة بنجاح");
    } catch (error) {
      console.error("Error approving car:", error);
      toast.error("حدث خطأ أثناء الموافقة على السيارة");
    }
  };

  const rejectCar = async (carId) => {
    if (window.confirm("هل أنت متأكد من رفض هذه السيارة؟")) {
      try {
        await axios.put(`/api/cars/${carId}/reject`);
        setAllCars(allCars.map(car => 
          car.id === carId ? { ...car, status: "rejected" } : car
        ));
        setPendingCars(pendingCars.filter(car => car.id !== carId));
        setStats(prev => ({ 
          ...prev, 
          pendingReviews: prev.pendingReviews - 1
        }));
        toast.success("تم رفض السيارة بنجاح");
      } catch (error) {
        console.error("Error rejecting car:", error);
        toast.error("حدث خطأ أثناء رفض السيارة");
      }
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
      try {
        await axios.delete(`/api/cars/${carId}`);
        setAllCars(allCars.filter(car => car.id !== carId));
        setPendingCars(pendingCars.filter(car => car.id !== carId));
        setStats(prev => ({ 
          ...prev, 
          totalCars: prev.totalCars - 1,
          pendingReviews: prev.pendingReviews - (allCars.find(car => car.id === carId)?.status === "pending" ? 1 : 0),
          activeCars: prev.activeCars - (allCars.find(car => car.id === carId)?.status === "active" ? 1 : 0)
        }));
        toast.success("تم حذف السيارة بنجاح");
      } catch (error) {
        console.error("Error deleting car:", error);
        toast.error("حدث خطأ أثناء حذف السيارة");
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await axios.put(`/api/users/${userId}/status`, { status: newStatus });
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      toast.success(`تم ${newStatus === "active" ? "تفعيل" : "تعليق"} الحساب بنجاح`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة المستخدم");
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

  // Filter cars based on search term and status filter
  const filteredCars = allCars.filter(car => {
    const carName = getCarName(car).toLowerCase();
    const matchesSearch = carName.includes(searchTerm.toLowerCase()) || 
                         (getCarDetails(car).year && getCarDetails(car).year.toString().includes(searchTerm));
    
    const matchesStatus = statusFilter === "all" || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter users based on search term and status filter
  const filteredUsers = allUsers.filter(user => {
    const userName = user.name?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    const matchesSearch = userName.includes(searchTerm.toLowerCase()) || 
                         userEmail.includes(searchTerm.toLowerCase());
    
    const matchesStatus = userFilter === "all" || user.status === userFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        title="لوحة تحكم المسؤول - مركز السيارات السوري"
        description="إدارة النظام والمستخدمين في مركز السيارات السوري"
        canonicalUrl="/admin"
      />
      
      {/* شريط التنعل العلوي */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المسؤول</h1>
            
            <div className="flex items-center space-x-4 space-x-reverse">
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
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{admin?.name || "مسؤول"}</p>
                  <p className="text-xs text-gray-500">مسؤول النظام</p>
                </div>
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{admin?.name || "مسؤول"}</h3>
                  <p className="text-sm text-muted-foreground">{admin?.email || "admin@example.com"}</p>
                  <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                    مسؤول النظام
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "overview"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 ml-3" />
                  نظرة عامة
                </button>
                
                <button
                  onClick={() => setActiveTab("cars")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "cars"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Car className="h-5 w-5 ml-3" />
                  إدارة السيارات
                  {allCarsCount > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {allCarsCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "users"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Users className="h-5 w-5 ml-3" />
                  إدارة المستخدمين
                  <span className="mr-auto bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {allUsersCount}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "settings"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Settings className="h-5 w-5 ml-3" />
                  إعدادات النظام
                </button>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              تسجيل الخروج
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div>
                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">إجمالي السيارات</p>
                        <h3 className="text-2xl font-bold">{allCarsCount}</h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">إجمالي المستخدمين</p>
                        <h3 className="text-2xl font-bold">{allUsersCount}</h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  
                </div>

               

                {/* أحدث المستخدمين */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">أحدث المستخدمين</h3>
                    <button 
                      onClick={() => setActiveTab("users")} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      عرض الكل
                    </button>
                  </div>
                  
                  {allUsers.slice(0, 5).length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right py-3 px-4">المستخدم</th>
                            <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                            <th className="text-right py-3 px-4">تاريخ التسجيل</th>
                            <th className="text-right py-3 px-4">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allUsers.slice(0, 5).map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center ml-4">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.role || "مستخدم"}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-gray-600">{user.email}</p>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-sm text-gray-500">
                                  {new Date(user.created_at).toLocaleDateString('ar-SA')}
                                </p>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === "active" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {user.status === "active" ? "نشط" : "موقوف"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">لا توجد مستخدمين مسجلين</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "cars" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-medium mb-4 md:mb-0">إدارة السيارات</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 space-x-reverse">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute top-3 right-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="ابحث في السيارات..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCarsCurrentPage(1);
                        }}
                      />
                    </div>
                    
                    <select 
                      className="px-4 py-2 border rounded-lg text-sm"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCarsCurrentPage(1);
                      }}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="active">نشط</option>
                      <option value="pending">قيد المراجعة</option>
                      <option value="rejected">مرفوض</option>
                    </select>
                  </div>
                </div>
                
                {allCars.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">السيارة</th>
                          <th className="text-right py-3 px-4">المستخدم</th>
                          <th className="text-right py-3 px-4">السعر</th>
                          
                          <th className="text-right py-3 px-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allCars.map(car => {
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
                                <p className="font-medium">{car.owner?.name || "مستخدم"}</p>
                                <p className="text-sm text-gray-500">{car.owner?.email || ""}</p>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-medium">{carDetails.price?.toLocaleString()} ل.س</span>
                              </td>
                             
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Link
                                    to={`/car/${car.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                    title="عرض"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  {car.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => approveCar(car.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                        title="موافقة"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => rejectCar(car.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                        title="رفض"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
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
                    <h3 className="text-lg font-medium mb-2">لا توجد سيارات</h3>
                    <p className="text-muted-foreground">لم يتم إضافة أي سيارات بعد</p>
                  </div>
                )}
                
                {allCars.length > 0 && (
                  <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                      عرض {((carsPagination.currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(carsPagination.currentPage * itemsPerPage, carsPagination.totalItems)} من {carsPagination.totalItems} سيارة
                    </p>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => paginateCars(carsPagination.currentPage - 1)} 
                        disabled={!carsPagination.hasPrev}
                        className={`p-2 rounded-lg ${!carsPagination.hasPrev ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: carsPagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => paginateCars(page)}
                          className={`px-3 py-1 rounded-lg text-sm ${carsPagination.currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => paginateCars(carsPagination.currentPage + 1)} 
                        disabled={!carsPagination.hasNext}
                        className={`p-2 rounded-lg ${!carsPagination.hasNext ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

{activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-medium mb-4 md:mb-0">إدارة المستخدمين</h2>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 space-x-reverse">
              <div className="relative">
                <Search className="h-4 w-4 absolute top-3 right-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث في المستخدمين..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setUsersCurrentPage(1);
                  }}
                />
              </div>
              
              <select 
                className="px-4 py-2 border rounded-lg text-sm"
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setUsersCurrentPage(1);
                }}
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="suspended">موقوف</option>
              </select>
            </div>
          </div>
          
          {allUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">المستخدم</th>
                    <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4">الأدوار</th>
                    <th className="text-right py-3 px-4">الحالة</th>
                    <th className="text-right py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center ml-4">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.phone || "لا يوجد رقم"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600">{user.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {role}
                                <button 
                                  onClick={() => removeRoleFromUser(user.id, role)}
                                  className="mr-1 text-red-500 hover:text-red-700"
                                >
                                  &times;
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">لا يوجد أدوار</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.status === "active" ? "نشط" : "موقوف"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => openRoleModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="تعيين دور"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {/* <button
                            onClick={() => toggleUserStatus(user.id, user.status)}
                            className={`p-2 rounded-full ${
                              user.status === "active" 
                                ? "text-red-600 hover:bg-red-50" 
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={user.status === "active" ? "تعليق" : "تفعيل"}
                          >
                            {user.status === "active" ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                          </button> */}
                          <button
                            onClick={() => deleteUser(user.id)}
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
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد مستخدمين</h3>
              <p className="text-muted-foreground">لم يتم تسجيل أي مستخدمين بعد</p>
            </div>
          )}
          {allUsers.length > 0 && (
                  <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                      عرض {((usersPagination.currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(usersPagination.currentPage * itemsPerPage, usersPagination.totalItems)} من {usersPagination.totalItems} مستخدم
                    </p>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => paginateUsers(usersPagination.currentPage - 1)} 
                        disabled={!usersPagination.hasPrev}
                        className={`p-2 rounded-lg ${!usersPagination.hasPrev ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: usersPagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => paginateUsers(page)}
                          className={`px-3 py-1 rounded-lg text-sm ${usersPagination.currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => paginateUsers(usersPagination.currentPage + 1)} 
                        disabled={!usersPagination.hasNext}
                        className={`p-2 rounded-lg ${!usersPagination.hasNext ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
          {/* ... Pagination الحالي ... */}
        </div>
      )}

      {/* نافذة تعيين الأدوار */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">تعيين دور للمستخدم: {selectedUser.name}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">اختر الدور</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="">-- اختر دور --</option>
                  {availableRoles.map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => assignRoleToUser(selectedUser.id, newRole)}
                  disabled={!newRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  تعيين
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تعديل المستخدم */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">تعديل بيانات المستخدم: {selectedUser.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    defaultValue={selectedUser.name}
                    id="editUserName"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg"
                    defaultValue={selectedUser.email}
                    id="editUserEmail"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-lg"
                    defaultValue={selectedUser.phone}
                    id="editUserPhone"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    const updatedData = {
                      name: document.getElementById('editUserName').value,
                      email: document.getElementById('editUserEmail').value,
                      phone: document.getElementById('editUserPhone').value
                    };
                    updateUser(selectedUser.id, updatedData);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* {activeTab === "users" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-medium mb-4 md:mb-0">إدارة المستخدمين</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 space-x-reverse">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute top-3 right-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="ابحث في المستخدمين..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setUsersCurrentPage(1);
                        }}
                      />
                    </div>
                    
                    <select 
                      className="px-4 py-2 border rounded-lg text-sm"
                      value={userFilter}
                      onChange={(e) => {
                        setUserFilter(e.target.value);
                        setUsersCurrentPage(1);
                      }}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="active">نشط</option>
                      <option value="suspended">موقوف</option>
                    </select>
                  </div>
                </div>
                
                {allUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">المستخدم</th>
                          <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                         
                          <th className="text-right py-3 px-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map(user => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center ml-4">
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.role || "مستخدم"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-600">{user.email}</p>
                            </td>
                           
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <button
                                  onClick={() => toggleUserStatus(user.id, user.status)}
                                  className={`px-3 py-1 rounded-lg text-sm ${
                                    user.status === "active" 
                                      ? "bg-red-100 text-red-700 hover:bg-red-200" 
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                                >
                                  {user.status === "active" ? "تعليق" : "تفعيل"}
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                                  <MoreVertical className="h-4 w-4" />
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
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد مستخدمين</h3>
                    <p className="text-muted-foreground">لم يتم تسجيل أي مستخدمين بعد</p>
                  </div>
                )}
                
                {allUsers.length > 0 && (
                  <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                      عرض {((usersPagination.currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(usersPagination.currentPage * itemsPerPage, usersPagination.totalItems)} من {usersPagination.totalItems} مستخدم
                    </p>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => paginateUsers(usersPagination.currentPage - 1)} 
                        disabled={!usersPagination.hasPrev}
                        className={`p-2 rounded-lg ${!usersPagination.hasPrev ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: usersPagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => paginateUsers(page)}
                          className={`px-3 py-1 rounded-lg text-sm ${usersPagination.currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => paginateUsers(usersPagination.currentPage + 1)} 
                        disabled={!usersPagination.hasNext}
                        className={`p-2 rounded-lg ${!usersPagination.hasNext ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )} */}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">إعدادات النظام</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">إعدادات الموقع</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموقع</label>
                        <input type="text" className="w-full px-4 py-2 border rounded-lg" defaultValue="مركز السيارات السوري" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">وصف الموقع</label>
                        <textarea className="w-full px-4 py-2 border rounded-lg" rows="3" defaultValue="أفضل موقع لبيع وشراء السيارات في سوريا"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني للتواصل</label>
                        <input type="email" className="w-full px-4 py-2 border rounded-lg" defaultValue="info@syriacars.com" />
                      </div>
                      <button className="button-primary w-full">حفظ التغييرات</button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">إعدادات الإعلانات</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">مدة الإعلان (أيام)</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" defaultValue="30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للصور لكل إعلان</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" defaultValue="10" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تفعيل المراجعة قبل النشر</label>
                        <label className="relative inline-flex items-center cursor-pointer mt-2">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <button className="button-primary w-full">حفظ التغييرات</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-medium mb-4">إعدادات الحسابات</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">السماح بالتسجيل للجميع</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">تفعيل البريد الإلكتروني</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">السماح للمستخدمين بإضافة أكثر من إعلان</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <button className="button-primary w-full mt-4">حفظ التغييرات</button>
                  </div>
                </div>
                
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-4 text-red-600">إعدادات متقدمة</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">مسح ذاكرة التخزين المؤقت</label>
                      <p className="text-sm text-red-600 mb-3">هذا الإجراء سيؤدي إلى مسح ذاكرة التخزين المؤقت للموقع</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
                        مسح الذاكرة المؤقتة
                      </button>
                    </div>
                    
                    <div className="pt-4 border-t border-red-200">
                      <label className="block text-sm font-medium text-red-700 mb-1">تصدير بيانات النسخ الاحتياطي</label>
                      <p className="text-sm text-red-600 mb-3">قم بتحميل نسخة احتياطية من قاعدة البيانات</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
                        تصدير النسخة الاحتياطية
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;