export const firmInfo = {
  name: "Adil Hukuk Danışmanlık",
  address:
    "Florya Semti, Şenlik Köy Mah, Saçı Sokak, Florya Cd. No: 4/F, 34513 Bakırköy/İstanbul",
  gsm: "+90 531 776 02 83",
  phone: "+90 212 574 21 01",
  fax: "0 212 574 21 34",
  email: "info@adilhukukdanismanlik.com",
  whatsapp: "https://wa.me/905317760283",
  social: {
    instagram: "https://www.instagram.com/adilhukukdanismanlikhizmetleri/",
    twitter: "https://x.com/adilhukuknet",
    youtube: "https://www.youtube.com/@adilhukuk",
    facebook: "https://www.facebook.com/profile.php?id=61580900027911",
    linkedin: "https://www.linkedin.com",
  },
};

export const navLinks = [
  { label: "Ana Sayfa", href: "/", icon: "Home" },
  { label: "Hakkımızda", href: "/hakkimizda", icon: "Info" },
  { label: "Hizmetlerimiz", href: "/hizmetlerimiz", icon: "Briefcase" },
  { label: "Ekibimiz", href: "/ekibimiz", icon: "Users" },
  {
    label: "Medya",
    href: "/medya",
    icon: "Newspaper",
    dropdown: [
      { label: "Basında Biz", href: "/medya", tab: "basinda", icon: "Megaphone" },
      { label: "Makaleler", href: "/medya", tab: "makaleler", icon: "BookOpen" },
      { label: "Videolar", href: "/medya", tab: "videolar", icon: "Video" },
    ],
  },
  { label: "Örnek Dilekçeler", href: "/ornek-dilekceler", icon: "FileText" },
  { label: "İletişim", href: "/iletisim", icon: "Phone" },
];

