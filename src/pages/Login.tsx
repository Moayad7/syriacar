// src/pages/Login.tsx
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import axios from '../config/axiosConfig'; // Import the Axios instance
import { useToast } from '@/components/ui/use-toast'; // Import toast for notifications
import { useAuth } from '../AuthContext'; // Import the AuthContext

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    console.log({ email, password });

    try {
      const response = await axios.post('/auth/login', { email, password }); // Adjust the endpoint as necessary
      console.log(response);

      // Show success toast
      toast({
        title: "تسجيل الدخول ناجح",
        description: "تم تسجيل الدخول بنجاح.",
      });

      // Store the token in local storage and call the login function
      const access_token = response.data.token;
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('id', response.data.id);

      console.log(response.data.user)
      // Call the login function from AuthContext
      login(access_token);

      // Redirect to the previous location or home
      const from = location.state?.from || '/';
      navigate(from);
      // console.log(from)

    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "خطأ",
        description: "فشل تسجيل الدخول. تحقق من بيانات الاعتماد الخاصة بك.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-20 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
            <p className="text-muted-foreground">سجل دخولك للوصول إلى حسابك وإدارة إعلاناتك</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
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
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="remember" className="mr-2 block text-sm text-gray-700">
                تذكرني
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              تسجيل الدخول
            </button>
          </form>
          
          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-muted-foreground">أو</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <Facebook size={18} className="text-syria-facebookBlue" />
            <span>تسجيل الدخول باستخدام فيسبوك</span>
          </Button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
