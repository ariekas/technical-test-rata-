# Healthcare Scheduling System (Microservice Architecture)

Sistem Penjadwalan Medis berbasis *microservices* yang dikembangkan menggunakan **NestJS**, **GraphQL**, **PostgreSQL** dengan **Prisma ORM**, dan dikemas dengan **Docker & Docker Compose**. Sistem ini mengelola data Pengguna (*Auth*), Pelanggan (*Customer*), Dokter (*Doctor*), dan Jadwal Pertemuan (*Schedule*).

---

## 🏗️ Arsitektur Sistem

Sistem ini menerapkan pola arsitektur *microservices* terpisah dengan database *per service*, serta menggunakan *event-driven communication* untuk memproses notifikasi secara asinkron.

```mermaid
flowchart TD
    Client[GraphQL Client / Postman]
    AuthDB[(PostgreSQL: auth_db)]
    SchedDB[(PostgreSQL: schedule_db)]
    NotifDB[(PostgreSQL: notification_db)]
    Redis[(Redis: Cache & Queue)]
    
    subgraph Auth Service [Auth Service: Port 3001]
        AuthResolver[Auth Resolver]
        AuthServiceImp[Auth Service]
    end
    
    subgraph Schedule Service [Schedule Service: Port 3002]
        SchedResolver[Schedule Resolver]
        SchedServiceImp[Schedule Service]
        AuthGuard[Auth Guard]
    end

    subgraph Notification Service [Notification Service: Port 3003]
        NotifResolver[Notification Resolver]
        NotifProcessor[Bull Queue Processor]
        MailTransporter[Nodemailer SMTP]
    end

    Client -->|GraphQL Request| AuthResolver
    Client -->|GraphQL Request with JWT| SchedResolver
    Client -->|GraphQL Request History| NotifResolver
    
    AuthResolver --> AuthServiceImp
    AuthServiceImp --> AuthDB
    
    SchedResolver --> AuthGuard
    AuthGuard -->|validateToken Query| AuthResolver
    
    SchedResolver --> SchedServiceImp
    SchedServiceImp --> SchedDB
    SchedServiceImp -->|Read/Write Cache| Redis
    SchedServiceImp -->|Emit Event: schedule_created / schedule_deleted| NotifProcessor
    
    NotifProcessor -->|Queue Jobs| Redis
    NotifProcessor --> MailTransporter
    MailTransporter -->|Send Email| SMTP[External SMTP Server / Mailtrap]
    NotifProcessor --> NotifDB
```

### Penjelasan Arsitektur:
1.  **Auth Service**: Menangani manajemen *user*, registrasi, *hashing password* via bcrypt, pembuatan token JWT, dan verifikasi token.
2.  **Schedule Service**: Menangani CRUD Customer, Doctor, dan Schedule. Memvalidasi token JWT secara dinamis ke Auth Service melalui query `validateToken`.
3.  **Notification Service**: Memproses pengiriman notifikasi email secara asinkron menggunakan sistem antrean **Bull Queue** berbasis **Redis** saat jadwal dibuat/dihapus.
4.  **Redis**: Digunakan sebagai *cache memory* untuk mengoptimalkan pencarian data jadwal (*query optimization*) serta *driver backend* untuk sistem antrean (Bull Queue).

---

## 📋 Prasyarat

Sebelum menjalankan aplikasi, pastikan sistem Anda telah memiliki perangkat lunak berikut dengan versi minimal yang disarankan:

*   **Node.js**: `v18.x` atau lebih baru (direkomendasikan `v20.x` / `v22.x`)
*   **npm**: `v9.x` atau lebih baru
*   **Docker**: `v24.x` atau lebih baru (Engine atau Docker Desktop)
*   **Docker Compose**: `v2.x` atau lebih baru
*   **Postman**: (Opsional, diperlukan untuk pengujian API secara manual)

---

## ⚙️ Environment Variables

Salin berkas konfigurasi lingkungan (`.env`) ke masing-masing direktori *service* sebelum menjalankan sistem.

### 1. Auth Service (`auth-service/.env`)
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5431/auth_db?schema=public
JWT_SECRET=supersecretjwtkey123
JWT_EXPIRY=1h
REDIS_HOST=localhost
REDIS_PORT=6380
```

### 2. Schedule Service (`schedule-service/.env`)
```env
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/schedule_db?schema=public
REDIS_HOST=localhost
REDIS_PORT=6380
AUTH_SERVICE_URL=http://localhost:3001/graphql
```

### 3. Notification Service (`notification-service/.env`)
```env
PORT=3003
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/notification_db?schema=public
REDIS_HOST=localhost
REDIS_PORT=6380
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Klinik Rata <no-reply@klinikrata.com>"
```

---

## 🚀 Cara Menjalankan Project

### A. Menjalankan Menggunakan Docker Compose

1.  Pastikan Anda berada di direktori *root* proyek.
2.  Jalankan perintah berikut:
    ```bash
    docker compose up --build
    ```
3.  Sistem secara otomatis akan menjalankan:
    *   **Auth Service** di `http://localhost:3001/graphql`
    *   **Schedule Service** di `http://localhost:3002/graphql`
    *   **Notification Service** di `http://localhost:3003/graphql`
    *   Tiga instance PostgreSQL (Port: 5431, 5433, 5434) dan Redis (Port: 6380).

### B. Menjalankan di Lingkungan Lokal (Development)