export const services = [
  {
    slug: "ticaret-hukuku",
    name: "Ticaret Hukuku",
    icon: "Briefcase",
    description:
      "Ticaretin hukuki güvence altında yürütülmesi, sürdürülebilir bir iş modeli ve kurumsal itibara giden yolun temelidir.",
    fullDescription: `Ticaret hukuku, ticari ilişkilerin düzenlenmesi ve ticari uyuşmazlıkların çözümü konusunda uzmanlaşmış bir hukuk dalıdır. Şirketlerin kuruluşundan itibaren tüm hukuki süreçlerinde yanlarında olarak, ticari hayatın güvenilir ve sürdürülebilir bir şekilde yürütülmesini sağlıyoruz.

Hizmetlerimiz arasında şirket kuruluşu ve organizasyonu, ticari sözleşmeler, şirketler hukuku, rekabet hukuku, fikri mülkiyet hakları ve ticari uyuşmazlıkların çözümü yer almaktadır. Müvekkillerimizin ticari faaliyetlerini hukuki güvence altına alarak, sürdürülebilir bir iş modeli oluşturmalarına destek oluyoruz.`,
  },
  {
    slug: "aile-hukuku",
    name: "Aile Hukuku",
    icon: "Heart",
    description:
      "Aile içi ilişkiler, hukuk düzeninin en hassas ve en çok yönlü müdahale alanlarından biridir.",
    fullDescription: `Aile hukuku, aile ilişkilerinden doğan hak ve yükümlülükleri düzenleyen, bireylerin en özel ve hassas alanlarından birini hukuki çerçevede ele alan bir disiplindir. Boşanma, velayet, nafaka, mal paylaşımı, evlilik sözleşmeleri ve aile içi şiddet gibi konularda müvekkillerimize hukuki destek sunuyoruz.

Aile hukuku uyuşmazlıklarının duygusal ve hassas yapısı göz önünde bulundurularak, müvekkillerimize çözüm odaklı ve şefkatli bir yaklaşım benimsiyoruz. Sürecin her aşamasında haklarınızın korunmasını sağlıyor ve en adil sonuçlara ulaşmanız için çalışıyoruz.`,
  },
  {
    slug: "miras-hukuku",
    name: "Miras Hukuku",
    icon: "Home",
    description:
      "Miras hukukunda yaşanan uyuşmazlıklar, aile bireyleri arasında telafisi güç kırılmalara neden olabilmektedir.",
    fullDescription: `Miras hukuku, kişinin vefatı sonrası malvarlığının hak sahiplerine intikalini düzenleyen bir hukuk dalıdır. Miras uyuşmazlıkları, özellikle aile bireyleri arasında telafisi güç kırılmalara yol açabileceğinden, bu alanda uzman hukuki destek almak büyük önem taşır.

Vasiyetname düzenlenmesi, miras paylaşımı, tenkis davaları, muris muvazaası ve yabancı ülke vatandaşlarının miras hakları gibi konularda müvekkillerimize kapsamlı hukuki danışmanlık ve dava takip hizmeti sunuyoruz.`,
  },
  {
    slug: "icra-ve-iflas-hukuku",
    name: "İcra ve İflas Hukuku",
    icon: "Gavel",
    description:
      "Alacakların hızlı ve etkin bir şekilde tahsil edilmesi, ticari hayatta sürdürülebilirlik açısından büyük önem taşımaktadır.",
    fullDescription: `İcra ve iflas hukuku, alacaklıların haklarını koruyarak alacaklarını tahsil etmelerini ve borçluların da hukuki sınırlar içinde korunmasını sağlayan bir hukuk dalıdır. Alacakların hızlı ve etkin bir şekilde tahsil edilmesi, ticari hayatta sürdürülebilirlik açısından büyük önem taşımaktadır.

İcra takibi, iflas davaları, konkordato, sermaye şirketlerinin yeniden yapılandırılması ve aciz vesikası gibi konularda müvekkillerimize hukuki destek sağlıyoruz.`,
  },
  {
    slug: "ceza-ve-infaz-hukuku",
    name: "Ceza ve İnfaz Hukuku",
    icon: "Shield",
    description:
      "Ceza yargılaması, bireyin en temel hak ve özgürlüklerini doğrudan etkileyen bir alan olması nedeniyle titizlik ve yüksek sorumluluk taşır.",
    fullDescription: `Ceza ve infaz hukuku, bireyin en temel hak ve özgürlüklerini doğrudan etkileyen bir hukuk alanıdır. Suçun işlenmesi, soruşturma, kovuşturma ve infaz süreçlerinin her aşamasında hakların korunması büyük önem taşımaktadır.

Ceza davaları, savunma hakkı, tutuklama ve adli kontrol kararlarına itiraz, infaz hukuku ve şartlı tahliye gibi konularda müvekkillerimize etkin hukuki temsil ve danışmanlık hizmeti sunuyoruz.`,
  },
  {
    slug: "idare-hukuku",
    name: "İdare Hukuku",
    icon: "Landmark",
    description:
      "Kamu ile bireyler veya özel sektör arasındaki ilişkilerin hukuka uygun yürütülmesi, idari işlemlere karşı etkili başvuruyla mümkündür.",
    fullDescription: `İdare hukuku, kamu idaresinin yetki, şekil ve usul kurallarına uygun olarak yürüttüğü faaliyetleri ve bireyler ile kamu arasında doğan hukuki ilişkileri düzenleyen bir disiplindir.

İdari dava ve işlemler, kamulaştırma, imar hukuku, ihale hukuku, vergi hukuku ve idari sözleşmeler gibi konularda müvekkillerimize hukuki destek sunuyoruz. Kamu idaresinin işlemlerine karşı etkili başvuru yollarını kullanarak haklarınızı koruyoruz.`,
  },
  {
    slug: "is-ve-sosyal-guvenlik-hukuku",
    name: "İş ve Sosyal Güvenlik Hukuku",
    icon: "Users",
    description:
      "İş hukuku, işçi ve işveren için bağlayıcı nitelik taşır ve ilişkileri düzenler.",
    fullDescription: `İş ve sosyal güvenlik hukuku, işçi ve işveren arasındaki ilişkileri düzenleyen ve her iki tarafın haklarını koruyan bir hukuk dalıdır. İş sözleşmeleri, işçilik alacakları, kıdem tazminatı, ihbar tazminatı, iş kazaları ve meslek hastalıkları gibi konularda müvekkillerimize hukuki destek sunuyoruz.

Ayrıca sosyal güvenlik hukuku kapsamında SGK prim borçları, emeklilik işlemleri ve bağı-kur hukuku gibi konularda da danışmanlık hizmeti veriyoruz.`,
  },
  {
    slug: "gayrimenkul-ve-insaat-hukuku",
    name: "Gayrimenkul ve İnşaat Hukuku",
    icon: "Building2",
    description:
      "Taşınmaz işlemleri, yüksek değeri ve kalıcı sonuçlarıyla uzmanlık gerektirir.",
    fullDescription: `Gayrimenkul ve inşaat hukuku, taşınmaz edinimi, satışı, kiralama ve inşaat süreçlerini hukuki çerçevede düzenleyen bir hukuk dalıdır. Yüksek değeri ve kalıcı sonuçları olan taşınmaz işlemleri, uzmanlık gerektirmektedir.

Tapu işlemleri, gayrimenkul satış ve kira sözleşmeleri, inşaat sözleşmeleri, kat karşılığı sözleşmeleri, iskan ve ruhsat işlemleri ile gayrimenkul uyuşmazlıklarının çözümü konularında müvekkillerimize hukuki destek sunuyoruz.`,
  },
  {
    slug: "fintek-hukuku",
    name: "Fintek Hukuku",
    icon: "Wallet",
    description:
      "Finansal teknolojilerdeki hızlı gelişmeler, dinamik ve sektörle uyumlu bir hukuk yaklaşımını gerektirir.",
    fullDescription: `Fintek hukuku, finansal teknolojilerdeki hızlı gelişmelere paralel olarak şekillenen ve dinamik bir hukuk yaklaşımı gerektiren bir alandır. Ödeme sistemleri, dijital bankacılık, kripto para ve blokzincir teknolojileri, crowdfunding ve diğer yenilikçi finansal hizmetler konusunda müvekkillerimize hukuki danışmanlık sunuyoruz.

Sektörün hızla değişen yapısına uyum sağlayarak, regulatory compliance, lisanslama ve veri güvenliği gibi konularda güncel ve etkili çözümler üretiyoruz.`,
  },
  {
    slug: "bilisim-hukuku",
    name: "Bilişim Hukuku",
    icon: "Monitor",
    description:
      "Günümüzde dijital teknolojilerin hayatımıza entegre olmasıyla birlikte, suçların da sanal ortama taşındığını görüyoruz.",
    fullDescription: `Bilişim hukuku, dijital teknolojilerin hayatımıza entegre olmasıyla birlikte giderek önem kazanan bir hukuk dalıdır. Siber suçlar, veri ihlalleri, e-ticaret, dijital sözleşmeler, yazılım lisanslama ve fikri mülkiyet haklarının dijital ortamda korunması gibi konularda müvekkillerimize hukuki destek sunuyoruz.

KVKK uyumluluğu, veri güvenliği, siber güvenlik ve dijital ortamdaki hukuki uyuşmazlıkların çözümünde uzman kadromuzla yanınızdayız.`,
  },
  {
    slug: "vatandaslik-hukuku",
    name: "Vatandaşlık Hukuku",
    icon: "Globe",
    description:
      "Vatandaşlık ilişkileri bağlamında hukuki problemlerle yüzleşmiş olan müvekkillerin hak ve menfaatlerinin korunması yönünde gereken adımları atmaktayız.",
    fullDescription: `Vatandaşlık hukuku, bireylerin vatandaşlık statüsünden doğan hak ve yükümlülüklerini düzenleyen bir hukuk dalıdır. Türk vatandaşlığının kazanılması, kaybedilmesi, çifte vatandaşlık, oturma izni, çalışma izni ve uluslararası koruma gibi konularda müvekkillerimize hukuki destek sunuyoruz.

Yabancı uyruklu kişilerin Türkiye'deki hukuki süreçleri ve Türk vatandaşlığı başvuruları gibi konularda deneyimli kadromuzla hizmet veriyoruz.`,
  },
];

