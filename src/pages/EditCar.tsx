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
import { useParams, useNavigate } from "react-router-dom";

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
  mileage: z.number().min(0, {
    message: "يرجى إدخال عدد المقاعد",
  }),
  fuel_type: z.string({
    required_error: "يرجى اختيار نوع الوقود",
  }),
  transmission: z.string({
    required_error: "يرجى اختيار ناقل الحركة",
  }),
  horsepower: z.number().min(0, {
    message: "يرجى إدخال قوة المحرك",
  }),
  seats: z.number().min(0, {
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

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [carData, setCarData] = useState<any>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      category_id: "",
      country_of_manufacture: "",
      model: "",
      year: "",
      condition: "new",
      mileage: 0,
      fuel_type: "",
      transmission: "",
      horsepower: 0,
      seats: 0,
      color: "",
      description: "",
      is_featured: true,
      other_benefits: "",
    },
  });

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}`);
        setCarData(response.data);
        form.reset(response.data);
      } catch (error) {
        console.error("Error fetching car data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات السيارة");
      }
    };

    fetchCarData();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    // Create a URLSearchParams object
    const formData = new URLSearchParams();

    // Append the form values to the URLSearchParams object
    formData.append("name", values.name);
    formData.append("brand", values.brand);
    formData.append("category_id", values.category_id);
    formData.append("country_of_manufacture", values.country_of_manufacture);
    formData.append("model", values.model);
    formData.append("year", values.year);
    formData.append("condition", values.condition);
    formData.append("mileage", values.mileage.toString()); // Convert to string
    formData.append("fuel_type", values.fuel_type);
    formData.append("transmission", values.transmission);
    formData.append("horsepower", values.horsepower.toString()); // Convert to string
    formData.append("seats", values.seats.toString()); // Convert to string
    formData.append("color", values.color);
    formData.append("description", values.description);
    formData.append("is_featured", values.is_featured ? "1" : "0"); // Convert boolean to string
    formData.append("other_benefits", values.other_benefits || ""); // Handle optional field

    // Send the request
    const response = await axios.put(`/api/cars/${id}`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    toast.success("تم تحديث السيارة بنجاح");
    console.log(response);
    navigate("/user-dashboard"); // Redirect to the cars list or another page
  } catch (error) {
    console.error("Error updating car:", error);
    toast.error("حدث خطأ أثناء تحديث السيارة");
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
  };

  if (!carData) {
    return <div>Loading...</div>; // You can add a loading spinner or message here
  }

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">تعديل السيارة</h1>
            <p className="text-muted-foreground">
              أدخل تفاصيل السيارة لتحديثها
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
                      <FormLabel>اسم السيارة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: تويوتا كورولا 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الماركة</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر ماركة السيارة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="toyota">تويوتا</SelectItem>
                          <SelectItem value="mercedes">مرسيدس</SelectItem>
                          <SelectItem value="bmw">بي إم دبليو</SelectItem>
                          <SelectItem value="audi">أودي</SelectItem>
                          <SelectItem value="honda">هوندا</SelectItem>
                          <SelectItem value="kia">كيا</SelectItem>
                          <SelectItem value="hyundai">هيونداي</SelectItem>
                          <SelectItem value="nissan">نيسان</SelectItem>
                          <SelectItem value="lexus">لكزس</SelectItem>
                          <SelectItem value="ford">فورد</SelectItem>
                          <SelectItem value="chevrolet">شيفروليه</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category ID */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>فئة السيارة (رقم)</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country of Manufacture */}
                <FormField
                  control={form.control}
                  name="country_of_manufacture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>بلد التصنيع</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: اليابان" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Model */}
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموديل</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: كورولا" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Year */}
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سنة الصنع</FormLabel>
                      <FormControl>
                        <Input type="string" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Condition */}
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>حالة السيارة</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عدد الكيلومترات</FormLabel>
                      <FormControl>
                        <Input type="string" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fuel Type */}
                <FormField
                  control={form.control}
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الوقود</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ناقل الحركة</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  control={form.control}
                  name="horsepower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>قوة المحرك</FormLabel>
                      <FormControl>
                        <Input type="string" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seats */}
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عدد المقاعد</FormLabel>
                      <FormControl>
                        <Input type="string" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اللون</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: أبيض" {...field} />
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
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصفاً تفصيلياً للسيارة" className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Other Benefits */}
                <FormField
                  control={form.control}
                  name="other_benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مزايا أخرى</FormLabel>
                      <FormControl>
                        <Textarea placeholder="مثال: صيانة مجانية لمدة سنة" className="min-h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Featured - checkbox */}
                {/* <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-x-reverse">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="checkbox"
                        />
                      </FormControl>
                      <FormLabel className="mb-0 cursor-pointer">مميز</FormLabel>
                    </FormItem>
                  )}
                /> */}

                {/* Image Upload */}
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
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-block rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      اختيار الصور
                    </label>
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

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" className="w-full max-w-md">
                    <Check className="mr-2 h-4 w-4" /> تحديث السيارة
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

export default EditCar;
