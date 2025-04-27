import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/skor-karyawan" className="hover:underline">
          Skor Karyawan
        </Link>
        <Link to="/dashboard/kesimpulan" className="hover:underline">
          Kesimpulan Global
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
