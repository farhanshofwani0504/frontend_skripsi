import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logoImg from "../assets/logo1.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal login");

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      toast.success("Login berhasil!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 overflow-x-hidden">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* ——— Panel kiri: gradient biru sederhana ——— */}
        <aside className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 lg:flex">
          <h1 className="text-5xl font-extrabold leading-tight text-white text-center">
            Welcome <br /> Back!
          </h1>
        </aside>

        {/* ——— Panel kanan: form ——— */}
        <section className="flex w-full flex-col justify-center p-10 lg:w-1/2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Login</h2>

            {/* logo di kanan judul */}
            <img
              src={logoImg}
              alt="logo"
              className="h-8 w-auto" /* ubah h-8 ⇒ h-10 jika ingin lebih besar */
            />
          </div>

          <p className="mb-8 text-sm text-gray-500">
            Welcome back! Please login to your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@mail.com"
                required
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
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
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </section>
      </div>
      <div className="center">
        <div className="panel">{/* ... seluruh form tetap ... */}</div>
      </div>
    </div>
  );
}