export const teamMembers = [
  {
    name: "Av. Burak GÖNCÜ",
    title: "Kurucu Avukat",
    category: "lawyer",
    bio: "Yakın Doğu Üniversitesi Hukuk Fakültesinden 2012 yılında mezun olmuştur. 2012-2017 yılları arasında Diyarbakır Barosuna; 2017 yılından itibaren ise İstanbul Barosuna bağlı olarak mesleğini icra etmektedir. Adil Hukuk Danışmanlık bürosunda kurucu avukat pozisyonunda görev almakla birlikte, özellikle ceza hukuku alanlarında müvekkillerine hizmet vermektedir. Göncü, Ceza Hukuku alanında ulusal basında ve mesleki seminerlerde eğitimler vermiştir. Aynı zamanda Türkiye basınında yer alan birçok kadın cinayeti dosyasında katılan vekilliği görevini üstlenmiştir.",
    initials: "BG",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/av.-burak-goncu--7458124.jpg",
    specializations: ["Ceza Hukuku"],
    slug: "av-burak-goncu",
  },
  {
    name: "Av. Kamuran KURTAR",
    title: "Kurucu Avukat & Danışman",
    category: "lawyer",
    bio: "Av. Kamuran Kurtar, Yakın Doğu Üniversitesi Hukuk Fakültesinden 2012 yılından itibaren İstanbul Barosuna bağlı olarak mesleğini icra etmektedir. Ulusal ve uluslararası düzeyde edindiği bilgi ve tecrübeleriyle, gerek Adil Hukuk Danışmanlık bürosundaki ekip arkadaşlarına gerekse müvekkillerine hukuki süreçlerin ilgili yasa ve yönetmeliklere uygun, stratejik ve pratik olarak yürütülmesini sağlama noktasında hukuki danışmanlık yapmaktadır.",
    initials: "KK",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/av.-kamuran-kurtar--4504806.jpg",
    specializations: ["Stratejik Danışmanlık"],
    slug: "av-kamuran-kurtar",
  },
  {
    name: "Zehra ÇAKMEN",
    title: "Genel Koordinatör",
    category: "staff",
    bio: "Büro yönetimi ve müvekkil ilişkileri konusunda yaklaşık 17 yıllık tecrübe ile beraber çeşitli kulüplerde gönüllü olarak çalışmalar içerisinde yer aldı. Çeşitli projeler ve ekipleri başarılı bir şekilde koordine etmek ve yönetme konusunda yetkinlik kazanmıştır. Adil Hukuk Danışmanlık bünyesinde Genel koordinatör olarak görev almakla birlikte müvekkil temsil hizmeti yürütmektedir.",
    initials: "ZÇ",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/zehra-cakmen--7234935.jpg",
    specializations: ["Büro Yönetimi", "Müvekkil İlişkileri"],
    slug: "zehra-cakmen",
  },
  {
    name: "Av. Zeliha Nur GENÇOSMANOĞLU",
    title: "Yönetici Avukat",
    category: "lawyer",
    bio: "İstanbul Aydın Üniversitesi Hukuk Fakültesinden 2021 yılında mezun olmuştur. 2022 yılından beri İstanbul Barosuna bağlı olarak mesleğini icra etmektedir. Adil Hukuk Danışmanlık bürosunda yönetici avukat pozisyonunda görev almakla birlikte, özel hukuk alanlarında müvekkillerine hizmet vermektedir.",
    initials: "ZN",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/av.-zeliha-nur-gencosmanoglu--1996624.webp",
    specializations: ["Özel Hukuk"],
    slug: "av-zeliha-nur-gencosmanoglu",
  },
  {
    name: "Av. Gülcan KARA",
    title: "Yönetici Avukat",
    category: "lawyer",
    bio: "Atatürk Üniversitesi Hukuk Fakültesi mezunudur. 2020 yılından beri İstanbul Barosuna bağlı olarak mesleğini yürütmektedir. Adil Hukuk Danışmanlık bürosunda yönetici avukat pozisyonunda görev almakla birlikte, ağırlıklı olarak iş hukuku, Ticaret Hukuku, Borçlar Hukuku, İcra Hukuku, Özel hukuk gibi bir çok alanda müvekkillerine hizmet vermektedir.",
    initials: "GK",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/av.-gulcan-kara--2133368.jpg",
    specializations: ["İş Hukuku", "Ticaret Hukuku", "İcra Hukuku", "Borçlar Hukuku"],
    slug: "av-gulcan-kara",
  },
  {
    name: "Av. Ebru İNCE",
    title: "Avukat",
    category: "lawyer",
    bio: "İzmir Yaşar Üniversitesi Hukuk Fakültesinden 2019 yılında mezun olmuştur. 2020 yılında stajını bitirmiş banka ve varlık şirketleri ile çalışan hukuk ofislerinde yönetici avukatlık pozisyonunda görev almıştır. Ticaret Hukuku, İcra İflas Hukuku ve Ceza Hukuku alanında müvekkillere hizmet vermiştir. Adil Hukuk ve Danışmanlık ofisinde Ceza Hukuku alanında çalışmaktadır.",
    initials: "Eİ",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/av.-ebru-ince--6193647.jpg",
    specializations: ["Ceza Hukuku", "Ticaret Hukuku", "İcra İflas Hukuku"],
    slug: "av-ebru-ince",
  },
  {
    name: "Av. Tuğçe DEMİREL",
    title: "Avukat",
    category: "lawyer",
    bio: "Altınbaş Üniversitesi Hukuk Fakültesinden mezun olmuştur. Avukatlık stajını bitirdikten sonra 2022 tarihinde mesleğe başlamış olup Ceza hukuku alanında çalışmaktadır.",
    initials: "TD",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/av.tugce-demirel--7277150.jpg",
    specializations: ["Ceza Hukuku"],
    slug: "avtugce-demirel",
  },
  {
    name: "Stj. Av. Muhammet Emin ÇELİKKAYA",
    title: "Stajyer Avukat",
    category: "intern-lawyer",
    bio: "First Private University FON Skopje Hukuk Fakültesi mezunudur. 2024 yılından beri İstanbul Barosu'na bağlı olarak mesleğini yürütmektedir. Adil Hukuk Danışmanlık bürosunda stajyer avukat pozisyonunda görev almakla birlikte, ağırlıklı olarak ceza hukuku, iş hukuku, ticaret hukuku, borçlar hukuku, icra hukuku, özel hukuk gibi birçok alanda hizmet vermektedir.",
    initials: "MÇ",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/stj.-av.-muhammet-emin-celikkaya--5586321.jpg",
    specializations: ["Ceza Hukuku", "İş Hukuku", "Ticaret Hukuku", "İcra Hukuku"],
    slug: "stj-av-muhammet-emin-celikkaya",
  },
  {
    name: "Stj. Av. İremsu Toraman",
    title: "Stajyer Avukat",
    category: "intern-lawyer",
    bio: "Kırklareli Hukuk Fakültesi'nden 2024 yılında mezun olmuştur. Hukuk Mesleklerine Giriş Sınavını başarıyla geçerek yasal stajını başlatmıştır. Adil Hukuk Danışmanlık bürosunda stajyer avukat pozisyonunda görev almakla birlikte, Ağırlıklı Olarak Ceza Hukuku, İş Hukuku, Ticaret Hukuku ve İcra Hukuku alanlarında araştırmalarını sürdürmektedir.",
    initials: "İT",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/stj.-av.-iremsu-toraman--3709649.jpg",
    specializations: ["Ceza Hukuku", "İş Hukuku", "Ticaret Hukuku", "İcra Hukuku"],
    slug: "stj-av-iremsu-toraman",
  },
  {
    name: "Stj. Av. Serkan Kızıl",
    title: "Stajyer Avukat",
    category: "intern-lawyer",
    bio: "Marmara Üniversitesi Hukuk Fakültesi'nden 2025 yılında mezun olmuştur. Adil Hukuk Danışmanlık Bürosunda stajyer avukat pozisyonunda görev almakla birlikte, ağırlıklı olarak Ticaret Hukuku, Ceza Hukuku, İş Hukuku ve İcra Hukuku alanlarında araştırmalarını sürdürmektedir.",
    initials: "SK",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/stj.-av.-serkan-kizil--5996685.jpg",
    specializations: ["Ceza Hukuku", "Ticaret Hukuku", "İş Hukuku", "İcra Hukuku"],
    slug: "stj-av-serkan-kizil",
  },
  {
    name: "Stj. Öğr. Abdurrahim NARİN",
    title: "Stajyer Öğrenci",
    category: "intern-student",
    bio: "İstanbul Medeniyet Üniversitesi Hukuk Fakültesi 4. Sınıf Öğrencisidir. 2020 yılından beri aktif olarak avukatlık ofislerinde stajyerlik pozisyonunda mesleğini yürütmektedir. 2024 yılında Adil Hukuk Danışmanlık bürosunda stajyer avukat pozisyonunda görev almakla birlikte, ağırlıklı olarak ceza hukuku, iş hukuku, ticaret hukuku, borçlar hukuku, icra hukuku, özel hukuk gibi birçok alanda hizmet vermektedir.",
    initials: "AN",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/stj.-av.-abdurrahim-narin--2799436.jpg",
    specializations: ["Ceza Hukuku", "İş Hukuku", "Ticaret Hukuku"],
    slug: "stj-ogr-abdurrahim-narin",
  },
  {
    name: "Stj. Öğr. Fatma KAPLAN",
    title: "Stajyer Öğrenci",
    category: "intern-student",
    bio: "",
    initials: "FK",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/stajyer-ogrenci--9287668.jpg",
    specializations: [],
    slug: "stj-ogr-fatma-kaplan",
  },
  {
    name: "Stj. Öğr. Ezgi Sena GÜLER",
    title: "Stajyer Öğrenci",
    category: "intern-student",
    bio: "",
    initials: "EG",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/stj.-ogr.-ezgi-sena-guler--1483404.jpg",
    specializations: [],
    slug: "stj-ogr-ezgi-sena-guler",
  },
  {
    name: "Edanur GÜMÜŞ",
    title: "Ofis Asistanı",
    category: "staff",
    bio: "Toki Hayme Ana Mesleki Teknik Anadolu Lisesi Adalet / Zabıt Katipliği bölümü mezunudur. Adil Hukuk Bürosunda Yönetici Asistanı olarak görev yapmaktadır.",
    initials: "EG",
    photo: "https://demo1.maxiweb.com.tr/panel/galeri/edanur-gumus--8985045.jpg",
    specializations: [],
    slug: "edanur-gumus",
  },
];

