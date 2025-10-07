import React, { useState } from "react";
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
import axios from "../config/axiosConfig"; // Import the Axios instance
import axiosInstance from "../config/axiosConfig";

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
  year: z.number().min(1886, {
    message: "يرجى إدخال سنة صحيحة",
  }),
  condition: z.string().min(3, {
    message: "يرجى إدخال حالة السيارة",
  }),
  mileage: z.number().nullable().optional(),
  fuel_type: z.string({
    required_error: "يرجى اختيار نوع الوقود",
  }),
  transmission: z.string({
    required_error: "يرجى اختيار ناقل الحركة",
  }),
  horsepower: z.number().min(0, {
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
  other_benefits: z.string().optional(),
});

const AddCar = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      category_id: '', // Default value, adjust as necessary
      country_of_manufacture: "",
      model: "",
      year: 2025, // Default to current year
      condition: "new", // Default value, adjust as necessary
      mileage: 0,
      fuel_type: "",
      transmission: "",
      horsepower: 0,
      seats: '', // Default value, adjust as necessary
      color: "",
      description: "",
      is_featured: true, // Default value, adjust as necessary
      other_benefits: "",
    },
  });
const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const dataToSubmit = {
      //   name: values.name,
      //   brand: values.brand,
      //   category_id: values.category_id,
      //   country_of_manufacture: values.country_of_manufacture,
      //   model: values.model,
      //   year: values.year,
      //   condition: values.condition,
      //   mileage: values.mileage,
      //   fuel_type: values.fuel_type,
      //   transmission: values.transmission,
      //   horsepower: values.horsepower,
      //   seats: values.seats,
      //   color: values.color,
      //   description: values.description,
      //   is_featured: values.is_featured,
      //   other_benefits: values.other_benefits,
      // };
      // Make an API call to submit the form data
      const response = await axios.post("/api/cars", values); // Adjust the endpoint as necessary
      console.log(response.data);
      toast.success("تم إضافة السيارة بنجاح");
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error("حدث خطأ أثناء إضافة السيارة");
    }
  };

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       // Prepare the data to match the expected format
//       
// console.log(values);
//       // Make an API call to submit the form data
//       const response = await axiosInstance.post("/api/cars", dataToSubmit); // Adjust the endpoint as necessary
//       console.log(response.data);
//       toast.success("تم إضافة السيارة بنجاح");
//     } catch (error) {
//       console.error("Error adding car:", error);
//       toast.error("حدث خطأ أثناء إضافة السيارة");
//     }
// console.log("submit")
//   };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">إضافة سيارة جديدة</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل السيارة لإضافتها إلى قائمة السيارات المعروضة للبيع
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-border">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم السيارة</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: تويوتا كورولا 3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الماركة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر ماركة السيارة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="toyota">تويوتا</SelectItem>
                              <SelectItem value="mercedes">مرسيدس</SelectItem>
                              <SelectItem value="bmw">بي إم دبليو</SelectItem>
                              {/* Add other brands as needed */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="country_of_manufacture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>بلد التصنيع</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: اليابان"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الموديل</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: كورولا"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سنة الصنع</FormLabel>
                          <FormControl>
                            <Input
                              type="string"
                              min="1886"
                              placeholder="مثال: 2022"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>حالة السيارة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد الكيلومترات</FormLabel>
                          <FormControl>
                            <Input
                              type="string"
                              min="0"
                              placeholder="مثال: 50000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="fuel_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الوقود</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ناقل الحركة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="horsepower"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>قوة المحرك</FormLabel>
                          <FormControl>
                            <Input
                              type="string"
                              min="0"
                              placeholder="مثال: 132"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="seats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد المقاعد</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="مثال: 5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اللون</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: أبيض"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اكتب وصفاً تفصيلياً للسيارة"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium">رفع صور السيارة</h3>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">اختيار الصور</label>
                    <div className="mt-2">
                      {selectedFiles.length > 0 && (
                        <ul>
                          {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

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

export default AddCar;







// 
