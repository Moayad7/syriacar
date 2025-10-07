import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig"; // تعديل مسار الاستيراد حسب الحاجة

interface Workshop {
  id: number;
  name: string;
  location: string;
  commercial_registration_number: string;
}

const Workshops_Admin: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newWorkshop, setNewWorkshop] = useState<{ name: string; location: string }>({ name: "", location: "" });
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get("/api/workshops"); // تعديل نقطة النهاية حسب الحاجة
        setWorkshops(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الورشات");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const handleAddWorkshop = async () => {
    try {
      const response = await axios.post("/api/workshops", newWorkshop); // تعديل نقطة النهاية حسب الحاجة
      setWorkshops([...workshops, response.data]);
      setNewWorkshop({ name: "", location: "" }); // إعادة تعيين النموذج
    } catch (err) {
      setError("حدث خطأ أثناء إضافة الورشة");
    }
  };

  const handleUpdateWorkshop = async () => {
    if (!editingWorkshop) return;

    try {
      const response = await axios.put(`/api/workshops/${editingWorkshop.id}`, editingWorkshop); // تعديل نقطة النهاية حسب الحاجة
      setWorkshops(workshops.map(workshop => (workshop.id === editingWorkshop.id ? response.data : workshop)));
      setEditingWorkshop(null); // إنهاء وضع التحرير
    } catch (err) {
      setError("حدث خطأ أثناء تحديث الورشة");
      console.log(err);
    }
  };

  const handleDeleteWorkshop = async (id: number) => {
    try {
      await axios.delete(`/api/workshops/${id}`); // تعديل نقطة النهاية حسب الحاجة
      setWorkshops(workshops.filter(workshop => workshop.id !== id));
      setIsDeleteModalOpen(false); // إغلاق نافذة التأكيد
    } catch (err) {
      setError("حدث خطأ أثناء حذف الورشة");
      console.error(err);
    }
  };

  const openDeleteModal = (workshop: Workshop) => {
    setWorkshopToDelete(workshop);
    setIsDeleteModalOpen(true);
  };

  // Filter workshops based on search term
  const filteredWorkshops = workshops.filter(workshop =>
    workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.location.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2 className="text-xl font-bold">إدارة الورشات</h2>
        <button onClick={handleAddWorkshop} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">إضافة ورشة</button>
      </div>
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="اسم الورشة"
          value={newWorkshop.name}
          onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="الموقع"
          value={newWorkshop.location}
          onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
          className="border border-gray-300 p-2 rounded mr-2"
        />
      </div> */}
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="بحث عن ورشة"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>
      
      <table className="min-w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">اسم الورشة</th>
            <th className="border border-gray-300 p-2">الموقع</th>
            <th className="border border-gray-300 p-2">الرقم</th>
            <th className="border border-gray-300 p-2">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkshops.map((workshop) => (
            <tr key={workshop.id}>
              <td className="border border-gray-300 p-2">{workshop.id}</td>
              <td className="border border-gray-300 p-2">{workshop.name}</td>
              <td className="border border-gray-300 p-2">{workshop.location}</td>
              <td className="border border-gray-300 p-2">{workshop.commercial_registration_number}</td>
              <td className="border border-gray-300 p-2 flex gap-4">
                <button onClick={() => setEditingWorkshop(workshop)} className="px-2 py-1 bg-yellow-500 text-white rounded">تعديل</button>
                <button onClick={() => openDeleteModal(workshop)} className="px-2 py-1 bg-red-500 text-white rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing Workshop */}
      {editingWorkshop && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold">تعديل الورشة</h3>
            <input
              type="text"
              placeholder="اسم الورشة"
              value={editingWorkshop.name}
              onChange={(e) => setEditingWorkshop({ ...editingWorkshop, name: e.target.value })}
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="الموقع"
              value={editingWorkshop.location}
              onChange={(e) => setEditingWorkshop({ ...editingWorkshop, location: e.target.value })}
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="الرقم"
              value={editingWorkshop.commercial_registration_number}
              onChange={(e) => setEditingWorkshop({ ...editingWorkshop, commercial_registration_number: e.target.value })}
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <button onClick={handleUpdateWorkshop} className="px-4 py-2 bg-green-500 text-white rounded">تحديث</button>
            <button onClick={() => setEditingWorkshop(null)} className="px-4 py-2 bg-gray-300 text-black rounded">إلغاء</button>
          </div>
        </div>
      )}

      {/* Modal for Confirming Deletion */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف الورشة: {workshopToDelete?.name}؟</p>
            <button onClick={() => handleDeleteWorkshop(workshopToDelete!.id)} className="px-4 py-2 bg-red-500 text-white rounded">نعم، احذف</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshops_Admin;
