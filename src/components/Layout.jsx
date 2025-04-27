import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout berhasil');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/dashboard/skor-karyawan" className="hover:underline">Skor Karyawan</Link>
          <Link to="/dashboard/kesimpulan" className="hover:underline">Kesimpulan Global</Link>
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}
