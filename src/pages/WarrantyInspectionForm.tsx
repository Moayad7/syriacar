import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Upload } from "lucide-react";
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
import { useLocation, useNavigate } from "react-router-dom";

const formSchema = z.object({
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
  // mileage: z.number(),
  mileage: z.string().min(1, {
    message: "يرجى إدخال عدد المقاعد",
  }),
  fuel_type: z.string({
    required_error: "يرجى اختيار نوع الوقود",
  }),
  transmission: z.string({
    required_error: "يرجى اختيار ناقل الحركة",
  }),
  horsepower: z.string().min(0, {
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
  is_featured: z.boolean().optional(),
  other_benefits: z.string().optional()
});

const WarrantyInspectionForm: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    checkToken();
  }, []);
  
   const checkToken = () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      // Redirect to sign in if not authenticated
      navigate("/login");
    } else {
      // Fetch properties if authenticated
      //  navigate(location.pathname);
    }
  };

 



    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        // email: "",
        // phone: "",
        // vehicleDetails: "",
        // issueDescription: "",
      },
    });
  

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {
      
      const response = await axios.post("/api/inspection", values);
      console.log(response)
       toast.success("تم إرسال طلب الضمان بنجاح");
            form.reset();
      setSelectedFiles([]);
    } catch (error) {
       console.error("Error submitting warranty inspection request:", error);
            toast.error("حدث خطأ أثناء إرسال الطلب");
    }
  };
  console.log(location);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    console.log(files)
    // setSelectedFiles(files);
  };


  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
           <h1 className="text-3xl font-bold mb-2">طلب فحص الضمان</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيلك وطلب فحص الضمان للسيارة الخاصة بك
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  onChange={handleFileChange}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم السيارة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: تويوتا كورولا 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" className="w-full max-w-md">
                    <Check className="mr-2 h-4 w-4" /> إضافة السيارة
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WarrantyInspectionForm;
