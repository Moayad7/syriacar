import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig"; // تعديل مسار الاستيراد حسب الحاجة
import { useToast } from '@/components/ui/use-toast';

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
}

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCars, setTotalCars] = useState<number>(0);
  const carsPerPage = 10; // عدد السيارات في كل صفحة
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`/api/cars?page=${currentPage}&per_page=${carsPerPage}`); // تعديل نقطة النهاية حسب الحاجة
        setCars(response.data.data);
        setTotalCars(response.data.pagination.total); // افترض أن API يعيد العدد الإجمالي للسيارات
        console.log(response.data.data)
      } catch (err) {
        setError("حدث خطأ أثناء تحميل السيارات");
        console.error(err)
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
    fetchAllCars();
  }, [currentPage]); // إعادة التحميل عند تغيير الصفحة الحالية

  const fetchAllCars = async () => {
      try {
        const response = await axios.get(`/api/cars?page=${totalCars}`); // تعديل نقطة النهاية حسب الحاجة
        setAllCars(response.data.data);
        setTotalCars(response.data.pagination.total); // افترض أن API يعيد العدد الإجمالي للسيارات
        console.log(response.data.data)
      } catch (err) {
        setError("حدث خطأ أثناء تحميل السيارات");
        console.error(err)
      } finally {
        setLoading(false);
      }
    };

  

    const handleDelete = async (carId:number) => {
      try {
        await axios.delete(`/api/cars/${carId}`);
        toast({
          title: 'تم الحذف',
          description: 'تم حذف السيارة بنجاح.',
        });
        // Refetch current page cars after deletion
        // If cars on this page become zero, go to previous page if possible
        if (cars.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          // simply fetch current page again
          setLoading(true);
          const response = await axios.get(`/api/cars?page=${currentPage}&per_page=${carsPerPage}`);
          const responseData = response.data;
          setCars(responseData.data || []);
          setTotalCars(responseData.total || 0);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء حذف السيارة.',
        });
      }
    };

        // Filter Stores based on search term
  const filteredCars = allCars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // حساب عدد الصفحات
  const totalPages = Math.ceil(totalCars / carsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold">إدارة السيارات</h2>
       {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="بحث عن سيارة"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>
      <table className="min-w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">اسم السيارة</th>
            <th className="border border-gray-300 p-2">الماركة</th>
            <th className="border border-gray-300 p-2">الموديل</th>
            <th className="border border-gray-300 p-2">سنة الصنع</th>
            <th className="border border-gray-300 p-2">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars
          
          .map((car) => (
            <tr key={car.id}>
              <td className="border border-gray-300 p-2">{car.id}</td>
              <td className="border border-gray-300 p-2">{car.name}</td>
              <td className="border border-gray-300 p-2">{car.brand}</td>
              <td className="border border-gray-300 p-2">{car.model}</td>
              <td className="border border-gray-300 p-2">{car.year}</td>
              <td className="border border-gray-300 p-2">
                <button onClick={()=>handleDelete(car.id)} className="px-2 py-1 bg-red-500 text-white rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          السابق
        </button>
        <span>
          الصفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default Cars;


// import React, { useEffect, useState } from "react";
// import axios from "../config/axiosConfig"; // تعديل مسار الاستيراد حسب الحاجة
// import { useToast } from '@/components/ui/use-toast';

// interface Car {
//   id: number;
//   name: string;
//   brand: string;
//   model: string;
//   year: number;
// }

// const Cars: React.FC = () => {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const carsPerPage = 10; // عدد السيارات في كل صفحة
//   const { toast } = useToast();
//   const user_id = localStorage.getItem('user_id');
//   console.log(user_id);

//   useEffect(() => {
//     const fetchAllCars = async () => {
//       try {
//         let allCars: Car[] = [];
//         let currentPage = 1;
//         let totalPages = 1; // بداية التكرار
//         do {
//           const response = await axios.get(`/api/cars?page=${currentPage}&per_page=${carsPerPage}`);
//           const data = response.data;
//           // Assuming data.data is array of cars and data.pagination contains pages info
//           const userCars = data.data.filter((car: any) => car.owner.id == user_id);
//           allCars = allCars.concat(userCars);
//           if (data.pagination && data.pagination.total_pages) {
//             totalPages = data.pagination.total_pages;
//           } else {
//             // fallback if total_pages not provided
//             totalPages = currentPage; // to break loop if not provided
//           }
//           currentPage++;
//         } while (currentPage <= totalPages);
//         setCars(allCars);
//       } catch (err) {
//         setError("حدث خطأ أثناء تحميل السيارات");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllCars();
//   }, []);

//   const handleDelete = async (carId: number) => {
//     try {
//       await axios.delete(`/api/cars/${carId}`);
//       toast({
//         title: 'تم الحذف',
//         description: 'تم حذف السيارة بنجاح.',
//       });
//       // تحديث قائمة السيارات بعد الحذف من المصفوفة المحلية
//       setCars((prevCars) => prevCars.filter(car => car.id !== carId));
//     } catch (error) {
//       console.error('Error deleting car:', error);
//       toast({
//         title: 'خطأ',
//         description: 'حدث خطأ أثناء حذف السيارة.',
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h2 className="text-xl font-bold">إدارة السيارات</h2>
//       <table className="min-w-full mt-4 border border-gray-300" role="table" aria-label="قائمة السيارات">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-300 p-2">ID</th>
//             <th className="border border-gray-300 p-2">اسم السيارة</th>
//             <th className="border border-gray-300 p-2">الماركة</th>
//             <th className="border border-gray-300 p-2">الموديل</th>
//             <th className="border border-gray-300 p-2">سنة الصنع</th>
//             <th className="border border-gray-300 p-2">التحكم</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cars.map((car) => (
//             <tr key={car.id}>
//               <td className="border border-gray-300 p-2">{car.id}</td>
//               <td className="border border-gray-300 p-2">{car.name}</td>
//               <td className="border border-gray-300 p-2">{car.brand}</td>
//               <td className="border border-gray-300 p-2">{car.model}</td>
//               <td className="border border-gray-300 p-2">{car.year}</td>
//               <td className="border border-gray-300 p-2">
//                 <button
//                   onClick={() => handleDelete(car.id)}
//                   className="px-2 py-1 bg-red-500 text-white rounded"
//                   aria-label={`حذف السيارة ${car.name}`}
//                 >
//                   حذف
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Cars;

