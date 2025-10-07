import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
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
import { useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "يجب أن يحتوي اسم الورشة على 3 أحرف على الأقل",
  }),
  city: z.string().min(2, {
    message: "يرجى إدخال المدينة",
  }),
  location: z.string().min(5, {
    message: "يرجى إدخال موقع الورشة",
  }),
  commercial_registration_number: z.string().min(5, {
    message: "يرجى إدخال رقم السجل التجاري",
  })
});

const EditWorkshop: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkToken();
    if (id) {
      fetchWorkshopData();
    }
  }, [id]);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  };

  const fetchWorkshopData = async () => {
    try {
      const response = await axios.get(`/api/workshops`);
      const workshop = response.data.data.filter(item => item.id == id);
      console.log(workshop);
      form.reset({
        name: workshop[0].name || "",
        city: workshop[0].city || "",
        location: workshop[0].location || "",
        commercial_registration_number: workshop[0].commercial_registration_number || "",
      });
    } catch (error) {
      console.error("Error fetching workshop data:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات الورشة");
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      location: "",
      commercial_registration_number: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("city", values.city);
      formData.append("location", values.location);
      formData.append("commercial_registration_number", values.commercial_registration_number);
      formData.append("_method", "PUT");

      const response = await axios.put(`/api/workshops/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success("تم تحديث الورشة بنجاح");
        navigate("/workshops-dashboard");
      } else {
        toast.error(response.data.message || "حدث خطأ أثناء تحديث الورشة");
      }
    } catch (error: any) {
      console.error("Error updating workshop:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تحديث الورشة");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-16">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-syria-terracotta" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">تعديل الورشة</h1>
            <p className="text-muted-foreground">
              قم بتعديل تفاصيل الورشة الخاصة بك
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
                        <Input placeholder="مثال: ورشة أحمد لإصلاح السيارات" {...field} />
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

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>موقع الورشة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: حي الشهباء، شارع الرئيسي" {...field} />
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
                        <Input placeholder="مثال: 123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="w-full max-w-md py-3 text-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        جاري التحديث...
                      </>
                    ) : (
                      <>
                        <Check className="ml-2 h-5 w-5" /> تحديث الورشة
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">معلومات عن رقم السجل التجاري:</h3>
            <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
              <li>رقم السجل التجاري هو معرف فريد تمنحه الحكومة للكيان التجاري عند تسجيله:cite[3]:cite[5]</li>
              <li>يستخدم لأغراض ضريبية وإعداد التقارير المالية والامتثال القانوني:cite[3]</li>
              <li>يعزز المصداقية والسمعة القانونية للورشة:cite[5]</li>
              <li>مطلوب للتعاملات الرسمية مثل فتح الحسابات المصرفية والتوقيع على العقود:cite[5]</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditWorkshop;