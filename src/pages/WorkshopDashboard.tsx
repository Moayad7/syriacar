import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { 
  Wrench, 
  PlusCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  BarChart3,
  Settings,
  Bell,
  User
} from "lucide-react";
import axios from "../config/axiosConfig";
import Spinner from "@/components/ui/Spinner";
import { toast } from "sonner";

const WorkshopDashboard = () => {
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingWorkshop, setEditingWorkshop] = useState(false);
  const [workshopForm, setWorkshopForm] = useState({});
  const [showAdForm, setShowAdForm] = useState(false);
  const [adForm, setAdForm] = useState({
    title: "",
    price: "",
    description: ""
  });

  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const user_id = localStorage.getItem('user_id');
        console.log(user_id)
        
        // جلب بيانات الورشة
        // const workshopResponse = await axios.get(`/api/workshops/${user_id}`);
        // const workshopData = workshopResponse.data.data;
        // setWorkshop(workshopData);
        
        // تحويل بيانات الورشة من مصفوفة إلى كائن
        // const workshopObj = {};
        // if (workshopData.data && Array.isArray(workshopData.data)) {
        //   workshopData.data.forEach(item => {
        //     workshopObj[item.key] = item.value;
        //   });
        // }
        // setWorkshopForm(workshopObj);
        
        // جلب إعلانات الورشة
        const adsResponse = await axios.get(`/api/workshop-ads?workshop_id=6`);
        setAds(adsResponse.data.data || []);
        console.log(adsResponse.data.data)
        
      } catch (error) {
        console.error("Error fetching workshop data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, []);

  const handleWorkshopUpdate = async (e) => {
    e.preventDefault();
    try {
      // تحويل الكائن إلى مصفوفة بالتنسيق المطلوب
      const formattedData = Object.keys(workshopForm).map(key => ({
        key,
        value: workshopForm[key],
        type: "text",
        uuid: Math.random().toString(36).substr(2, 9)
      }));
      
      const response = await axios.put(`/api/workshops/${workshop.id}`, {
        data: formattedData
      });
      
      setWorkshop(response.data.data);
      setEditingWorkshop(false);
      toast.success("تم تحديث بيانات الورشة بنجاح");
    } catch (error) {
      console.error("Error updating workshop:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    try {
      const adData = [
        { key: "title", value: adForm.title, type: "text", uuid: Math.random().toString(36).substr(2, 9) },
        { key: "price", value: adForm.price, type: "text", uuid: Math.random().toString(36).substr(2, 9) },
        { key: "workshop_id", value: workshop.id.toString(), type: "text", uuid: Math.random().toString(36).substr(2, 9) },
        { key: "description", value: adForm.description, type: "text", uuid: Math.random().toString(36).substr(2, 9) }
      ];
      
      const response = await axios.post(`/api/workshop-ads`, {
        data: adData
      });
      
      setAds([...ads, response.data.data]);
      setAdForm({ title: "", price: "", description: "" });
      setShowAdForm(false);
      toast.success("تم إضافة الإعلان بنجاح");
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error("حدث خطأ أثناء إضافة الإعلان");
    }
  };

  const editAd = async (adId) => {
   navigate(`/edit-workshop/${adId}`)
  };
  const deleteAd = async (adId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      try {
        await axios.delete(`/api/workshops-ads/${adId}`);
        setAds(ads.filter(ad => ad.id !== adId));
        toast.success("تم حذف الإعلان بنجاح");
      } catch (error) {
        console.error("Error deleting ad:", error);
        toast.error("حدث خطأ أثناء حذف الإعلان");
      }
    }
  };

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
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم الورشة</h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="h-5 w-5 text-gray-600" />
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
                  <h3 className="font-medium">{workshopForm.name || "ورشة"}</h3>
                  <p className="text-sm text-muted-foreground">{workshopForm.location || "موقع الورشة"}</p>
                </div>
              </div>

              <nav className="space-y-1">
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
                  onClick={() => setActiveTab("workshop-data")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "workshop-data"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Wrench className="h-5 w-5 ml-3" />
                  بيانات الورشة
                </button>
                
                <button
                  onClick={() => setActiveTab("ads")}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-right ${
                    activeTab === "ads"
                      ? "bg-syria-terracotta/10 text-syria-terracotta"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Wrench className="h-5 w-5 ml-3" />
                  إعلانات الورشة
                  <span className="mr-auto bg-syria-terracotta text-white text-xs rounded-full px-2 py-1">
                    {ads.length}
                  </span>
                </button>
                
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
              <button
                onClick={() => setActiveTab("ads")}
                className="button-primary w-full flex items-center justify-center py-3 rounded-lg"
              >
                <PlusCircle className="h-5 w-5 ml-2" />
                إضافة إعلان
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">نظرة عامة على الورشة</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">إعلانات الورشة</h3>
                    <p className="text-3xl font-bold text-blue-800">{ads.length}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-2">المشاهدات</h3>
                    <p className="text-3xl font-bold text-green-800">0</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                    <h3 className="text-lg font-medium text-orange-800 mb-2">التقييمات</h3>
                    <p className="text-3xl font-bold text-orange-800">0</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-4">معلومات الورشة الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">اسم الورشة</p>
                      <p className="font-medium">{workshopForm.name || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">الموقع</p>
                      <p className="font-medium">{workshopForm.location || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">المدينة</p>
                      <p className="font-medium">{workshopForm.city || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">رقم السجل التجاري</p>
                      <p className="font-medium">{workshopForm.commercial_registration_number || "غير محدد"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "workshop-data" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">بيانات الورشة</h2>
                  <button
                    onClick={() => setEditingWorkshop(!editingWorkshop)}
                    className="px-4 py-2 bg-syria-terracotta text-white rounded-lg text-sm hover:bg-syria-terracotta/90 transition"
                  >
                    {editingWorkshop ? "إلغاء التعديل" : "تعديل البيانات"}
                  </button>
                </div>
                
                {editingWorkshop ? (
                  <form onSubmit={handleWorkshopUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم الورشة</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={workshopForm.name || ""}
                          onChange={(e) => setWorkshopForm({...workshopForm, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={workshopForm.location || ""}
                          onChange={(e) => setWorkshopForm({...workshopForm, location: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={workshopForm.city || ""}
                          onChange={(e) => setWorkshopForm({...workshopForm, city: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم السجل التجاري</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={workshopForm.commercial_registration_number || ""}
                          onChange={(e) => setWorkshopForm({...workshopForm, commercial_registration_number: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="px-6 py-2 bg-syria-terracotta text-white rounded-lg hover:bg-syria-terracotta/90 transition">
                      حفظ التغييرات
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">اسم الورشة</p>
                        <p className="font-medium">{workshopForm.name || "غير محدد"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">الموقع</p>
                        <p className="font-medium">{workshopForm.location || "غير محدد"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المدينة</p>
                        <p className="font-medium">{workshopForm.city || "غير محدد"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">رقم السجل التجاري</p>
                        <p className="font-medium">{workshopForm.commercial_registration_number || "غير محدد"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ads" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">إعلانات الورشة</h2>
                  <button
                    onClick={() => setShowAdForm(!showAdForm)}
                    className="px-4 py-2 bg-syria-terracotta text-white rounded-lg text-sm hover:bg-syria-terracotta/90 transition flex items-center"
                  >
                    <PlusCircle className="h-4 w-4 ml-2" />
                    {showAdForm ? "إلغاء الإضافة" : "إضافة إعلان"}
                  </button>
                </div>
                
                {showAdForm && (
                  <form onSubmit={handleAdSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-medium mb-4">إضافة إعلان جديد</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={adForm.title}
                          onChange={(e) => setAdForm({...adForm, title: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">السعر</label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={adForm.price}
                          onChange={(e) => setAdForm({...adForm, price: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">وصف الإعلان</label>
                        <textarea
                          className="w-full px-4 py-2 border rounded-lg"
                          rows="3"
                          value={adForm.description}
                          onChange={(e) => setAdForm({...adForm, description: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="px-6 py-2 bg-syria-terracotta text-white rounded-lg hover:bg-syria-terracotta/90 transition">
                        إضافة الإعلان
                      </button>
                    </div>
                  </form>
                )}
                
                {ads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">العنوان</th>
                          <th className="text-right py-3 px-4">السعر</th>
                          <th className="text-right py-3 px-4">الوصف</th>
                          <th className="text-right py-3 px-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ads.map(ad => {
                          // استخراج البيانات من مصفوفة data
                          const adData = {};
                          if (ad.data && Array.isArray(ad.data)) {
                            ad.data.forEach(item => {
                              adData[item.key] = item.value;
                            });
                          }
                          
                          return (
                            <tr key={ad.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <p className="font-medium">{ad.title || "بدون عنوان"}</p>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-medium">{ad.price ? `${ad.price} ل.س` : "غير محدد"}</span>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-sm text-gray-500">{ad.description ? `${ad.description.substring(0, 50)}...` : "بدون وصف"}</p>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Link
                                    to={`/workshop-ad/${ad.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                    title="عرض"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  <button
                                    onClick={() => editAd(ad.id)}
                                    className="p-2 text-syria-terracotta hover:bg-orange-50 rounded-full"
                                    title="تعديل"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteAd(ad.id)}
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
                    <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد إعلانات</h3>
                    <p className="text-muted-foreground mb-4">ابدأ بإضافة أول إعلان لورشتك</p>
                    <button 
                      onClick={() => setShowAdForm(true)}
                      className="px-6 py-2 bg-syria-terracotta text-white rounded-lg hover:bg-syria-terracotta/90 transition"
                    >
                      إضافة إعلان
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">إعدادات الورشة</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
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
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4 text-red-600">منطقة الخطر</h3>
                    <p className="text-sm text-red-700 mb-4">حذف الورشة بشكل دائم وإزالة جميع البيانات</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
                      حذف الورشة
                    </button>
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

export default WorkshopDashboard;