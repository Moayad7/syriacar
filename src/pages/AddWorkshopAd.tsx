import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Check } from "lucide-react";
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
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  workshop_id: z.string().min(1, {
    message: "يرجى إدخال رقم الورشة",
  }),
  title: z.string().min(5, {
    message: "يجب أن يحتوي العنوان على 5 أحرف على الأقل",
  }),
  description: z.string().min(10, {
    message: "يجب أن يحتوي الوصف على 10 أحرف على الأقل",
  }),
  price: z.string().min(1, {
    message: "يرجى إدخال السعر",
  }),
});

const AddWorkshopAd: React.FC = () => {
  const navigate = useNavigate();

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
      workshop_id: "",
      title: "",
      description: "",
      price: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    

    try {

      const formData = new FormData();

      formData.append("workshop_id", values.workshop_id);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);

      console.log("Form Data:", formData);

      const token = localStorage.getItem("token");
      const response = await axios.post("/api/workshop-ads", formData);
      toast.success("تم إضافة الإعلان بنجاح");
      form.reset();
      console.log(response)
    } catch (error) {
      console.error("Error adding workshop ad:", error);
      toast.error("حدث خطأ أثناء إضافة الإعلان");
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">إضافة إعلان ورشة</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل الإعلان لإضافته إلى قائمة إعلانات الورش
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Workshop ID */}
                <FormField
                  control={form.control}
                  name="workshop_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الورشة</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="مثال: 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الإعلان</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: خدمة اصلاح مرسيدس" {...field} />
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
                      <FormLabel>وصف الإعلان</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصفاً تفصيلياً للخدمة" className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="مثال: 1002" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" className="w-full max-w-md">
                    <Check className="mr-2 h-4 w-4" /> إضافة الإعلان
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

export default AddWorkshopAd;

