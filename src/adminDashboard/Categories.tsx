import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig"; // تعديل مسار الاستيراد حسب الحاجة
import { FileSpreadsheetIcon } from "lucide-react";

interface Category {
  id: number;
  name: string;
  // إضافة خصائص أخرى حسب الحاجة
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories"); // تعديل نقطة النهاية حسب الحاجة
        setCategories(response.data.data);
        console.log(response.data.data);
        setLoading(true)
      } catch (err) {
        setError("حدث خطأ أثناء تحميل التصنيفات");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


      // Filter Stores based on search term
  const filteredCategories = categories.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
     <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold">إدارة التصنيفات</h2>
      <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">إضافة تصنيف</button>
     </div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="بحث عن تصنيف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>
      <table className="min-w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">اسم التصنيف</th>
            <th className="border border-gray-300 p-2">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.id}>
              <td className="border border-gray-300 p-2">{category.id}</td>
              <td className="border border-gray-300 p-2">{category.name}</td>
              <td className="border border-gray-300 p-2 flex gap-4">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded">تعديل</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
