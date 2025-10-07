import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig"; // تعديل مسار الاستيراد حسب الحاجة
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: number;
  name: string;
  location: string;
}

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/stores"); // تعديل نقطة النهاية حسب الحاجة
        setStores(response.data.data);
        console.log(response.data.data)
      } catch (err) {
        setError("حدث خطأ أثناء تحميل المتاجر");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Filter Stores based on search term
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStore = async (id: number) => {
    try {
      await axios.delete(`/api/stores/${id}`); // تعديل نقطة النهاية حسب الحاجة
      setStores(stores.filter((store) => store.id !== id));
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (err) {
      setError("حدث خطأ أثناء حذف المتجر");
      console.error(err);
    }
  };

  const handleUpdateStore = async () => {
    if (!editingStore) return;
    console.log(editingStore)
    try {
      const response = await axios.post(
        `/api/stores/${editingStore.id}?_method=PUT`,
        editingStore
      ); // تعديل نقطة النهاية حسب الحاجة
      setStores(
        stores.map((store) =>
          store.id === editingStore.id ? response.data : store
        )
      );
      setEditingStore(null); // Close the edit modal
    } catch (err) {
      setError("حدث خطأ أثناء تحديث المتجر");
      console.error(err);
      toast({
        title: "خطأ",
        description: error,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">إدارة المتاجر</h2>
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          إضافة متجر
        </button>
      </div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="بحث عن متجر"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <table className="min-w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">اسم المتجر</th>
            <th className="border border-gray-300 p-2">الموقع</th>
            <th className="border border-gray-300 p-2">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store) => (
            <tr key={store.id}>
              <td className="border border-gray-300 p-2">{store.id}</td>
              <td className="border border-gray-300 p-2">{store.name}</td>
              <td className="border border-gray-300 p-2">{store.location}</td>
              <td className="border border-gray-300 p-2 flex gap-4">
                <button
                  onClick={() => setEditingStore(store)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  تعديل
                </button>
                <button
                  onClick={() => {
                    setStoreToDelete(store);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing Store */}
      {editingStore && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold">تعديل المتجر</h3>
            <input
              type="text"
              placeholder="اسم المتجر"
              value={editingStore.name}
              onChange={(e) =>
                setEditingStore({ ...editingStore, name: e.target.value })
              }
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="الموقع"
              value={editingStore.location}
              onChange={(e) =>
                setEditingStore({ ...editingStore, location: e.target.value })
              }
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <button
              onClick={handleUpdateStore}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              تحديث
            </button>
            <button
              onClick={() => setEditingStore(null)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Modal for Confirming Deletion */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف المتجر: {storeToDelete?.name}؟</p>
            <button
              onClick={() => handleDeleteStore(storeToDelete!.id)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              نعم، احذف
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