1.  Pastikan database PostgreSQL dan Redis berjalan (bisa menggunakan Docker):
    ```bash
    docker compose up postgres-auth postgres-schedule postgres-notification redis -d
    ```
2.  Masuk ke masing-masing folder *service*, instal dependensi, jalankan migrasi Prisma database, lalu jalankan aplikasinya:
    ```bash
    # Di dalam folder auth-service, schedule-service, dan notification-service
    npm install
    npx prisma migrate dev
    npm run start:dev
    ```

---

## 🧪 Pengujian Unit (Unit Testing)

Untuk menjalankan pengujian unit di masing-masing folder *service*, gunakan perintah:
```bash
npm run test:cov
```

---

## 📑 Dokumentasi GraphQL API & Pengujian

Untuk mempermudah pengujian API, Anda dapat langsung mengimpor koleksi pengujian Postman yang lengkap menggunakan tautan API berikut (pada aplikasi Postman, pilih menu **Import** lalu tempel tautan ini):

👉 **[Tautan Impor Postman Collection](https://api.postman.com/collections/28747554-8990dd0f-eb57-404f-aa3d-1e9c537eb438?access_key=PMAT-01KXW17RCSMTDCD5CA4GQ77E48)**

### Alur Validasi Manual:
1.  Buka aplikasi **Postman**, gunakan opsi impor dan masukkan tautan di atas untuk memuat koleksi **Healthcare Scheduling**.
2.  Gunakan request registrasi (`register`) dan login (`login`) pada folder **Auth** untuk mendapatkan token JWT akses.
3.  Simpan token tersebut ke dalam environment variable Postman atau secara manual masukkan ke dalam header HTTP request lainnya:
    ```json
    {
      "Authorization": "Bearer <TOKEN_JWT>"
    }
    ```
4.  Lakukan pengujian mutasi pembuatan Customer, Doctor, dan Schedule. Sistem akan memverifikasi bentrok jadwal secara otomatis dan mengirimkan email notifikasi.
5.  Gunakan query `notifications` pada folder **Notification** untuk melihat riwayat pengiriman notifikasi email.

---

## 🧩 Contoh GraphQL Queries & Mutations

Berikut adalah kumpulan kueri (*queries*) dan mutasi (*mutations*) GraphQL:

### 1. Auth Service (`http://localhost:3001/graphql`)

#### Registrasi User Baru
```graphql
mutation Register($input: AuthInput!) {
  register(input: $input) {
    user {
      id
      email
      createdAt
    }
  }
}
# Variables:
# {
#   "input": {
#     "email": "user.baru@example.com",
#     "password": "password123"
#   }
# }
```

#### Login User
```graphql
mutation Login($input: AuthInput!) {
  login(input: $input) {
    token
  }
}
# Variables:
# {
#   "input": {
#     "email": "user.baru@example.com",
#     "password": "password123"
#   }
# }
```

#### Validasi Token JWT
```graphql
query ValidateToken($token: String!) {
  validateToken(token: $token) {
    isValid
    user {
      id
      email
    }
  }
}
# Variables:
# {
#   "token": "<TOKEN_JWT_HASIL_LOGIN>"
# }
```

---

### 2. Schedule Service (`http://localhost:3002/graphql`)
*Catatan: Pastikan Anda menambahkan header `Authorization: Bearer <TOKEN_JWT>` pada HTTP Headers Playground.*

#### Membuat Data Customer
```graphql
mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    id
    name
    email
  }
}
# Variables:
# {
#   "input": {
#     "name": "Budi Santoso",
#     "email": "budi.santoso@example.com"
#   }
# }
```

#### Membuat Data Dokter
```graphql
mutation CreateDoctor($input: CreateDoctorInput!) {
  createDoctor(input: $input) {
    id
    name
  }
}
# Variables:
# {
#   "input": {
#     "name": "Dr. Jane Doe"
#   }
# }
```

#### Membuat Jadwal Konsultasi (Schedule)
```graphql
mutation CreateSchedule($input: CreateScheduleInput!) {
  createSchedule(input: $input) {
    id
    objective
    scheduledAt
    customer {
      id
      name
    }
    doctor {
      id
      name
    }
  }
}
# Variables:
# {
#   "input": {
#     "objective": "Pemeriksaan Gigi Rutin",
#     "customerId": "<CUSTOMER_UUID>",
#     "doctorId": "<DOCTOR_UUID>",
#     "scheduledAt": "2026-08-05T10:00:00Z"
#   }
# }
```

#### Mendapatkan Daftar Jadwal dengan Filter & Caching
```graphql
query GetSchedules($pagination: PaginationInput, $filter: ScheduleFilterInput) {
  schedules(pagination: $pagination, filter: $filter) {
    total
    items {
      id
      objective
      scheduledAt
      customer {
        name
      }
      doctor {
        name
      }
    }
  }
}
# Variables:
# {
#  "pagination": {
#    "page": 1,
#    "limit": 10
#  },
#  "filter": {
#    "date": "2026-08-05T00:00:00Z",
#    "customerId": "<CUSTOMER_UUID>",
#    "doctorId": "<DOCTOR_UUID>"
#  }
# }
```

---

### 3. Notification Service (`http://localhost:3003/graphql`)

#### Mendapatkan Riwayat Notifikasi Email
```graphql
query GetNotifications {
  notifications {
    id
    objective
    status
    type
    createdAt
  }
}
```
