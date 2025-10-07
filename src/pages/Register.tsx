import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import axios from '../config/axiosConfig';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      name: name,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      role: role
    }

    if (password !== password_confirmation) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة.",
      });
      return;
    }

    try {
      const response = await axios.post('/auth/register', user);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('role', response.data.data.user.role);
      localStorage.setItem('user_id', response.data.data.user.id);
      toast({
        title: "نجاح",
        description: "تم إنشاء حسابك بنجاح.",
      });
      navigate("/")
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "خطأ",
        description: "فشل تسجيل الحساب. تحقق من بياناتك.",
      });
    }
  };

  // تعريف الأدوار والتبويبات
  const roles = [
    { id: 'user', label: 'زبون', icon: '👤' },
    { id: 'shop_manager', label: 'بائع', icon: '🏪' },
    { id: 'workshop', label: 'صاحب ورشة', icon: '🔧' },
    { id: 'admin', label: 'أدمن', icon: '👑' }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-20 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground">سجل الآن للوصول إلى كافة خدمات مركز السيارات السوري</p>
          </div>
          
          {/* تبويبات اختيار الدور */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">اختر نوع الحساب</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((roleItem) => (
                <button
                  key={roleItem.id}
                  type="button"
                  className={`p-3 border rounded-md flex flex-col items-center justify-center transition-colors ${
                    role === roleItem.id 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setRole(roleItem.id)}
                >
                  <span className="text-xl mb-1">{roleItem.icon}</span>
                  <span className="text-xs">{roleItem.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">الاسم الكامل</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="أدخل اسمك الكامل"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="أدخل كلمة المرور"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">تأكيد كلمة المرور</label>
              <input 
                type="password" 
                id="confirmPassword" 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="أعد إدخال كلمة المرور"
                value={password_confirmation}
                required
                onChange={(e) => setPassword_confirmation(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="terms" 
                required
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="terms" className="mr-2 block text-sm text-gray-700">
                أوافق على <Link to="/terms" className="text-primary hover:underline">الشروط والأحكام</Link> و <Link to="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              تسجيل كـ {roles.find(r => r.id === role)?.label}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;