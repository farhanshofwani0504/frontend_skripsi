import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logoImg from "../assets/logo1.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim email reset password");
      setSuccess(true);
      toast.success("Link reset password telah dikirim ke email jika terdaftar.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 overflow-x-hidden">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Panel kiri: gradient biru */}
        <aside className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 lg:flex">
          <h1 className="text-5xl font-extrabold leading-tight text-white text-center">
            Forgot <br /> Password
          </h1>
        </aside>
        {/* Panel kanan: form */}
        <section className="flex w-full flex-col justify-center p-10 lg:w-1/2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Lupa Password</h2>
            <img src={logoImg} alt="logo" className="h-8 w-auto" />
          </div>
          <p className="mb-8 text-sm text-gray-500">
            Masukkan email yang terdaftar. Kami akan mengirimkan link reset password ke email Anda jika ditemukan.
          </p>
          {success ? (
            <div className="mb-6 text-green-600 text-center">
              Link reset password telah dikirim ke email (jika terdaftar).
            </div>
          ) : null}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@mail.com"
                required
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Kirim Link Reset"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            Ingat password?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
} 