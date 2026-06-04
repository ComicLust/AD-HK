# Adil Hukuk & Danışmanlık A.Ş. — Premium Web Yönetim Sistemi

Bu depo, **Adil Hukuk Bürosu** için özel olarak geliştirilmiş; modern, performanslı ve Apple HIG tasarım standartlarına uygun kurumsal web sitesi ve içerik yönetim panelinin (CMS) kaynak kodlarını barındırmaktadır.

---

## 🚀 Teknolojik Altyapı (Tech Stack)

Uygulama, modern web standartlarına ve SEO uyumluluğuna odaklanarak aşağıdaki teknolojilerle inşa edilmiştir:

*   **Framework:** Next.js 16 (App Router, Turbopack, Standalone Build)
*   **Arayüz & Stil:** React 19, TailwindCSS 4, Framer Motion (Akıcı ve "yerçekimsiz" mikro-animasyonlar)
*   **İkon Kütüphanesi:** Lucide React
*   **Zengin Metin Editörü:** Custom Tiptap Editor (Tablo desteği, YouTube embed ve gelişmiş metin hizalama eklentileriyle)
*   **Veritabanı ORM:** Prisma ORM
*   **Veritabanı:** SQLite (Geliştirme ve hızlı demolar için) / PostgreSQL uyumlu mimari
*   **Grafikler:** Recharts (Dashboard analitik verileri için alan grafikleri)
*   **Kimlik Doğrulama:** JWT tabanlı güvenli admin oturum yönetimi

---

## 💾 Veritabanı Mimarisi & Prisma Modelleri

Sistem, ilişkisel ve optimize edilmiş bir veritabanı şemasına sahiptir. Öne çıkan bazı tablolar ve görevleri:

1.  **`FirmInfo`:** Kurum adı, adresi, telefonları, WhatsApp ve sosyal medya bağlantılarını saklar.
2.  **`Service`:** Sunulan hukuki hizmet alanlarını (İş Hukuku, Ceza Hukuku vb.), bunlara özel güven noktalarını ve detaylı açıklamaları tutar.
3.  **`TeamMember`:** Avukat kadrosunu, kategorilerini (Avukat, Stajyer vb.), sosyal ağlarını ve uzmanlık alanlarını saklar.
4.  **`BlogPost`:** Hukuk blog yazılarını, etiketleri ve yayınlanma durumunu yönetir.
5.  **`SeoMeta`:** Sitedeki tüm dinamik ve statik sayfaların meta başlıklarını, açıklamalarını, canonical URL ve sosyal paylaşım (Open Graph) görsellerini eşleştirir.
6.  **`Translation`:** Sitedeki statik kelime ve butonların TR/EN çevirilerini dinamik olarak veritabanından yönetir.
7.  **`IntegrationSettings`:** Google Analytics (GA4) ve Google Search Console (GSC) doğrulama kodlarını sunucu tarafında HTML head alanına enjekte etmek için saklar.

---

## 💻 Yerel Kurulum (Local Geliştirme)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Gereksinimler
*   Node.js (v18 veya üzeri tavsiye edilir)
*   npm veya bun

### 2. Bağımlılıkları Yükleme
```bash
npm install
```

### 3. Ortam Değişkenleri (`.env`)
Proje kök dizininde `.env` adında bir dosya oluşturup yerel ayarlarınızı girin:
```env
DATABASE_URL="file:../db/custom.db"
JWT_SECRET="kendi-guvenli-jwt-anahtariniz"
```

### 4. Veritabanını Yapılandırma
Prisma şemasını veritabanına uygulayın ve istemciyi derleyin:
```bash
# Prisma istemcisini oluşturun
npx prisma generate

# Veritabanını oluşturup tabloları eşitleyin
npx prisma db push
```

### 5. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama varsayılan olarak **`http://localhost:3000`** adresinde çalışmaya başlayacaktır.

---

## ☁️ Sunucuya Dağıtım (Production Deployment)

### 📌 Seçenek A: Render.com Kurulumu (Ücretsiz Hızlı Demo)

SQLite ve Next.js'in sunucusuz mimarideki kısıtlamalarını aşmak için Render üzerinde şu ayarların yapılması şarttır:

1.  **Web Service** oluşturup GitHub deponuzu bağlayın.
2.  **Build Command (Derleme Komutu):**
    ```bash
    npm install && npx prisma generate && npx prisma db push && npm run build
    ```
3.  **Start Command (Başlangıç Komutu):**
    ```bash
    npx prisma db push && npm run start
    ```
    *(Not: `npx prisma db push` komutunun başlangıçta çalıştırılması, Render'ın her uykudan uyanışında sıfırlanan SQLite veritabanı dosyasının sunucu üzerinde tablolarıyla birlikte otomatik olarak tekrar oluşturulmasını sağlar.)*
4.  **Environment Variables (Ortam Değişkenleri):**
    *   `DATABASE_URL`: `file:/opt/render/project/src/custom.db` *(Next.js standalone klasöründen erişim sağlamak için mutlak yol verilmelidir.)*
    *   `JWT_SECRET`: `kendi-guvenli-anahtariniz`
    *   `HOSTNAME`: `0.0.0.0` *(Render proxy yönlendiricisinin sunucuya bağlanabilmesi ve 502 Bad Gateway hatası vermemesi için şarttır.)*

---

### 📌 Seçenek B: VPS & FastPanel Kurulumu (Kalıcı Sunucu)

FastPanel ile yönettiğiniz kendi sunucunuzda projeyi PM2 ile çalıştırmak için:

1.  **FastPanel Sitesi Oluşturun:** Klasik bir PHP veya static site ekleyin.
2.  **Nginx Konfigürasyonu:** Sitenin Nginx ayarlarındaki `location /` bloğunu yerel portunuza proxy yapacak şekilde güncelleyin:
    ```nginx
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```
3.  **Projeyi Derleyin:** SSH üzerinden sitenin dizinine gidip derleyin:
    ```bash
    npm install
    npx prisma generate
    npx prisma db push
    npm run build
    ```
4.  **PM2 ile Başlatın:** Uygulamayı arka planda kalıcı çalıştırmak için:
    ```bash
    npm install -g pm2
    pm2 start npm --name "adilhukuk" -- start -- -p 3000
    pm2 save
    pm2 startup
    ```