export const aboutData = {
  title: "Güven, Uzmanlık ve Çözüm Odaklı Hukuki Hizmet",
  intro:
    "Adil Hukuk Danışmanlık Bürosu olarak, müvekkillerimize hak ettikleri nitelikli ve güvenilir hukuki hizmeti sunmayı temel ilkemiz kabul ediyoruz. Kurulduğumuz günden bu yana, yalnızca hukuk alanında değil, aynı zamanda insan ilişkilerinde de güven temelli bir yaklaşımı benimsiyoruz.",
  body: "Alanında uzman ekibimizle, her bir dosyayı titizlikle inceleyerek müvekkillerimizin ihtiyaçlarına özel çözümler üretiyoruz. Hukukun tüm alanlarında güncel gelişmeleri yakından takip ediyor, süreç boyunca şeffaflık ve iletişimi ön planda tutuyoruz.",
  closing:
    "Amacımız, her koşulda müvekkillerimizin haklarını en güçlü şekilde korumak ve güven duyabilecekleri bir yol arkadaşlığı sunmaktır.",
  bullets: [
    "Stratejik ve etkin dava takibi",
    "Uyuşmazlıkların önleyici danışmanlık ile çözümü",
    "Hızlı iletişim ve şeffaf bilgilendirme",
    "Tam zamanlı destek ve titiz dosya yönetimi",
  ],
  vision: "Müvekkillerimizin karşılaştığı hukuki sorunları yalnızca çözüme kavuşturmakla kalmayıp, aynı zamanda haklarını kararlılıkla ve stratejik bir biçimde savunarak uzun vadeli güven ilişkileri kurmak.",
};

export const homeData = {
  hero: {
    title: "Adil Hukuk Danışmanlık Bürosu",
    subtitle: "Güven, Uzmanlık ve Çözüm Odaklı Hukuki Hizmet",
    cta1: "Hizmetlerimiz",
    cta2: "Bize Ulaşın",
  },
  heroSlides: [
    {
      title: "Hakkınızı Güvenle Savunuyoruz",
      subtitle: "Ceza hukuku, aile hukuku ve daha fazlasında uzman kadromuzla yanınızdayız. Her dosya bizim için eşsizdir ve en doğru stratejiyi belirliyoruz.",
      cta: "Hizmetlerimiz",
      ctaLink: "/hizmetlerimiz",
    },
    {
      title: "Stratejik Hukuki Danışmanlık",
      subtitle: "Şirketleriniz ve ticari faaliyetleriniz için kapsamlı hukuki destek. Riskleri önceden tespit ederek güvenli adımlar atmanızı sağlıyoruz.",
      cta: "Detaylı Bilgi",
      ctaLink: "/hizmetlerimiz/ticaret-hukuku",
    },
    {
      title: "7/24 Ulaşılabilir Avukat Desteği",
      subtitle: "Acil hukuki ihtiyaçlarınızda yanınızdayız. Hemen arayarak uzman avukatlarımıza ulaşabilir, ilk danışmanlığınızı alabilirsiniz.",
      cta: "Hemen Ara",
      ctaLink: "tel:+905317760283",
    },
  ],
  features: [
    {
      title: "Hukuki Danışmanlık",
      description:
        "Hukuki danışmanlık, birey ve şirketlerin haklarını korur, riskleri azaltır, güvenli adımlar atmalarını sağlar.",
      icon: "Scale",
    },
    {
      title: "Sözleşmelerde Hukuki Destek",
      description:
        "Hazırlanan sözleşmeler tarafların haklarını güvenceye alır, ileride doğabilecek anlaşmazlıkları önler, güvenli ilişkiler oluşturur.",
      icon: "FileText",
    },
    {
      title: "Hukuki Süreçlerde Avukatın Rolü",
      description:
        "Avukat, hukuki süreçlerde haklarınızı en doğru şekilde savunur, usul hatalarını önler, süreci güvenle yönetir, adalet sağlar.",
      icon: "ShieldCheck",
    },
  ],
  aboutSection: {
    title: "Stratejik yaklaşımlar",
    text: "Her biri alanında uzman hukukçulardan oluşan kadromuzla, hukukun gelişen dinamiklerine uyum sağlayarak, müvekkillerimizin artan ve çeşitlenen ihtiyaçlarına eksiksiz yanıt vermeye devam ediyoruz. Alanında uzman ekibimizle, her bir dosyayı titizlikle inceleyerek müvekkillerimizin ihtiyaçlarına özel çözümler üretiyoruz. Amacımız, her koşulda müvekkillerimizin haklarını en güçlü şekilde korumak ve güven duyabilecekleri bir yol arkadaşlığı sunmaktır.",
  },
  whyUs: [
    {
      title: "15+ Yıl Tecrübe",
      description: "Hukukun farklı alanlarında yıllara dayanan derin tecrübe ve bilgi birikimi ile dosyalarınıza en güçlü savunmayı sunuyoruz.",
      icon: "Award",
    },
    {
      title: "Sonuç Odaklılık",
      description: "Her dosyada en iyi sonucu elde etmek için stratejik yaklaşımlar geliştiriyor, alternatif çözüm yollarını değerlendiriyoruz.",
      icon: "Target",
    },
    {
      title: "Tam Şeffaflık",
      description: "Sürecin her aşamasında müvekkillerimizi bilgilendiriyor, açık ve anlaşılır iletişimle güven inşa ediyoruz.",
      icon: "Eye",
    },
    {
      title: "Müvekkil Odaklılık",
      description: "Her müvekkilimizin ihtiyaçlarına özel çözümler üretiyor, bireysel yaklaşımımızla fark yaratıyoruz.",
      icon: "HeartHandshake",
    },
  ],
  blogPosts: [
    {
      title: "Yeni Türk Ticaret Kanunu Değişiklikleri",
      summary: "2025 yılında yürürlüğe giren Türk Ticaret Kanunu değişiklikleri, şirketlerin faaliyetlerini doğrudan etkileyecek önemli düzenlemeler içeriyor. Bu yazımızda değişikliklerin iş dünyasına etkilerini değerlendiriyoruz.",
      date: "15 Ocak 2025",
      category: "Ticaret Hukuku",
      slug: "yeni-ttk-degisiklikleri",
    },
    {
      title: "Boşanma Sürecinde Mal Paylaşımı",
      summary: "Boşanma davalarında mal paylaşımı en karmaşık konulardan biridir. Yeni düzenlemelerle birlikte mal rejimi kurallarında önemli değişiklikler yapılmıştır.",
      date: "28 Aralık 2024",
      category: "Aile Hukuku",
      slug: "bosanma-mal-paylasimi",
    },
    {
      title: "KVKK Uyum Süreci Rehberi",
      summary: "Kişisel Verilerin Korunması Kanunu kapsamında işletmelerin yerine getirmesi gereken yükümlülükler ve uyum sürecinin adım adım nasıl yürütüleceği.",
      date: "10 Aralık 2024",
      category: "Bilişim Hukuku",
      slug: "kvkk-uyum-rehberi",
    },
    {
      title: "İş Hukukunda Yeni Düzenlemeler",
      summary: "İş Kanunu'nda yapılan son değişiklikler, işçi ve işveren haklarını doğrudan etkiliyor. Kıdem tazminatı ve iş güvencesi konularındaki güncel gelişmeler.",
      date: "5 Kasım 2024",
      category: "İş Hukuku",
      slug: "is-hukuku-yeni-duzenlemeler",
    },
    {
      title: "Miras Uyuşmazlıklarında Dikkat Edilmesi Gerekenler",
      summary: "Miras paylaşımı sırasında sıkça karşılaşılan hukuki problemler ve çözüm yolları hakkında kapsamlı bir rehber. Muris muvazaası ve tenkis davaları.",
      date: "20 Ekim 2024",
      category: "Miras Hukuku",
      slug: "miras-uyusmazliklari",
    },
    {
      title: "Ceza Muhakemesinde Savunma Hakkı",
      summary: "Ceza yargılamasında sanığın savunma hakkı, adil yargılanmanın temel unsurlarından biridir. Savunma hakkının sınırları ve kullanımına dair güncel değerlendirme.",
      date: "8 Ekim 2024",
      category: "Ceza Hukuku",
      slug: "ceza-muhakemesi-savunma-hakki",
    },
    {
      title: "Kira Sözleşmelerinde Dikkat Edilmesi Gereken Hususlar",
      summary: "Gayrimenkul kira sözleşmelerinin düzenlenmesi, fesih şartları ve kira uyuşmazlıklarının çözümüne ilişkin hukuki değerlendirme.",
      date: "25 Eylül 2024",
      category: "Gayrimenkul Hukuku",
      slug: "kira-sozlesmeleri",
    },
    {
      title: "Fintek Şirketlerinin Lisans Yükümlülükleri",
      summary: "Finansal teknoloji şirketlerinin BDDK ve SPK düzenlemeleri kapsamında yerine getirmesi gereken lisans ve uyum yükümlülükleri.",
      date: "12 Eylül 2024",
      category: "Fintek Hukuku",
      slug: "fintek-lisans-yukumlulukleri",
    },
    {
      title: "İdari Davalarda Süre ve Usul Kuralları",
      summary: "İdari dava ve işlemlerde dikkat edilmesi gereken süre sınırları, başvuru yolları ve usul kurallarına ilişkin kapsamlı rehber.",
      date: "1 Eylül 2024",
      category: "İdare Hukuku",
      slug: "idari-davalar-sure-usul",
    },
    {
      title: "Vatandaşlık Başvuru Süreci ve Gerekli Belgeler",
      summary: "Türk vatandaşlığı başvurusunun adım adım süreci, gerekli belgeler ve sık karşılaşılan sorunlar hakkında güncel bilgilendirme.",
      date: "18 Ağustos 2024",
      category: "Vatandaşlık Hukuku",
      slug: "vatandaslik-basvuru-sureci",
    },
    {
      title: "İcra Takibinde Borçlu Hakları",
      summary: "İcra ve iflas hukuku kapsamında borçlunun sahip olduğu haklar, itiraz yolları ve hukuki koruma mekanizmaları.",
      date: "5 Ağustos 2024",
      category: "İcra Hukuku",
      slug: "icra-takibinde-borclu-haklari",
    },
    {
      title: "Siber Güvenlik ve Veri İhlali Önleme Stratejileri",
      summary: "İşletmelerin siber güvenlik tehditlerine karşı alması gereken önlemler, veri ihlali durumunda yapılması gerekenler ve KVKK uyumluluk süreçleri.",
      date: "22 Temmuz 2024",
      category: "Bilişim Hukuku",
      slug: "siber-guvenlik-veri-ihlali",
    },
  ],
  testimonials: [
    {
      name: "Ahmet Y.",
      role: "Şirket Yöneticisi",
      text: "Ticari uyuşmazlığımızda gösterdikleri profesyonel yaklaşım ve hızlı çözüm odaklılıkları sayesinde olumlu sonuç aldık. Kendilerine minnettarız.",
      initials: "AY",
    },
    {
      name: "Elif K.",
      role: "Müvekkil",
      text: "Boşanma davamda yaşadığım en zor dönemde yanımdaydılar. Şefkatli ama aynı zamanda kararlı savunmalarıyla haklarımı korudular.",
      initials: "EK",
    },
    {
      name: "Mehmet S.",
      role: "Girişimci",
      text: "Fintek alanındaki uzmanlıkları sayesinde şirketimizi kuruluş aşamasından itibaren hukuki güvence altına alabildik. Kesinlikle tavsiye ediyorum.",
      initials: "MS",
    },
  ],
  faqItems: [
    {
      question: "İlk hukuki danışmanlık ücretli mi?",
      answer: "İlk görüşme ve danışmanlık ücretsizdir. Dosyanızın durumunu değerlendirip size en uygun hukuki yolu birlikte belirliyoruz. Detaylı bilgi için iletişim sayfamızdan bize ulaşabilirsiniz.",
    },
    {
      question: "Hangi hukuk alanlarında hizmet veriyorsunuz?",
      answer: "Ticaret Hukuku, Aile Hukuku, Ceza Hukuku, Miras Hukuku, İş Hukuku, İdare Hukuku, Gayrimenkul Hukuku, Bilişim Hukuku, Fintek Hukuku ve Vatandaşlık Hukuku başta olmak üzere 11 farklı uzmanlık alanında hizmet sunuyoruz.",
    },
    {
      question: "Acil durumlarda nasıl ulaşabilirim?",
      answer: "Acil hukuki yardıma ihtiyaç duyduğunuzda +90 531 776 02 83 numaralı GSM hattımızdan 7/24 ulaşabilirsiniz. Ayrıca WhatsApp üzerinden de anlık iletişim kurmanız mümkündür.",
    },
    {
      question: "Dava süreci ne kadar sürer?",
      answer: "Dava süreleri, davanın türüne, mahkemenin iş yüküne ve dosyanın karmaşıklığına göre değişiklik gösterir. İlk görüşmede dosyanızın tahmini süresi hakkında bilgilendirme yapıyoruz.",
    },
    {
      question: "Online danışmanlık mümkün mü?",
      answer: "Evet, video konferans veya telefon üzerinden online danışmanlık hizmeti sunuyoruz. Özellikle yurt dışındaki müvekkillerimiz için bu hizmet büyük kolaylık sağlamaktadır.",
    },
    {
      question: "Ücretlendirme nasıl yapılıyor?",
      answer: "Ücretlendirmemiz, davanın türü ve karmaşıklığına göre belirlenmektedir. Sabit ücret, saatlik ücret veya başarı ücreti gibi farklı modeller uygulayabiliyoruz. Şeffaf ücret politikamızla süpriz yok.",
    },
  ],
  ctaSection: {
    title: "Güvenilir hukuki hizmet sunuyoruz",
    subtitle: "Müvekkillerimizin karşılaştığı hukuki sorunları çözüme kavuşturuyoruz.",
  },
};

