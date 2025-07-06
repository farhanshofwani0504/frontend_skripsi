import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logoImg from "../assets/logo1.png";

export default function ResetPassword() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password
    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          setTokenValid(false);
          throw new Error(data.error || "Token tidak valid atau sudah kadaluarsa");
        }
        throw new Error(data.error || "Gagal reset password");
      }

      toast.success("Password berhasil direset!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl text-center">
          <div className="mb-6 flex items-center justify-center">
            <img src={logoImg} alt="logo" className="h-8 w-auto" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Token Tidak Valid</h2>
          <p className="text-gray-600 mb-6">
            Token reset password tidak valid atau sudah kadaluarsa. Silakan minta link reset password baru.
          </p>
          
          <Link
            to="/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 overflow-x-hidden">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* ——— Panel kiri: gradient biru sederhana ——— */}
        <aside className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 lg:flex">
          <h1 className="text-5xl font-extrabold leading-tight text-white text-center">
            Reset <br /> Password
          </h1>
        </aside>

        {/* ——— Panel kanan: form ——— */}
        <section className="flex w-full flex-col justify-center p-10 lg:w-1/2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Reset Password</h2>

            {/* logo di kanan judul */}
            <img
              src={logoImg}
              alt="logo"
              className="h-8 w-auto"
            />
          </div>

          <p className="mb-8 text-sm text-gray-500">
            Masukkan password baru untuk akun Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Baru */}
            <div>
              <label className="text-sm">Password Baru</label>

              <div className="relative mt-2">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  minLength={6}
                  className="w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none
                 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />

                {/* eye icon btn */}
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center
             bg-transparent p-0 text-gray-400 hover:text-blue-600
             focus:outline-none"
                  tabIndex={-1}
                >
                  {showPwd ? (
                    /* eye-off */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-7
           a9.964 9.964 0 013.276-4.746M5.1 5.1 19 19M15.182 15.182
           A3 3 0 018.818 8.818"
                      />
                    </svg>
                  ) : (
                    /* eye */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7
           c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimal 6 karakter</p>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="text-sm">Konfirmasi Password</label>

              <div className="relative mt-2">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none
                 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />

                {/* eye icon btn */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center
             bg-transparent p-0 text-gray-400 hover:text-blue-600
             focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPwd ? (
                    /* eye-off */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-7
           a9.964 9.964 0 013.276-4.746M5.1 5.1 19 19M15.182 15.182
           A3 3 0 018.818 8.818"
                      />
                    </svg>
                  ) : (
                    /* eye */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7
           c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Ingat password?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
