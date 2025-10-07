import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig"; // تعديل مسار الاستيراد حسب الحاجة

interface User {
  id: number;
  name: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser , setEditingUser ] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // تعديل نقطة النهاية حسب الحاجة
        setUsers(response.data.data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل المستخدمين");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser  = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`); // تعديل نقطة النهاية حسب الحاجة
      setUsers(users.filter(user => user.id !== id));
      setIsDeleteModalOpen(false); // إغلاق نافذة التأكيد
    } catch (err) {
      setError("حدث خطأ أثناء حذف المستخدم");
      console.error(err);
    }
  };

  const handleUpdateUser  = async () => {
    if (!editingUser ) return;

    try {
      const response = await axios.put(`/api/users/${editingUser .id}`, editingUser ); // تعديل نقطة النهاية حسب الحاجة
      setUsers(users.map(user => (user.id === editingUser .id ? response.data : user)));
      setEditingUser (null); // إنهاء وضع التحرير
    } catch (err) {
      setError("حدث خطأ أثناء تحديث المستخدم");
      console.log(err);
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
      <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
      <table className="min-w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">الاسم</th>
            <th className="border border-gray-300 p-2">البريد الإلكتروني</th>
            <th className="border border-gray-300 p-2">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2">{user.id}</td>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2 flex gap-4">
                <button onClick={() => setEditingUser (user)} className="px-2 py-1 bg-yellow-500 text-white rounded">تعديل</button>
                <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="px-2 py-1 bg-red-500 text-white rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing User */}
      {editingUser  && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold">تعديل المستخدم</h3>
            <input
              type="text"
              placeholder="الاسم"
              value={editingUser .name}
              onChange={(e) => setEditingUser ({ ...editingUser , name: e.target.value })}
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={editingUser .email}
              onChange={(e) => setEditingUser ({ ...editingUser , email: e.target.value })}
              className="border border-gray-300 p-2 rounded mr-2"
            />
            <button onClick={handleUpdateUser } className="px-4 py-2 bg-green-500 text-white rounded">تحديث</button>
            <button onClick={() => setEditingUser (null)} className="px-4 py-2 bg-gray-300 text-black rounded">إلغاء</button>
          </div>
        </div>
      )}

      {/* Modal for Confirming Deletion */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف المستخدم: {userToDelete?.name}؟</p>
            <button onClick={() => handleDeleteUser (userToDelete!.id)} className="px-4 py-2 bg-red-500 text-white rounded">نعم، احذف</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
