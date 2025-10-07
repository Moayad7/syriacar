import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Upload, X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "يجب أن يحتوي اسم المتجر على 3 أحرف على الأقل",
  }),
  description: z.string().min(10, {
    message: "يجب أن تحتوي الوصف على 10 أحرف على الأقل",
  }),
  address: z.string().min(5, {
    message: "يرجى إدخال عنوان المتجر",
  }),
  phone: z.string().min(10, {
    message: "يرجى إدخال رقم هاتف صحيح",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
  website: z.string().url({
    message: "يرجى إدخال رابط موقع إلكتروني صحيح",
  }).optional().or(z.literal('')),
  status: z.string().min(1, {
    message: "يرجى اختيار حالة المتجر",
  }),
});

const AddStore: React.FC = () => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      status: "active",
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      if (values.website) {
        formData.append("website", values.website);
      }
      formData.append("status", values.status);
      
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axios.post("/api/stores", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      if (response.status == 201) {
        toast.success("تم إنشاء المتجر بنجاح");
        form.reset();
        setLogoFile(null);
        setLogoPreview(null);
        navigate("/dashboards");
      } else {
        toast.error(response.data.message || "حدث خطأ أثناء إنشاء المتجر");
      }
    } catch (error: any) {
      console.error("Error adding store:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إنشاء المتجر");
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">إنشاء متجر جديد</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل المتجر لإضافته إلى منصة مركز السيارات السوري
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المتجر</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: متجر أحمد لقطع الغيار" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف المتجر</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="وصف مختصر عن المتجر والخدمات التي يقدمها..." 
                          className="min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان المتجر</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: حي الشهباء، شارع الرئيسي" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: 0991234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="مثال: store@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع الإلكتروني (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Logo Upload */}
                <FormItem>
                  <FormLabel>شعار المتجر</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 ml-2" />
                        اختر صورة
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="معاينة الشعار"
                          className="h-16 w-16 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                        يفضل صورة بحجم 200x200 بكسل
                  </p>
                </FormItem>

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>حالة المتجر</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر حالة المتجر" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="inactive">غير نشط</SelectItem>
                          <SelectItem value="pending">قيد المراجعة</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button type="submit" className="w-full max-w-md py-3 text-lg">
                    <Check className="ml-2 h-5 w-5" /> إنشاء المتجر
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">معلومات مهمة:</h3>
            <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
              <li>سيتم مراجعة طلب إنشاء المتجر من قبل الإدارة قبل الموافقة عليه</li>
              <li>تأكد من صحة المعلومات المقدمة لتسريع عملية المراجعة</li>
              <li>يمكنك تعديل معلومات المتجر لاحقاً من لوحة التحكم</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddStore;