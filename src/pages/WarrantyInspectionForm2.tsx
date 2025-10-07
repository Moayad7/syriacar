import React from "react";
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "يجب أن يحتوي الاسم على حرفين على الأقل",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صالح",
  }),
  phone: z.string().min(10, {
    message: "يرجى إدخال رقم هاتف صالح",
  }),
  vehicleDetails: z.string().min(5, {
    message: "يرجى إدخال تفاصيل السيارة",
  }),
  issueDescription: z.string().min(20, {
    message: "يجب أن يحتوي الوصف على 20 حرفًا على الأقل",
  }),
});

const WarrantyInspectionForm: React.FC = () => {
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
    console.log(values)
    try {
      const response = await axios.post("/api/inspection", values);
      console.log(response)
      toast.success("تم إرسال طلب الضمان بنجاح");
      form.reset();
    } catch (error) {
      console.error("Error submitting warranty inspection request:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-20">
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder="اسمك" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                {/* <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="البريد الإلكتروني" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Phone */}
                {/* <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="رقم الهاتف" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Vehicle Details */}
                {/* <FormField
                  control={form.control}
                  name="vehicleDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تفاصيل السيارة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: تويوتا كورولا 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Issue Description */}
                {/* <FormField
                  control={form.control}
                  name="issueDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف المشكلة</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصفاً تفصيلياً للمشكلة" className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" className="w-full max-w-md">
                    <Check className="mr-2 h-4 w-4" /> إرسال الطلب
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
