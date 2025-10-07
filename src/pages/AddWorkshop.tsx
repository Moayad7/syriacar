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
import axios from "../config/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "يجب أن يحتوي الاسم على 5 أحرف على الأقل",
  }),
  location: z.string().min(5, {
    message: "يرجى إدخال موقع الورشة",
  }),
  city: z.string().min(2, {
    message: "يرجى إدخال المدينة",
  }),
  commercial_registration_number: z.string().min(10, {
    message: "يرجى إدخال رقم السجل التجاري",
  })
});

const AddWorkshop: React.FC = () => {
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      city: "",
      commercial_registration_number: "",
      // user_id: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Log the form data to the console
    console.log("Form Data:", values);
    
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("location", values.location);
      formData.append("city", values.city);
      formData.append("commercial_registration_number", values.commercial_registration_number);

      const response = await axios.post("/api/workshops", formData);
      toast.success("تم إضافة الورشة بنجاح");
      form.reset();
      console.log(response)
    } catch (error) {
      console.error("Error adding workshop:", error);
      toast.error("حدث خطأ أثناء إضافة الورشة");
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">إضافة ورشة جديدة</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل الورشة لإضافتها إلى قائمة الورش المتاحة
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
                      <FormLabel>اسم الورشة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: ورشة أحمد" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>موقع الورشة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: حي الشهباء" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: حلب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Commercial Registration Number */}
                <FormField
                  control={form.control}
                  name="commercial_registration_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم السجل التجاري</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: a213412412412d2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* User ID */}
                {/* <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>معرف المستخدم</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" className="w-full max-w-md">
                    <Check className="mr-2 h-4 w-4" /> إضافة الورشة
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

export default AddWorkshop;