export const joinUsData = {
  title: "İnsan Kaynakları - Bize Katılın",
  intro: "Adil Hukuk Bürosu olarak her dereceden iş tecrübesine sahip ve açık pozisyonlara uygun kalifiye adaylara her zaman açığız.",
  requirements: [
    "Yenilikçi, motivasyonu yüksek ve sadık",
    "Akademik eğitimle harmanlanmış pratik hukuk deneyimine sahip",
    "İleri derecede İngilizce",
    "Avrupa dillerinden bir ya da daha fazlasına hakim olunması tercih sebebidir",
  ],
  note: "Staj yapmak isteyen adayların da başvurularını bekliyoruz. Siz de uluslararası, samimi ve aynı zamanda rekabet ve fırsatlarla dolu bir atmosferde deneyim kazanmak istiyorsanız lütfen bizimle irtibata geçin.",
  toeftNote:
    "TOEFL ya da IELTS sınavlarından herhangi birinden alınmış sonuç belgenizi lütfen başvurunuza eklemeyi unutmayınız.",
};

export const kvkkData = {
  title: "Kişisel Verilerin Korunması",
  sections: [
    {
      title: "ADİL HUKUK BÜROSU KİŞİSEL VERİLERİN İŞLENMESİ AYDINLATMA METNİ",
      content:
        "Adil Hukuk Bürosu olarak kişisel verilerinizin güvenliği hususunda gerekli hassasiyeti gösteriyoruz. Bu bilinçle, müvekkillerimize ve müvekkil adaylarımıza ait her türlü kişisel verinin 6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVK Kanunu')'na uygun olarak işlenerek saklanmasına büyük önem veriyoruz. Kişisel verilerinizi aşağıda açıklanan şekilde ve yasal mevzuat çerçevesinde işlemekteyiz. Kişisel verilerinizin alınma şekilleri, işlenme amaçları, hukuki nedenleri ve haklarınız konularında sizi en şeffaf şekilde bilgilendirmek istiyoruz.",
    },
    {
      title: "1. Kişisel Verilerin Toplanması, İşlenmesi ve İşleme Amaçları",
      content:
        "Kişisel verileriniz, otomatik ya da otomatik olmayan yöntemlerle, sözlü, yazılı ya da elektronik olarak toplanabilecektir. Toplanan kişisel verileriniz, hizmetlerimizden faydalanabilmeniz, hak ve menfaatlerinizin korunması için gerekli işlemlerin iş birimlerimiz tarafından yapılması amaçları ile KVK Kanunu'nun 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde işlenecektir.",
    },
    {
      title: "2. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği",
      content:
        "Toplanan kişisel verileriniz; tarafınıza çeşitli hak ve menfaatlerin sağlanması, haklarınızın korunması ve yürütülmesinin temini amaçlarıyla iş ortaklarımıza, kanunen yetkili kamu kurumları ve özel kişilere, hukuk büromuzdan almış olduğunuz hizmetin konusunun yurtdışı ile bağlantılı olması halinde, yurtdışında bulunan iş ortaklarımızla, KVK Kanunu'nun 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde aktarılabilecektir.",
    },
    {
      title: "3. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi",
      content:
        "Kişisel verileriniz, her türlü sözlü, yazılı ya da elektronik ortamda, yukarıda yer verilen amaçlar doğrultusunda Hukuk Büromuzun sunduğu hizmetlerin belirlenen yasal çerçevede sunulabilmesi ve bu kapsamda Hukuk Büromuzun sözleşme ve yasadan doğan mesuliyetlerini eksiksiz ve doğru bir şekilde yerine getirebilmesi gayesi ile edinilir. Bu hukuki sebeple toplanan kişisel verileriniz KVK Kanunu'nun 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları kapsamında bu metinde belirtilen amaçlarla da işlenebilmekte ve aktarılabilmektedir.",
    },
    {
      title: "4. Kişisel Veri Sahibinin KVK Kanunu'nun 11. maddesinde Sayılan Hakları",
      content:
        "Kişisel veri sahipleri olarak, haklarınıza ilişkin taleplerinizi hukuk büromuza iletmeniz durumunda hukuk büromuz en kısa süre içerisinde ve her halükarda en geç otuz gün içinde ücretsiz olarak sonuçlandıracaktır.",
      rights: [
        "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
        "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme",
        "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
        "Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme",
        "Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme",
        "Yasal sınırlar hariç olmak üzere Kanunun 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme",
        "İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kendiniz aleyhine bir sonucun ortaya çıkmasına itiraz etme",
        "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
      ],
    },
  ],
  address: "Florya Semti. Şenlik Köy Mah. Saçı Sokak, Florya Cd. No: 4/F, 34513 Bakırköy/İstanbul",
};

export const cookieData = {
  title: "Çerez Politikası",
  sections: [
    {
      title: "Adil Hukuk Bürosu Çerez (Cookie) Politikası",
      content: "",
    },
    {
      title: "Çerez (Cookie) Nedir?",
      content:
        "Çerezler, bir internet sitesini ziyaret ettiğinizde bilgisayar, tablet, cep telefonu vb. cihazlarınıza ait tarayıcılara (browser) gönderilen küçük metin dosyalarıdır. Aynı siteyi yeniden ziyaret ettiğinizde veya o çerezleri tanıyan başka bir siteyi ziyaret ettiğinizde, sitenin cihazınızı hatırlamasını sağlar.",
    },
    {
      title: "Hangi Çerezleri Kullanmaktayız?",
      content:
        "Değerli ziyaretçilerimiz, Adil Hukuk Bürosu olarak internet sitemize yapmakta olduğunuz ziyaretinizde, gizliliğinize ve güvenliğinize büyük önem veriyoruz. Ziyaretiniz sırasında sizlere mümkün olan en iyi deneyimi sunmak ve ihtiyaçlarınızı karşılamak üzere sınırlı ölçüde çerez (cookie) kullanılmaktadır.",
    },
    {
      title: "Çerez Türleri",
      types: [
        {
          name: "Kesinlikle zorunlu çerezler",
          desc: "Site'nin düzgün çalışabilmesi, Site'de gezinebilmeniz ve bazı temel fonksiyonları kullanabilmeniz açısından kesinlikle zorunlu olan çerezlerdir.",
        },
        {
          name: "İşlevsellik çerezleri",
          desc: "İhtiyaçlarınız ve seçimleriniz hakkındaki bilgileri kaydedip internet sitesinin size kişiselleştirilmiş bir deneyim sunmasını sağlar.",
        },
        {
          name: "Performans çerezleri",
          desc: "İnternet sitemizi ziyaretinizde size daha iyi bir kullanıcı deneyimi sunabilmemiz için dâhili amaçlarla kullanılan çerezlerdir. Bu çerezlerin sağladığı bilgiler ziyaretçilerin internet sitesini nasıl kullandıklarını anlamamıza ve site içeriğini geliştirmemize yardımcı olur.",
        },
        {
          name: "Üçüncü Taraf Çerezleri",
          desc: "Bu çerezler, Site'de yer alan çeşitli hizmetler için üçüncü taraflarca tanımlanan çerezlerdir. Bu çerezler üçüncü taraf sunucusu ile cihazınızın sabit sürücüsü arasında gönderilir ve saklanırlar.",
        },
      ],
    },
    {
      title: "Çerezler Ne Amaçla ve Nasıl Kullanılmaktadır?",
      content: "",
      purposes: [
        "Site'yi ziyaret eden kullanıcı sayısı, kullanıcı tipi, ziyaret sıklığı, kullanıcı davranışları ve alışkanlıkları, kullanıcıların hangi ülkelerden siteyi ziyaret ettikleri vb. istatistiklerin oluşturulması amacıyla çerez kullanılabilecektir.",
        "Site üzerinde, kullanıcı tercihlerini daha doğru şekilde belirlemek amacıyla 3. kişiler tarafından yerleştirilmiş çerezler de kullanılabilir.",
        "Site'yi ziyaret eden kullanıcıların tercihlerine bağlı olarak internet sitesi iyileştirilip Site'nin performansı artırılabilecek ve Site'nin trafiği kontrol edilebilecektir.",
        "Çeşitli form doğrulamaları ve Adil Hukuk Bürosu'nun iletişim ve adres bilgilerine tarayıcıların Haritalar uygulamaları üzerinden ulaşabilmeniz amacı ile çerez kullanılabilecektir.",
      ],
    },
    {
      title: "Çerezler Vasıtasıyla Hangi Bilgiler Alınmakta ve İşlenmektedir?",
      content:
        "Site'ye hangi siteden gelindiği ve Site'den sonra hangi sitenin ziyaret edildiği, kullanıcıların coğrafi konumları, sitede yer alan reklam banner'larına tepkileri, kullanıcının Site'ye kendi isteğiyle vermiş olduğu kişisel bilgiler, site üzerinde gerçekleştirilen tercihler, sosyal paylaşım sitelerinde Site ile ilgili hareketler alınabilecek ve işlenebilecektir.",
    },
    {
      title: "Çerez Kullanımının Kontrolü",
      content:
        "Tarayıcınızı, cihazınıza çerez girdiğinde uyaracak biçimde ayarlayabilirsiniz; böylece çerezi kabul edip etmeme seçeneğine sahip olursunuz. Ancak çerezlerin kabul edilmemesi, Site'nin fonksiyonlarını verimli olarak yerine getirmesini engelleyebilir. Tarayıcınızın ayarlarını değiştirerek çerezleri engellemeniz veya silmeniz mümkündür, ancak bunları engellemeniz veya silmeniz durumunda Site'deki bazı özellikleri kullanamayabilirsiniz.",
    },
    {
      title: "Çerez Kullanımında Değişiklikler",
      content:
        "Çerez kullanımı politikamızda herhangi bir değişiklik olduğunda bu alanda yayınlanacaktır.",
    },
  ],
};

