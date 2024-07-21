# Skill Fit Test PT Beon Intermedia

Sistem Manajemen Administrasi Perumahan dirancang untuk mempermudah pengelolaan pembayaran dan pengeluaran di suatu area perumahan. Aplikasi ini akan membantu seorang RT dalam mengelola penghuni, rumah, dan pembayaran bulanan, serta melacak pengeluaran. Sistem ini mendukung penanganan penghuni tetap dan sementara, memastikan penagihan dan pelaporan yang akurat.

## Features

- Mengelola Penghuni
  Menambahkan dan memperbarui data penghuni rumah, termasuk nama lengkap, foto KTP, status penghuni, nomor telepon, dan status pernikahan.
- Mengelola Rumah
  Menambah dan memperbarui informasi rumah serta mengelola status penghuni. Termasuk catatan historis penghuni dan riwayat pembayaran.
- Pengelolaan Pembayaran
  Mencatat dan melacak pembayaran bulanan untuk iuran kebersihan dan satpam. Mendukung pembayaran bulanan dan tahunan dengan laporan ringkasan dan detail.
- Laporan dan Analisis
  Menyediakan laporan pemasukan dan pengeluaran bulanan dalam bentuk grafik dan laporan detail untuk mempermudah analisis keuangan.

## Tech Stack

- NodeJS
- ExpressJS
- MySQL
- DBeaver (opsional)
- PostmanAPI (disarankan)

## Installation

1. Clone projek

```bash
  git clone https://github.com/talithariin/BackEnd_Skill-Fit-Test_Beon-Intermedia.git
```

2. Impor Database
   Impor file database.sql yang ada pada file database ke DBeaver atau server MySQL Anda untuk menyiapkan skema database yang diperlukan.

3. Impor Dokumentasi
   Impor file documentation.json yang ada pada file documentation ke PostmanAPI untuk melihat seluruh dokumentasi.

4. Install package projek

```bash
  npm install
```

5. Buat .env

```
DB_HOST="localhost"
DB_USER="root" // Sesuaikan dengan username MySQL Anda
DB_PASSWORD="root" // Sesuaikan dengan password MySQL Anda
DB_NAME="Beon Intermedia"
DB_PORT=3306 // Sesuaikan dengan port MySQL Anda
```

6. Jalankan program

```
npm run dev
```

Jika berjalan dengan benar, maka akan tercetak:

```
Connected to MySQL successfully
Server running on http://localhost:3001
```
