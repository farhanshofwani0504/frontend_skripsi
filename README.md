# HRD System Frontend

Aplikasi HRD System berbasis React untuk manajemen karyawan, user, dan proposal kontrak dengan role-based access (ADMIN/OWNER).

## Fitur Utama
- **Login & Role-based Access**: Hanya user dengan role ADMIN/OWNER yang dapat login dan mengakses fitur sesuai haknya.
- **Manajemen User** (khusus ADMIN):
  - Lihat, tambah, edit, hapus user (role: ADMIN/OWNER)
- **Manajemen Karyawan**:
  - Lihat daftar karyawan
  - Tambah, edit, hapus karyawan (khusus ADMIN)
  - Penilaian karyawan (khusus ADMIN)
- **Proposal Kontrak**:
  - ADMIN: Buat proposal perpanjangan/pemutusan kontrak
  - ADMIN/OWNER: Lihat dan filter daftar proposal, detail proposal
  - OWNER: Approve/Reject proposal dengan catatan
- **Import Data**: Upload CSV karyawan/nilai (khusus ADMIN)
- **Notifikasi Reset Password**: User request reset, admin proses manual

## Struktur Folder
- `src/pages/` — Halaman utama (Dashboard, UserManagement, SkorKaryawan, ProposalList, ProposalDetail, dsb)
- `src/components/` — Komponen UI (Sidebar, Navbar, Modal, dsb)
- `src/assets/` — Gambar/logo
- `public/` — File statis

## Instalasi & Setup
1. **Clone repo**
   ```bash
   git clone <repo-url>
   cd frontend_skripsi
   ```
2. **Install dependencies**
   ```bash
   yarn install
   # atau
   npm install
   ```
3. **Jalankan development server**
   ```bash
   yarn dev
   # atau
   npm run dev
   ```
4. **Environment**
   - Pastikan backend berjalan di `http://localhost:3000`
   - Ubah endpoint di frontend jika backend berbeda

## Penggunaan
- Login menggunakan akun ADMIN/OWNER
- Navigasi melalui sidebar
- Fitur hanya muncul sesuai role:
  - ADMIN: Semua fitur user, karyawan, proposal, import
  - OWNER: Lihat data, approve/reject proposal

## Catatan
- Semua endpoint API sudah menggunakan auth dan roleMiddleware
- Untuk reset password, user request dan admin proses manual

---

**By Tim Skripsi HRD System**