export const mediaTabs = [
  { id: "basinda", label: "Basında Biz" },
  { id: "makaleler", label: "Makaleler" },
  { id: "videolar", label: "Videolar" },
];

export const basindaBizItems = [
  {
    id: 1,
    title: "Yargıtay 155'i Arayan Erkeğin İyi Hal İndirimini Bozdu",
    source: "Gazete Duvar",
    sourceDomain: "gazeteduvar.com.tr",
    link: "https://www.gazeteduvar.com.tr/yargitay-155i-arayan-erkegin-iyi-hal-indirimini-bozdu-haber-1564790",
  },
  {
    id: 2,
    title: "Hiç Gitmediği İstanbul'da Hapis Cezası Aldı, 554 Gün Sonra Pardon",
    source: "Hürriyet",
    sourceDomain: "hurriyet.com.tr",
    link: "https://www.hurriyet.com.tr/gundem/hic-gitmedigi-istanbulda-hapis-cezasi-aldi-554-gun-sonra-pardon-40818671",
  },
  {
    id: 3,
    title: "Kadın Cinayeti Davasında Tepki Gösteren Ağabeye 4 Gün Hapis",
    source: "Milliyet",
    sourceDomain: "milliyet.com.tr",
    link: "https://www.milliyet.com.tr/gundem/kadin-cinayeti-davasinda-tepki-gosteren-agabeye-4-gun-hapis-6648939",
  },
  {
    id: 4,
    title: "16 Yerinden Bıçaklanıp Boğazı Kesilerek Öldürüldü, Mahkeme Eziyet Yok Dedi",
    source: "Milliyet",
    sourceDomain: "milliyet.com.tr",
    link: "https://www.milliyet.com.tr/gundem/16-yerinden-bicaklanip-bogazi-kesilerek-olduruldu-mahkeme-eziyet-yok-dedi-2534340",
  },
  {
    id: 5,
    title: "Karagümrük Çetesine Toplu Sevk",
    source: "Deutsche Welle (DW)",
    sourceDomain: "dw.com",
    link: "https://www.dw.com/tr/karag%C3%BCmr%C3%BCk-%C3%A7etesine-toplu-sevk/a-58961456",
  },
  {
    id: 6,
    title: "Kız Arkadaşını Silahla Öldüren Sanığa Müebbet",
    source: "TRT Haber",
    sourceDomain: "trthaber.com",
    link: "https://www.trthaber.com/haber/turkiye/kiz-arkadasini-silahla-olduren-saniga-muebbet-670250.html",
  },
  {
    id: 7,
    title: "Ulviye Avağ Cinayeti Davasında Tanık Dinlendi",
    source: "Sabah",
    sourceDomain: "sabah.com.tr",
    link: "https://www.sabah.com.tr/istanbul/2022/01/11/ulviye-avag-cinayeti-davasinda-tanik-dinlendi",
  },
  {
    id: 8,
    title: "Fatihteki Alacak Verecek Cinayetinde Sanığa 25 Yıl Hapis",
    source: "Sözcü",
    sourceDomain: "sozcu.com.tr",
    link: "https://www.sozcu.com.tr/fatihteki-alacak-verecek-cinayetinde-saniga-25-yil-hapis-wp6999181",
  },
  {
    id: 9,
    title: "Fatihteki Alacak Verecek Cinayetinde Sanığa 25 Yıl Hapis",
    source: "Cumhuriyet",
    sourceDomain: "cumhuriyet.com.tr",
    link: "https://www.cumhuriyet.com.tr/turkiye/fatihteki-alacak-verecek-cinayetinde-saniga-25-yil-hapis-1914343",
  },
  {
    id: 10,
    title: "Polis Memuru 2 Yıl Sonra ByLock'tan Aklandı",
    source: "Memurlar.net",
    sourceDomain: "memurlar.net",
    link: "https://www.memurlar.net/haber/771728/polis-memuru-2-yil-sonra-bylock-tan-aklandi.html",
  },
];

export const ornekDilekceler = [
  {
    id: 1,
    title: "Borç İtiraz Dilekçesi",
    category: "İcra Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/Borc-itiraz-dilekcesi.doc",
    fileFormat: "doc",
  },
  {
    id: 2,
    title: "Kira Bedelinin Uyarlanması Dilekçesi",
    category: "Kira Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/kira-bedelinin-uyarlanmasi.doc",
    fileFormat: "doc",
  },
  {
    id: 3,
    title: "Tehdit ve Hakaret Suç Duyurusu",
    category: "Ceza Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/tehdit-ve-hakaret%20suc-duyurusu.doc",
    fileFormat: "doc",
  },
  {
    id: 4,
    title: "Araç Değer Kaybı Dilekçesi",
    category: "Tazminat Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/arac-deger-kaybi.doc",
    fileFormat: "doc",
  },
  {
    id: 5,
    title: "Basit Yargılama Savunma Dilekçesi",
    category: "Medeni Hukuk",
    downloadUrl: "https://www.adilhukuk.net/dilekce/basit-yargilama-savunma-dilekcesi.doc",
    fileFormat: "doc",
  },
  {
    id: 6,
    title: "Adli Sicil Kaydının Silinmesi Dilekçesi",
    category: "Ceza Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/adli-sicil-kaydinin-silinmesi.doc",
    fileFormat: "doc",
  },
  {
    id: 7,
    title: "İcra Ceza Mahkemesi Kararına İtiraz Dilekçesi",
    category: "İcra Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/ICRA-CEZA-MAHKEMESI%CC%87%20KARARINA-ITIRAZ-DILEKCESI.docx",
    fileFormat: "docx",
  },
  {
    id: 8,
    title: "Kambiyo Senedine Dayalı Menfi Tespit Dava Dilekçesi",
    category: "Ticaret Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/KAMBIYO-SENEDINE-DAYALI%20MENFI-TESPIT-DAVA%20DILEKCESI.docx",
    fileFormat: "docx",
  },
  {
    id: 9,
    title: "Maaş Haczine İtiraz Dilekçesi",
    category: "İcra Hukuku",
    downloadUrl: "https://www.adilhukuk.net/dilekce/MAAS-HACZINE-ITIRAZ%20DILEKCESI.docx",
    fileFormat: "docx",
  },
];
