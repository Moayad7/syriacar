import React, { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Upload, X, Eye, Car, Tag, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "../config/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";

// تعريف مخطط التحقق للسيارة
const carFormSchema = z.object({
  // بيانات السيارة
  name: z.string().min(5, {
    message: "يجب أن يحتوي الاسم على 5 أحرف على الأقل",
  }),
  brand: z.string({
    required_error: "يرجى اختيار الماركة",
  }),
  category_id: z.string().min(1, {
    message: "يرجى اختيار فئة السيارة",
  }),
  country_of_manufacture: z.string().min(2, {
    message: "يرجى إدخال بلد التصنيع",
  }),
  model: z.string().min(2, {
    message: "يرجى إدخال الموديل",
  }),
  year: z.string(),
  condition: z.string().min(3, {
    message: "يرجى إدخال حالة السيارة",
  }),
  mileage: z.string().min(1, {
    message: "يرجى إدخال عدد الكيلومترات",
  }),
  fuel_type: z.string({
    required_error: "يرجى اختيار نوع الوقود",
  }),
  transmission: z.string({
    required_error: "يرجى اختيار ناقل الحركة",
  }),
  horsepower: z.string().min(1, {
    message: "يرجى إدخال قوة المحرك",
  }),
  seats: z.string().min(1, {
    message: "يرجى إدخال عدد المقاعد",
  }),
  color: z.string().min(3, {
    message: "يرجى إدخال اللون",
  }),
  description: z.string().min(20, {
    message: "يجب أن يحتوي الوصف على 20 حرفًا على الأقل",
  }),
  is_featured: z.string().optional(),
  other_benefits: z.string().optional(),
});

// تعريف مخطط التحقق للعرض
const offerFormSchema = z.object({
  // بيانات العرض
  offer_type: z.enum(["sale", "rent"], {
    required_error: "يرجى اختيار نوع العرض",
  }),
  price: z.string().min(1, {
    message: "يرجى إدخال السعر",
  }),
  price_unit: z.string().optional(),
  pricing_period: z.string().optional(),
  is_available: z.string().optional(),
  additional_features: z.string().optional(),
  location: z.string().min(1, {
    message: "يرجى إدخال الموقع",
  }),
}).refine((data) => {
  // إذا كان نوع العرض هو "rent"، يجب إدخال pricing_period
  if (data.offer_type === "rent") {
    return !!data.pricing_period;
  }
  return true;
}, {
  message: "يرجى إدخال فترة التسعير للعروض المؤجرة",
  path: ["pricing_period"],
});

interface UploadedFile {
  file: File;
  preview: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

const AddCar: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("car");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [carId, setCarId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  };

  // نموذج بيانات السيارة
  const carForm = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      category_id: "",
      country_of_manufacture: "",
      model: "",
      year: "",
      condition: "new",
      mileage: "",
      fuel_type: "",
      transmission: "",
      horsepower: "",
      seats: "",
      color: "",
      description: "",
      is_featured: "1",
      other_benefits: "",
    },
  });

  // نموذج بيانات العرض
  const offerForm = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      offer_type: "sale",
      price: "",
      price_unit: "SYR",
      pricing_period: "",
      is_available: "1",
      additional_features: "",
      location: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        toast.error("يجب رفع صور فقط");
        continue;
      }

      // التحقق من حجم الملف (10MB كحد أقصى)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 10MB");
        continue;
      }

      // إنشاء معاينة للصورة
      const preview = URL.createObjectURL(file);
      newFiles.push({ file, preview });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      // تحرير الذاكرة المستخدمة للمعاينة
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  // محاكاة تحميل الصور (يمكن استبدالها برفع حقيقي إذا لزم الأمر)
  const uploadImages = useCallback(async () => {
    const updatedFiles = [...uploadedFiles];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      if (!updatedFiles[i].isUploading) {
        updatedFiles[i] = { ...updatedFiles[i], isUploading: true, uploadProgress: 0 };
        setUploadedFiles([...updatedFiles]);
        
        // محاكاة عملية الرفع
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          updatedFiles[i] = { ...updatedFiles[i], uploadProgress: progress };
          setUploadedFiles([...updatedFiles]);
        }
        
        updatedFiles[i] = { ...updatedFiles[i], isUploading: false, uploadProgress: 100 };
        setUploadedFiles([...updatedFiles]);
      }
    }
    
    return true;
  }, [uploadedFiles]);

  // إضافة سيارة جديدة
  const addCar = async (carData: z.infer<typeof carFormSchema>) => {
    try {
      const carFormData = new FormData();

      // إضافة بيانات السيارة
      Object.entries(carData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            carFormData.append(key, value ? "1" : "0");
          } else {
            carFormData.append(key, value.toString());
          }
        }
      });

      // إضافة الصور
      uploadedFiles.forEach((uploadedFile) => {
        carFormData.append("images[]", uploadedFile.file);
      });

      const carResponse = await axios.post("/api/cars", carFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          // يمكن استخدام هذه النسبة لعرض شريط تقدم عام إذا لزم الأمر
        },
      });
      console.log(carResponse.data.id)
      return carResponse.data.id;
    } catch (error: any) {
      console.error("Error adding car:", error);
      throw error;
    }
  };

  // إضافة عرض جديد
  const addOffer = async (offerData: z.infer<typeof offerFormSchema>, carId: string) => {
    try {
      const offerPayload = {
        car_id: carId,
        offer_type: offerData.offer_type,
        price: offerData.price,
        price_unit: offerData.price_unit,
        pricing_period: offerData.offer_type === "rent" ? offerData.pricing_period : null,
        is_available: offerData.is_available === "1",
        additional_features: offerData.additional_features,
        location: offerData.location,
      };

      await axios.post(`/api/cars/${carId}/offers`, offerPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error: any) {
      console.error("Error adding offer:", error);
      throw error;
    }
  };

  // إرسال النموذج المدمج
  const onSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("يرجى رفع صور للسيارة");
      return;
    }

    setIsUploading(true);

    try {
      // رفع الصور أولاً
      const imagesUploaded = await uploadImages();
      if (!imagesUploaded) {
        toast.error("فشل في تحميل الصور");
        return;
      }

      // أولاً: إنشاء السيارة
      const carValues = carForm.getValues();
      const carId = await addCar(carValues);
      setCarId(carId);
      
      // ثانياً: إنشاء العرض المرتبط بالسيارة
      const offerValues = offerForm.getValues();
      await addOffer(offerValues, carId);

      toast.success("تم إضافة السيارة والعرض بنجاح");
      navigate("/car-listings"); // توجيه المستخدم إلى صفحة السيارات بعد الإضافة
    } catch (error: any) {
      console.error("Error adding car and offer:", error);

      if (error.response?.data?.errors) {
        // معالجة أخطاء التحقق من الخادم
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            toast.error(`${field}: ${message}`);
          }
        );
      } else {
        toast.error("حدث خطأ أثناء إضافة السيارة والعرض");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // معاينة البيانات قبل الإرسال
  const handlePreview = async () => {
    const carValid = await carForm.trigger();
    
    if (carValid) {
      const offerValid = await offerForm.trigger();
      
      if (offerValid) {
        setIsPreviewMode(true);
        setActiveTab("offer");
      } else {
        setActiveTab("offer");
      }
    } else {
      setActiveTab("car");
    }
  };

  // العودة من وضع المعاينة إلى وضع التحرير
  const handleEdit = () => {
    setIsPreviewMode(false);
  };

  // تنظيف المعاينات عند إلغاء المكون
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [uploadedFiles]);

  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">إضافة سيارة وعرض جديد</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل السيارة والعرض لإضافتها إلى الموقع
            </p>
          </div>

          <div className="bg-white p-4 md:p-8 rounded-lg shadow-md border border-border">
            <Form {...carForm}>
              <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="car" className="flex items-center gap-2">
                      <Car className="h-4 w-4" /> بيانات السيارة
                    </TabsTrigger>
                    <TabsTrigger value="offer" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" /> بيانات العرض
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="car" className="space-y-6">
                    {/* Name */}
                    <FormField
                      control={carForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم السيارة</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: تويوتا كورولا 2023"
                              {...field}
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Brand */}
                    <FormField
                      control={carForm.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الماركة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isPreviewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر ماركة السيارة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">تويوتا</SelectItem>
                              <SelectItem value="2">مرسيدس</SelectItem>
                              <SelectItem value="3">بي إم دبليو</SelectItem>
                              <SelectItem value="4">أودي</SelectItem>
                              <SelectItem value="5">هوندا</SelectItem>
                              <SelectItem value="6">كيا</SelectItem>
                              <SelectItem value="7">هيونداي</SelectItem>
                              <SelectItem value="8">نيسان</SelectItem>
                              <SelectItem value="9">لكزس</SelectItem>
                              <SelectItem value="10">فورد</SelectItem>
                              <SelectItem value="11">شيفروليه</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category ID */}
                    <FormField
                      control={carForm.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>فئة السيارة (رقم)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Country of Manufacture */}
                    <FormField
                      control={carForm.control}
                      name="country_of_manufacture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>بلد التصنيع</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: اليابان" 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Model */}
                    <FormField
                      control={carForm.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الموديل</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: كورولا" 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Year */}
                    <FormField
                      control={carForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سنة الصنع</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1900}
                              max={new Date().getFullYear() + 1}
                              {...field}
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Condition */}
                    <FormField
                      control={carForm.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>حالة السيارة</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPreviewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر حالة السيارة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">جديد</SelectItem>
                              <SelectItem value="used">مستعمل</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mileage */}
                    <FormField
                      control={carForm.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد الكيلومترات</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fuel Type */}
                    <FormField
                      control={carForm.control}
                      name="fuel_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الوقود</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPreviewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الوقود" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="petrol">بنزين</SelectItem>
                              <SelectItem value="diesel">ديزل</SelectItem>
                              <SelectItem value="hybrid">هجين</SelectItem>
                              <SelectItem value="electric">كهربائي</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transmission */}
                    <FormField
                      control={carForm.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ناقل الحركة</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPreviewMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع ناقل الحركة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="automatic">أوتوماتيك</SelectItem>
                              <SelectItem value="manual">يدوي</SelectItem>
                              <SelectItem value="cvt">CVT</SelectItem>
                              <SelectItem value="dct">DCT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Horsepower */}
                    <FormField
                      control={carForm.control}
                      name="horsepower"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>قوة المحرك (حصان)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Seats */}
                    <FormField
                      control={carForm.control}
                      name="seats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد المقاعد</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={20} 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Color */}
                    <FormField
                      control={carForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اللون</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: أبيض" 
                              {...field} 
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={carForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="اكتب وصفاً تفصيلياً للسيارة"
                              className="min-h-32"
                              {...field}
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Other Benefits */}
                    <FormField
                      control={carForm.control}
                      name="other_benefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مزايا أخرى</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="مثال: صيانة مجانية لمدة سنة"
                              className="min-h-20"
                              {...field}
                              disabled={isPreviewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload */}
                    <div className="space-y-4">
                      <FormLabel>صور السيارة</FormLabel>
                      <div className="border border-dashed border-border rounded-lg p-6">
                        {!isPreviewMode ? (
                          <div className="flex flex-col items-center justify-center gap-4">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <div className="text-center">
                              <h3 className="font-medium">اسحب وأفلت الصور هنا أو</h3>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                              />
                              <label
                                htmlFor="file-upload"
                                className="text-primary hover:text-primary/80 cursor-pointer font-medium"
                              >
                                اختر من الجهاز
                              </label>
                              <p className="text-sm text-muted-foreground mt-1">
                                PNG, JPG, JPEG حتى 10MB
                              </p>
                            </div>
                          </div>
                        ) : null}

                        {/* معاينة الصور المرفوعة */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-3">
                              الصور المرفوعة ({uploadedFiles.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {uploadedFiles.map((uploadedFile, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={uploadedFile.preview}
                                    alt={`معاينة ${index + 1}`}
                                    className="h-24 w-full object-cover rounded-md"
                                  />
                                  {uploadedFile.isUploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                                      <span className="text-white text-xs ml-1">
                                        {uploadedFile.uploadProgress}%
                                      </span>
                                    </div>
                                  )}
                                  {!isPreviewMode && (
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      {isPreviewMode ? (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleEdit}
                          className="flex items-center"
                        >
                          تعديل البيانات <X className="mr-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={handlePreview}
                          className="flex items-center"
                        >
                          معاينة البيانات <Eye className="mr-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="offer" className="space-y-6">
                    <Form {...offerForm}>
                      {/* Offer Type */}
                      <FormField
                        control={offerForm.control}
                        name="offer_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نوع العرض</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isPreviewMode}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر نوع العرض" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sale">بيع</SelectItem>
                                <SelectItem value="rent">إيجار</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Price */}
                      <FormField
                        control={offerForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السعر</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={0} 
                                {...field} 
                                disabled={isPreviewMode}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || parseFloat(value) >= 0) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Price Unit */}
                      <FormField
                        control={offerForm.control}
                        name="price_unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>وحدة السعر</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isPreviewMode}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر وحدة السعر" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SYR">ليرة سورية</SelectItem>
                                <SelectItem value="USD">دولار أمريكي</SelectItem>
                                <SelectItem value="EUR">يورو</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pricing Period (يظهر فقط إذا كان نوع العرض rent) */}
                      {offerForm.watch("offer_type") === "rent" && (
                        <FormField
                          control={offerForm.control}
                          name="pricing_period"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>فترة التسعير</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isPreviewMode}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر فترة التسعير" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">يومي</SelectItem>
                                  <SelectItem value="weekly">أسبوعي</SelectItem>
                                  <SelectItem value="monthly">شهري</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Is Available */}
                      <FormField
                        control={offerForm.control}
                        name="is_available"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحالة</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isPreviewMode}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر حالة العرض" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">متاح</SelectItem>
                                <SelectItem value="0">غير متاح</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Additional Features */}
                      <FormField
                        control={offerForm.control}
                        name="additional_features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ميزات إضافية</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="أدخل أي ميزات إضافية للعرض"
                                className="min-h-20"
                                {...field}
                                disabled={isPreviewMode}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location */}
                      <FormField
                        control={offerForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الموقع</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="أدخل موقع السيارة" 
                                {...field} 
                                disabled={isPreviewMode}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Form>

                    <div className="flex flex-col-reverse md:flex-row justify-between pt-4 gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("car")}
                        className="flex items-center"
                      >
                        <Car className="ml-2 h-4 w-4" /> العودة إلى بيانات السيارة
                      </Button>
                      
                      {isPreviewMode ? (
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleEdit}
                            className="flex items-center"
                          >
                            تعديل البيانات
                          </Button>
                          <Button
                            type="submit"
                            className="flex items-center"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإضافة...
                              </>
                            ) : (
                              <>
                                <Check className="ml-2 h-4 w-4" /> تأكيد الإضافة
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="submit"
                          className="flex items-center"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإضافة...
                            </>
                          ) : (
                            <>
                              <Check className="ml-2 h-4 w-4" /> إضافة السيارة والعرض
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCar;