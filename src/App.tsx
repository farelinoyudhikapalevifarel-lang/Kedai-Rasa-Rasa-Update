/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Menu, 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Mail, 
  ChevronUp, 
  Coffee, 
  Star, 
  Heart, 
  ThumbsUp, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sparkle, 
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Copy,
  Navigation
} from "lucide-react";

// Import our custom generated images with their verified random identifiers from the compilation filesystem
import imgEsDegan from "./assets/images/es_degan_1779460229284.png";
import imgEsDawet from "./assets/images/es_dawet_1779460251588.png";
import imgEsTeh from "./assets/images/es_teh_1779460268320.png";
import imgAboutKedai from "./assets/images/about_kedai_1779460289114.png";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  tagColor?: string;
  stars: number;
  sales: string;
}

interface Topping {
  name: string;
  price: number;
}

export default function App() {
  // ----- States -----
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Time Countdown state for Promo
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Testimonials Slider state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Modal customization state for item order
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSugar, setSelectedSugar] = useState("Normal");
  const [selectedIce, setSelectedIce] = useState("Normal");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState("");

  // Contact Form reservation state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDrink, setFormDrink] = useState("Es Degan (Rp5.000)");
  const [formQty, setFormQty] = useState(1);
  const [formAddress, setFormAddress] = useState("");
  const [formDistance, setFormDistance] = useState(1);
  const [formPaymentMethod, setFormPaymentMethod] = useState("COD");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ----- Constants -----
  const MENU_ITEMS: MenuItem[] = [
    {
      id: 1,
      name: "Es Degan",
      description: "Es degan segar dari daging dan air kelapa muda pilihan, disajikan dingin dengan pemanis alami tebu murni pilihan.",
      price: 5000,
      image: imgEsDegan,
      tag: "Terlaris 👑",
      tagColor: "bg-amber-100 text-amber-800 border-amber-200",
      stars: 5,
      sales: "120+ Terjual hari ini",
    },
    {
      id: 2,
      name: "Es Dawet",
      description: "Es dawet manis istimewa yang creamy dan lembut dengan isian cendol pandan wangi, sirup gula jawa kental asli, dan santan segar gurih.",
      price: 5000,
      image: imgEsDawet,
      tag: "Resep Legendaris ✨",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      stars: 5,
      sales: "95+ Terjual hari ini",
    },
    {
      id: 3,
      name: "Es Teh",
      description: "Seduhan teh Javanese premium dengan wangi melati yang khas, disajikan dingin dengan es kristal steril, ramah menyegarkan kerongkongan Anda.",
      price: 5000,
      image: imgEsTeh,
      tag: "Favorit Harian 🍃",
      tagColor: "bg-sky-100 text-sky-800 border-sky-200",
      stars: 5,
      sales: "200+ Terjual hari ini",
    },
  ];

  const TOPPINGS: Topping[] = [
    { name: "Ekstra Kelapa Muda degan", price: 3000 },
    { name: "Selasih Premium", price: 1000 },
    { name: "Nata de Coco kenyal", price: 2000 },
    { name: "Cincau Serut manis", price: 1500 },
  ];

  const TESTIMONIALS = [
    {
      name: "Andi Wijaya",
      role: "Pelanggan Setia",
      rating: 5,
      comment: "Es degannya benar-benar segar banget! Kualitas kelapanya jempolan, manisnya alami tebu, bukan pemanis buatan yang bikin gatal tenggorokan. Sangat rekomen untuk siang bolong!",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "Siti Rahmawati",
      role: "Reviewer Kuliner",
      rating: 5,
      comment: "Rasa Es Dawetnya authentic sekali! Santannya gurih bersih, dan gula merahnya kental beraroma pandan asli. Murah meriah, rasanya seperti bintang lima!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "Budi Santoso",
      role: "Warga Sekitar",
      rating: 5,
      comment: "Tempat favorit sepulang kerja. Es teh melatinya harum dan nendang banget segarnya. Pelayanan mas-masnya ramah, dan tempatnya bersih luar biasa. Sukses terus Kedai Rasa Rasa!",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ];

  // ----- Effects -----
  // Simulate App Loading Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle Navbar Background Change on Scroll and Active Section Mapping
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setShowBackToTop(window.scrollY > 500);

      // Section highlighters
      const sections = ["home", "menu", "promo", "tentang", "lokasi", "kontak"];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time Countdown Timer for Diskon (counts down to 23:59:59 daily)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        // Reset to next day or stay zero
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial update
    return () => clearInterval(interval);
  }, []);

  // Testimonials Auto Slide Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [TESTIMONIALS.length]);

  // ----- Helper Functions -----
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticking header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const getToppingsTotal = () => {
    if (!selectedItem) return 0;
    let sum = 0;
    selectedToppings.forEach((topName) => {
      const t = TOPPINGS.find((tp) => tp.name === topName);
      if (t) sum += t.price;
    });
    return sum;
  };

  const getModalTotalPrice = () => {
    if (!selectedItem) return 0;
    return (selectedItem.price + getToppingsTotal()) * orderQuantity;
  };

  // Open modal customization
  const triggerOrderModal = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedSugar("Normal");
    setSelectedIce("Normal");
    setSelectedToppings([]);
    setOrderQuantity(1);
    setOrderNote("");
    setIsModalOpen(true);
  };

  // Build and redirect to WhatsApp for the custom Modal Order
  const handleConfirmOrder = () => {
    if (!selectedItem) return;
    const toppingsStr = selectedToppings.length > 0 ? selectedToppings.join(", ") : "Tanpa Topping";
    const totalPriceFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(getModalTotalPrice());

    const message = `Halo Kak Kedai Rasa Rasa! 🥤\n\nSaya mau pesan lewat Website:\n─────────────────────\n*Minuman:*  ${selectedItem.name}\n*Jumlah:*   ${orderQuantity} Cup\n*Gula:*     ${selectedSugar}\n*Es:*       ${selectedIce}\n*Topping:*  ${toppingsStr}\n${orderNote ? `*Catatan:*  _${orderNote}_\n` : ""}─────────────────────\n*Total Bayar:*  ~${totalPriceFormatted}~\n\nMohon dikonfirmasi pesanannya ke alamat saya ya kak! Terima kasih banyak 🙏✨`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/6289516459560?text=${encodedText}`, "_blank");
    setIsModalOpen(false);
  };

  // DRINK lookup mapping
  const DRINK_PRICES: { [key: string]: number } = {
    "Es Degan (Rp5.000)": 5000,
    "Es Dawet (Rp5.000)": 5000,
    "Es Teh (Rp5.000)": 5000,
  };

  const getDeliveryFee = (distance: number) => {
    if (distance <= 2) return 0;
    return Math.round(distance) * 1000;
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation tidak didukung oleh browser Anda.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const shopLat = -7.712423;
        const shopLng = 111.530635;
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const R = 6371; // km
        const dLat = (userLat - shopLat) * Math.PI / 180;
        const dLon = (userLng - shopLng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(shopLat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        const roundedDist = Math.max(0.1, Math.round(distance * 10) / 10);
        setFormDistance(roundedDist);
        setFormAddress(`https://www.google.com/maps?q=${userLat},${userLng}`);
        setGpsLoading(false);
        setGpsSuccess(true);
      },
      () => {
        setGpsLoading(false);
        setGpsError("Gagal mendeteksi lokasi otomatis. Mohon aktifkan GPS & izinkan akses.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCopyPayment = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }).catch(() => {
      try {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
      } catch (err) {
        // fail silently or ignore
      }
    });
  };

  // Handle Order Form below to WhatsApp
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const subtotal = (DRINK_PRICES[formDrink] || 5000) * formQty;
    const ongkir = getDeliveryFee(formDistance);
    const total = subtotal + ongkir;

    const formattingPrice = (num: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(num);
    };

    const message = `Halo Kak Kedai Rasa Rasa! 🥤\n\nSaya ingin memesan menu segar lewat Website:\n─────────────────────\n*Nama Pemesan:*  ${formName}\n*No. WhatsApp:*  ${formPhone || "-"}\n*Alamat:*        ${formAddress || "-"}\n*Jarak Kirim:*    ${formDistance} KM\n\n*Pesanan:*      ${formDrink.split(" (")[0]} (${formQty} Cup)\n*Subtotal:*     ${formattingPrice(subtotal)}\n*Ongkos Kirim:* ${ongkir === 0 ? "GRATIS ONGKIR" : formattingPrice(ongkir)}\n*Total Bayar:*   ${formattingPrice(total)}\n\n*Metode Bayar:* ${formPaymentMethod}\n*Catatan:*      _${formMessage || "-"}_ \n─────────────────────\nMohon segera diproses pesanannya ya kak. Terima kasih banyak 🙏✨`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/6289516459560?text=${encodedText}`, "_blank");
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);

    if (formPaymentMethod !== "COD") {
      const paymentPhone = formPaymentMethod === "SeaBank" ? "901847321045" : "089516459560";
      let redirectUrl = "";
      switch (formPaymentMethod) {
        case "DANA":
          redirectUrl = `https://link.dana.id/send-money?phoneNumber=${paymentPhone}`;
          break;
        case "GoPay":
          redirectUrl = `gopay://transfer?phone=${paymentPhone}`;
          break;
        case "ShopeePay":
          redirectUrl = `shopeepay://transfer?phone=${paymentPhone}`;
          break;
        case "OVO":
          redirectUrl = `ovo://transfer?phone=${paymentPhone}`;
          break;
        case "SeaBank":
          redirectUrl = `seabank://transfer?account=${paymentPhone}`;
          break;
        default:
          redirectUrl = "";
      }
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1200);
      }
    }
  };

  const handleDirectPayment = () => {
    if (formPaymentMethod === "COD") return;
    const paymentPhone = formPaymentMethod === "SeaBank" ? "901847321045" : "089516459560";
    let redirectUrl = "";
    switch (formPaymentMethod) {
      case "DANA":
        redirectUrl = `https://link.dana.id/send-money?phoneNumber=${paymentPhone}`;
        break;
      case "GoPay":
        redirectUrl = `gopay://transfer?phone=${paymentPhone}`;
        break;
      case "ShopeePay":
        redirectUrl = `shopeepay://transfer?phone=${paymentPhone}`;
        break;
      case "OVO":
        redirectUrl = `ovo://transfer?phone=${paymentPhone}`;
        break;
      case "SeaBank":
        redirectUrl = `seabank://transfer?account=${paymentPhone}`;
        break;
      default:
        redirectUrl = "";
    }
    if (redirectUrl) {
      window.open(redirectUrl, "_blank");
    }
  };

  return (
    <div id="applet-container" className="font-sans text-stone-800 bg-brand-cream/40 min-h-screen selection:bg-brand-fresh/30 selection:text-brand-brown-dark relative">
      
      {/* 1. Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            id="loading-screen"
            className="fixed inset-0 bg-brand-cream z-80 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-brand-green/20 relative overflow-hidden"
                animate={{ 
                  scale: [1, 1.1, 1], 
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  ease: "easeInOut" 
                }}
              >
                {/* Visual design representation of fresh coconut shell / leaf */}
                <div className="absolute top-0 w-full h-1/2 bg-brand-fresh/20"></div>
                <Coffee className="w-12 h-12 text-brand-green relative z-10" />
              </motion.div>
              
              {/* Spinning decorative ring */}
              <div className="w-32 h-32 border-4 border-dashed border-brand-green/30 rounded-full absolute -top-4 animate-spin" style={{ animationDuration: '10s' }}></div>

              <h1 className="mt-8 font-heading text-2xl font-bold tracking-wider text-brand-brown-dark flex items-center gap-1">
                Kedai <span className="text-brand-green">Rasa Rasa</span>
              </h1>
              <p className="text-stone-500 text-sm mt-2 font-alt tracking-widest uppercase">Segar • Nikmat • Higienis</p>
              
              <div className="mt-8 w-40 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-brand-green h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Glassmorphism Sticky Navbar */}
      <header 
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "glass-effect py-3.5 shadow-md border-b border-brand-fresh/20" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand title */}
          <button 
            id="nav-logo"
            onClick={() => scrollToSection("home")} 
            className="flex items-center gap-2.5 focus:outline-none cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-full bg-brand-fresh flex items-center justify-center text-white shadow-md relative overflow-hidden transition-transform duration-300 hover:scale-110">
              <span className="font-heading font-extrabold text-xl relative z-10">K</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-green to-teal-400 opacity-60"></div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg sm:text-xl text-brand-brown-dark tracking-tight block">
                Kedai <span className="text-brand-green">Rasa Rasa</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-alt text-brand-brown font-medium -mt-1 block">Minuman Tradisional</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { label: "Mulai", id: "home" },
              { label: "Menu", id: "menu" },
              { label: "Promo Spesial", id: "promo", badge: "Live" },
              { label: "Tentang Kami", id: "tentang" },
              { label: "Lokasi", id: "lokasi" },
              { label: "Hubungi", id: "kontak" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`relative px-4 py-2 rounded-full font-heading text-sm font-semibold transition-all duration-300 hover:text-brand-green hover:bg-brand-green/5 cursor-pointer flex items-center gap-1 ${
                  activeTab === tab.id 
                    ? "text-brand-green bg-brand-green/10" 
                    : "text-stone-700"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] text-white font-extrabold px-1 rounded-full animate-pulse border border-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Call to action & Menu Toggle */}
          <div className="flex items-center gap-3">
            <button 
              id="header-cta-btn"
              onClick={() => scrollToSection("menu")}
              className="hidden sm:flex items-center gap-2 bg-brand-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-brand-green/20 hover:bg-green-600 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Pesan Sekarang
            </button>

            {/* Mobile Menu Toggle button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {[
                  { label: "Home", id: "home" },
                  { label: "Menu Minuman Segar", id: "menu" },
                  { label: "Promo & Diskon Hari Ini", id: "promo" },
                  { label: "Tentang Kedai Kami", id: "tentang" },
                  { label: "Jam & Lokasi Cabang", id: "lokasi" },
                  { label: "Kontak / Pesan WhatsApp", id: "kontak" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`w-full text-left px-5 py-3 rounded-xl font-heading text-base font-semibold block transition ${
                      activeTab === tab.id 
                        ? "bg-brand-green/10 text-brand-green" 
                        : "hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-stone-100">
                  <button
                    onClick={() => scrollToSection("menu")}
                    className="w-full text-center flex items-center justify-center gap-2 bg-brand-green text-white font-heading font-bold py-3.5 rounded-xl shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Buka Menu Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Hero Section (Landing Page) */}
      <section 
        id="home"
        className="min-h-screen pt-24 sm:pt-28 md:pt-36 pb-16 flex items-center relative overflow-hidden"
      >
        {/* Dynamic Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Top-right soft circle accent */}
          <div className="absolute right-0 top-0 w-[45rem] h-[45rem] rounded-full bg-brand-fresh/15 blur-3xl -mr-48 -mt-48"></div>
          {/* Middle-left cream blob */}
          <div className="absolute left-0 top-1/2 w-[35rem] h-[35rem] rounded-full bg-brand-orange/5 blur-3xl -ml-40 -translate-y-1/2"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#2ecc71_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Dynamic badge */}
              <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-md border border-brand-fresh/30 mx-auto lg:mx-0">
                <span className="flex h-2.5 w-2.5 rounded-full bg-brand-green relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                </span>
                <span className="font-alt text-xs font-bold text-stone-700 tracking-wider uppercase">UMKM Tradisional Modern • 100% Organik</span>
              </div>

              {/* Main Headlines */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-stone-900 tracking-tight leading-none">
                  Segarnya <span className="text-brand-green relative inline-block">
                    Minuman
                    <span className="absolute bottom-1.5 left-0 w-full h-3 bg-brand-fresh/40 -z-10 rounded-full"></span>
                  </span> Tradisional dengan Rasa <span className="text-brand-brown">Istimewa</span>
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-stone-600 font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Kedai Rasa Rasa menghadirkan kembali aneka minuman khas nusantara dengan sentuhan modern, menyajikan kesegaran hakiki dari kelapa degan murni, dawet legendaris, dan es teh istimewa.
                </p>
              </div>

              {/* Buttons Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-primary-btn"
                  onClick={() => scrollToSection("menu")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-brand-green text-white font-heading font-bold text-base rounded-full shadow-xl shadow-brand-green/30 hover:bg-green-600 hover:shadow-2xl hover:shadow-brand-green/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  Lihat Menu Minuman
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  id="hero-secondary-btn"
                  onClick={() => scrollToSection("kontak")}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-white border-2 border-stone-200 text-stone-700 font-heading font-bold text-base rounded-full hover:border-brand-green hover:text-brand-green shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-brand-orange" />
                  Hubungi Agen Toko
                </button>
              </div>

              {/* Trust Metric elements / Highlights */}
              <div className="pt-6 sm:pt-8 border-t border-stone-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="block text-2xl sm:text-3xl font-heading font-extrabold text-brand-green">100%</span>
                  <span className="text-xs text-stone-500 font-sans font-medium">Bahan Alami</span>
                </div>
                <div className="border-x border-stone-200">
                  <span className="block text-2xl sm:text-3xl font-heading font-extrabold text-brand-brown">Rp5k+</span>
                  <span className="text-xs text-stone-500 font-sans font-medium">Harga Ekonomis</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-heading font-extrabold text-brand-orange">4.9★</span>
                  <span className="text-xs text-stone-500 font-sans font-medium">Rating Kepuasan</span>
                </div>
              </div>

            </div>

            {/* Right Display Column (Aesthetic Graphic Showcase) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              
              {/* Outer decorative ring */}
              <div className="w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] rounded-full border-2 border-brand-green/10 absolute -z-10 animate-pulse"></div>
              <div className="w-[330px] h-[330px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-brand-brown/15 absolute -z-10 animate-spin" style={{ animationDuration: '25s' }}></div>

              {/* Main rounded frame showing premium drinks */}
              <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden p-3 bg-white/80 shadow-2xl border-4 border-brand-cream-dark">
                <img 
                  src={imgEsDegan} 
                  alt="Es Degan Kelapa Muda yang Memikat"
                  className="w-full h-full object-cover rounded-full animate-none hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded decorative tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center w-4/5">
                  <p className="font-heading font-bold text-lg leading-tight uppercase tracking-wider text-brand-fresh">Es Degan Asli</p>
                  <p className="text-xs text-stone-200 mt-1 font-sans">Kesegaran Kelapa Pilihan Terbaik</p>
                </div>
              </div>

              {/* Floating interactive bubble 1: Promo Diskon */}
              <div className="absolute -left-4 sm:-left-8 top-12 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-brand-fresh/30 animate-bounce flex items-center gap-3" style={{ animationDuration: '4s' }}>
                <span className="p-2 bg-brand-fresh/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-green" />
                </span>
                <div>
                  <span className="block text-xs font-sans text-stone-500 uppercase tracking-widest font-bold">Promo Hari Ini</span>
                  <span className="block font-heading font-extrabold text-[#e056fd] text-xs sm:text-sm">Beli 2 Gratis 1 Es Teh</span>
                </div>
              </div>

              {/* Floating interactive bubble 2: Order Speed Info */}
              <div className="absolute -right-4 top-2/3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-brand-orange/30 animate-bounce flex items-center gap-3" style={{ animationDuration: '3.5s' }}>
                <span className="p-2 bg-brand-orange/15 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand-orange" />
                </span>
                <div>
                  <span className="block text-xs font-sans text-stone-500 font-bold uppercase tracking-widest">Kirim Instan</span>
                  <span className="block font-heading font-extrabold text-stone-850 text-xs sm:text-sm">Siap Antar Instan ⚡</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. Section Keunggulan Kedai (Why Choose Us) */}
      <section 
        className="py-20 bg-brand-cream-dark/40 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-alt text-xs font-extrabold text-brand-green tracking-widest uppercase block">Mengapa Kedai Rasa Rasa</h2>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-stone-900 leading-tight">
              Kesegaran Tradisional, Kualitas Premium
            </h3>
            <p className="text-stone-600 font-sans text-base max-w-xl mx-auto">
              Komitmen kami adalah menyajikan minuman tidak hanya manis menyegarkan, melainkan sehat, higienis, dan terbuat dari resep bahan-bahan berstandar tinggi.
            </p>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Bahan Segar Organik",
                desc: "Kelapa muda degan dipotong langsung saat Anda memesan, santan peras asli tanpa bahan pengawet sintesis.",
                iconColor: "bg-emerald-100 text-brand-green",
                borderColor: "hover:border-emerald-300",
                shadowColor: "hover:shadow-emerald-100",
              },
              {
                title: "Harga Sangat Terjangkau",
                desc: "Kesegaran premium istimewa yang bisa dinikmati oleh semua lapisan masyarakat mulai dari Rp5.000 saja.",
                iconColor: "bg-amber-100 text-brand-orange",
                borderColor: "hover:border-amber-350",
                shadowColor: "hover:shadow-amber-100",
              },
              {
                title: "Rasa Berkualitas Konsisten",
                desc: "Racikan sirup gula jawa murni kental dan teh melati pilihan menghasilkan cita rasa legendaris autentik.",
                iconColor: "bg-yellow-101 bg-orange-50 text-[#f0932b]",
                borderColor: "hover:border-orange-300",
                shadowColor: "hover:shadow-orange-100",
              },
              {
                title: "Pelayanan Ramah & Higienis",
                desc: "Semua es dibuat dengan es kristal steril, peralatan higienis, disajikan oleh tim dengan senyum tulus ramah.",
                iconColor: "bg-sky-101 bg-sky-50 text-sky-600",
                borderColor: "hover:border-sky-300",
                shadowColor: "hover:shadow-sky-100",
              }
            ].map((adv, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-3xl shadow-sm border border-stone-100 transition-all duration-300 cursor-pointer ${adv.borderColor} ${adv.shadowColor} hover:-translate-y-1.5`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${adv.iconColor} font-bold text-xl mb-6 shadow-md shadow-black/5`}>
                  <Sparkle className="w-7 h-7" />
                </div>
                
                <h4 className="font-heading font-extrabold text-lg text-stone-900 mb-2">{adv.title}</h4>
                <p className="text-stone-650 font-sans text-sm leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Section Menu Minuman */}
      <section 
        id="menu"
        className="py-20 md:py-28 relative scroll-mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header block menu */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <h2 className="font-alt text-xs font-extrabold text-brand-green tracking-widest uppercase block">Menu Autentik Kami</h2>
              <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-stone-900 leading-tight">
                Tiga Varian Rasa Istimewa Menanti Anda
              </h3>
              <p className="text-stone-650 font-sans text-base">
                Setiap menu disajikan segar, higienis, dan dapat disesuaikan tingkat kemanisan serta topping pilihan Anda. Klik beli untuk melakukan pemesanan instan ke WhatsApp.
              </p>
            </div>
            
            <div className="hidden md:block">
              <span className="text-xs font-sans text-stone-500 font-bold block mb-2 text-right">Butuh bantuan konsultasi rasa?</span>
              <button 
                onClick={() => scrollToSection("kontak")}
                className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-heading font-bold text-sm px-6 py-3 rounded-full shadow-sm hover:shadow transition"
              >
                Hubungi Kami Langsung
              </button>
            </div>
          </div>

          {/* Cards Grid Grid for are of ONLY 3 Menu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MENU_ITEMS.map((item) => (
              <div 
                key={item.id}
                id={`menu-card-${item.id}`}
                className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl border border-stone-100 hover:border-brand-fresh/40 transition-all duration-500 flex flex-col group relative"
              >
                
                {/* Promo Badge on card header */}
                {item.tag && (
                  <span className={`absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full text-xs font-heading font-extrabold shadow-sm border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                )}

                {/* Favorite Button on Card corner */}
                <button 
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-stone-400 hover:text-red-500 hover:scale-115 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    const btn = e.currentTarget;
                    btn.classList.toggle('text-red-500');
                    btn.classList.toggle('text-stone-400');
                  }}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>

                {/* Card Thumbnail / Container */}
                <div className="relative h-64 overflow-hidden bg-brand-cream-dark/30">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover dark overlay banner trigger */}
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => triggerOrderModal(item)}
                      className="bg-white text-stone-900 font-heading font-extrabold text-sm px-6 py-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-350 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-brand-green" />
                      Sesuaikan Topping
                    </button>
                  </div>
                </div>

                {/* Description Column */}
                <div className="p-8 flex-grow flex flex-col space-y-4">
                  
                  {/* Rating star panel */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-500">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-xs text-stone-500 font-bold ml-1.5 font-alt">5.0 (Review)</span>
                    </div>
                    <span className="text-xs font-sans text-brand-green font-semibold bg-brand-fresh/10 px-2.5 py-1 rounded-full">
                      {item.sales}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-2xl text-stone-900 block tracking-tight group-hover:text-brand-green transition duration-300">
                    {item.name}
                  </h4>
                  
                  <p className="text-stone-600 font-sans text-sm leading-relaxed flex-grow">
                    {item.description}
                  </p>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-stone-400 text-xs font-sans block uppercase tracking-wider font-bold">Harga Bersih</span>
                      <span className="font-heading font-extrabold text-2xl text-stone-900">
                        Rp{item.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => triggerOrderModal(item)}
                      className="px-6 py-3 bg-brand-green hover:bg-green-600 text-white font-heading font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      Pesan Sekarang
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Section Promo dan Diskon (Banner & Live countdown) */}
      <section 
        id="promo"
        className="py-20 bg-stone-900 text-white relative overflow-hidden scroll-mt-10"
      >
        {/* Background visual graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-brand-green blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-orange blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 rounded-full text-xs font-heading font-semibold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Flash Promo Terbatas
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading font-extrabold text-white leading-tight">
              Nikmati Promo Kedai Rasa Rasa Hari Ini
            </h3>
            
            {/* Real-time Countdown displaying hours:minutes:seconds:millis */}
            <div className="pt-6 pb-2 flex flex-wrap justify-center items-center gap-4 text-center">
              <span className="text-stone-400 font-alt font-semibold text-xs sm:text-sm uppercase tracking-wider w-full block mb-2">PROMO BERAKHIR DALAM:</span>
              
              <div className="bg-stone-800 border border-stone-700/60 w-16 sm:w-20 py-3 rounded-2xl">
                <span className="block font-heading font-extrabold text-xl sm:text-3xl text-brand-fresh">{timeLeft.hours}</span>
                <span className="text-[10px] text-stone-400 uppercase font-sans tracking-widest">Jam</span>
              </div>
              <span className="text-2xl font-bold font-heading text-brand-fresh -mt-4">:</span>
              
              <div className="bg-stone-800 border border-stone-700/60 w-16 sm:w-20 py-3 rounded-2xl">
                <span className="block font-heading font-extrabold text-xl sm:text-3xl text-brand-fresh">{timeLeft.minutes}</span>
                <span className="text-[10px] text-stone-400 uppercase font-sans tracking-widest">Menit</span>
              </div>
              <span className="text-2xl font-bold font-heading text-brand-fresh -mt-4">:</span>

              <div className="bg-stone-800 border border-stone-700/60 w-16 sm:w-20 py-3 rounded-2xl">
                <span className="block font-heading font-extrabold text-xl sm:text-3xl text-brand-fresh">{timeLeft.seconds}</span>
                <span className="text-[10px] text-stone-400 uppercase font-sans tracking-widest">Detik</span>
              </div>
            </div>

          </div>

          {/* Promo Items Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Promo 1 Card */}
            <div className="bg-stone-800/80 border border-stone-700 rounded-3xl p-8 relative overflow-hidden group hover:border-brand-green/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/10 rounded-bl-full pointer-events-none"></div>
              <span className="inline-block px-3 py-1 bg-brand-green/25 text-brand-fresh font-alt font-extrabold text-xs rounded-full uppercase tracking-widest mb-6">PROMO UTAMA</span>
              
              <h4 className="font-heading font-extrabold text-2xl mb-4 leading-snug">
                Beli <span className="text-brand-fresh text-3xl">2</span> Gratis <span className="text-brand-orange text-3xl">1</span> Es Teh Manis
              </h4>
              <p className="text-stone-400 font-sans text-sm mb-6 leading-relaxed">
                Pembelian menu apa saja sebanyak 2 cup berhak mendapatkan bonus cuma-cuma 1 cup Es Teh melati segar beraroma khas.
              </p>
              <div className="text-xs text-stone-500 italic pb-6 border-b border-stone-700">
                * Berlaku setiap kelipatan pembelian
              </div>
              
              <button 
                onClick={() => scrollToSection("kontak")} 
                className="mt-6 w-full text-center block bg-brand-green text-white font-heading font-bold text-sm py-3 px-6 rounded-xl hover:bg-green-600 transition"
              >
                Klaim Promo Ini
              </button>
            </div>

            {/* Promo 2 Card */}
            <div className="bg-stone-800/80 border border-stone-700 rounded-3xl p-8 relative overflow-hidden group hover:border-brand-orange/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/15 rounded-bl-full pointer-events-none"></div>
              <span className="inline-block px-3 py-1 bg-brand-orange/20 text-[#f0932b] font-alt font-extrabold text-xs rounded-full uppercase tracking-widest mb-6">SPESIAL HEMAT</span>
              
              <h4 className="font-heading font-extrabold text-2xl mb-4 leading-snug">
                Diskon <span className="text-brand-orange text-3xl">15%</span> Minimal Belanja Rp25k
              </h4>
              <p className="text-stone-400 font-sans text-sm mb-6 leading-relaxed">
                Nikmati potongan harga langsung up to sebesar 15% untuk setiap struk pembelanjaan menu varian rasa apa saja minimal Rp25.000.
              </p>
              <div className="text-xs text-stone-500 italic pb-6 border-b border-stone-700">
                * Promo khusus pemesanan hari ini
              </div>
              
              <button 
                onClick={() => {
                  setOrderNote("Menggunakan Promo Diskon 15%");
                  scrollToSection("menu");
                }} 
                className="mt-6 w-full text-center block bg-brand-orange text-white font-heading font-bold text-sm py-3 px-6 rounded-xl hover:bg-amber-600 transition"
              >
                Beli Sekarang (Diskon)
              </button>
            </div>

            {/* Promo 3 Card */}
            <div className="bg-gradient-to-br from-brand-brown-dark to-stone-900 border border-brand-brown/40 rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg hover:shadow-brand-brown-dark/20 transition-all duration-300 pulse-glow-green">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-fresh/10 rounded-full blur-xl pointer-events-none"></div>
              <span className="inline-block px-3 py-1 bg-brand-fresh text-stone-900 font-alt font-extrabold text-[10px] rounded-full uppercase tracking-widest mb-6 border border-white/20">AKHIR PEKAN</span>
              
              <h4 className="font-heading font-extrabold text-2xl mb-4 leading-snug">
                Promo Weekend <span className="text-[#f9ca24] text-3xl block font-alt font-black tracking-wide">SPESIAL RASA</span>
              </h4>
              <p className="text-stone-200 font-sans text-sm mb-6 leading-relaxed">
                Dapatkan merchandise atau sticker aesthetic brand original Kedai Rasa Rasa secara gratis setiap weekend untuk ceriakan harimu.
              </p>
              <div className="text-xs text-stone-400 italic pb-6 border-b border-white/10">
                * Terbatas selama persediaan masih ada
              </div>
              
              <button 
                onClick={() => scrollToSection("menu")} 
                className="mt-6 w-full text-center block bg-white text-stone-900 font-heading font-bold text-sm py-3 px-6 rounded-xl hover:bg-stone-100 transition"
              >
                Lihat Hari Operasional
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Section Tentang Kedai (About Us) */}
      <section 
        id="tentang"
        className="py-20 md:py-28 relative scroll-mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-fresh/20 rounded-full z-0 pointer-events-none"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-orange/15 rounded-full z-0 pointer-events-none animate-pulse"></div>
              
              {/* Image Frame */}
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
                <img 
                  src={imgAboutKedai} 
                  alt="Aesthetic Wood Beverage Stall of Kedai Rasa Rasa"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual float signpost card */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-brand-fresh/30 max-w-xs">
                  <p className="font-heading font-extrabold text-xs text-brand-green uppercase tracking-wide">Didirikan Tahun 2026</p>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5 leading-snug">Menjaga resep cita rasa lokal Nusantara terus dicintai generasi modern muda.</p>
                </div>
              </div>
            </div>

            {/* Right Story Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-4">
                <span className="font-alt text-xs font-extrabold text-brand-green tracking-widest uppercase block">Tentang Kedai Kami</span>
                <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-stone-900 tracking-tight leading-none">
                  Melestarikan Kesegaran Nusantara Dengan Sentuhan Modern
                </h3>
              </div>

              <div className="space-y-4 text-stone-650 font-sans text-base leading-relaxed">
                <p>
                  <strong className="text-brand-brown-dark font-heading">Kedai Rasa Rasa</strong> adalah UMKM minuman segar terkemuka yang menghadirkan cita rasa tradisional dengan standar kualitas premium terbaik. Terlahir dari kecintaan kami terhadap kekayaan rasa kuliner khas nusantara, kami mendedikasikan diri untuk meramu es tradisional berkualitas tinggi yang sehat, bersih, dan ramah kantong.
                </p>
                <p>
                  Kami meyakini bahwa minuman legendaris seperti kelapa muda degan segar dan es dawet santan murni memiliki kesegaran tiada tanding. Dengan mengutamakan sterilitas bahan masukan, penggunaan es batu kristal termonitor serta manis murni dari gula tebu dan gula aren pilihan, kami bangga dapat menyajikan keaslian rasa alami tanpa pemanis buatan.
                </p>
              </div>

              <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-fresh text-stone-900 flex items-center justify-center font-bold text-xs shrink-0 mt-1">✓</span>
                  <div>
                    <span className="block font-heading font-bold text-stone-900 text-sm">Resep Turun Temurun</span>
                    <span className="text-xs text-stone-500 block">Rasa dawet gurih manis yang konsisten</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-fresh text-stone-900 flex items-center justify-center font-bold text-xs shrink-0 mt-1">✓</span>
                  <div>
                    <span className="block font-heading font-bold text-stone-900 text-sm">Higienitas Terjamin</span>
                    <span className="text-xs text-stone-500 block">Sertifikasi higienitas alat dan es kristal murni</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 8. Section Lokasi dan Jam Operasional */}
      <section 
        id="lokasi"
        className="py-20 bg-brand-cream/50 relative scroll-mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Card Information */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <span className="font-alt text-xs font-extrabold text-brand-green tracking-widest uppercase block font-bold">Kunjungi Kedai</span>
                <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-stone-900 leading-tight">
                  Lokasi Toko & Jam Operasional
                </h3>
                <p className="text-stone-600 font-sans text-sm md:text-base">
                  Kedai kami berlokasi strategis di pusat kota, sangat sejuk, bersih, dan asyik sebagai tempat singgah istirahat siang hari Anda dari rutinitas.
                </p>
              </div>

              {/* Grid cards for location parameters */}
              <div className="space-y-4 py-4">
                
                {/* 1. Address card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-heading font-bold text-stone-900 text-sm">Alamat Utama</span>
                    <p className="text-xs text-stone-600 mt-1">Jl Raya Ponorogo Rt 01 Rw 01, Desa Jatisari, Kec. Geger, Kab. Madiun</p>
                  </div>
                </div>

                {/* 2. Opening hours card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-green flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-heading font-bold text-stone-900 text-sm">Jam Layanan</span>
                    <div className="text-xs text-stone-600 mt-1 flex justify-between items-center w-full gap-4">
                      <span>Senin – Minggu (Setiap Hari)</span>
                      <span className="font-heading font-extrabold text-brand-green">08.00 – 21.00 WIB</span>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <a 
                  href="https://maps.app.goo.gl/Lrt6JHG6tR2Y7LWh8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-green hover:bg-green-600 text-white font-heading font-bold text-sm rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group"
                  style={{ boxShadow: "0 4px 20px -2px rgba(136, 176, 75, 0.4)" }}
                >
                  <MapPin className="w-4 h-4 text-white group-hover:animate-bounce" />
                  Lihat Lokasi Kedai
                </a>
              </div>

            </div>

            {/* Right Map Placeholder and Iframe embedding */}
            <div className="lg:col-span-7">
              <div className="bg-white p-3 rounded-[2.5rem] shadow-xl border border-stone-100 h-96 sm:h-[28rem] relative overflow-hidden group">
                
                {/* Fully interactive styled Google Map Placeholder Frame representing Jl. Kedai Bahagia */}
                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-stone-100 relative">
                  
                  {/* Subtle map vector graphic look alike or standard iframe */}
                  <iframe
                    title="Peta Kedai Rasa Rasa"
                    src="https://maps.google.com/maps?q=Jl%20Raya%20Ponorogo%20Rt%2001%20Rw%2001%2C%20Desa%20Jatisari%2C%20Kec%20Geger%2C%20Kab%20Madiun&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    className="absolute inset-0 grayscale contrast-110 opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                  ></iframe>

                  {/* Aesthetic location label tag on central top */}
                  <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl text-white text-xs pointer-events-none shadow-md flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-brand-fresh animate-ping"></span>
                    <span className="font-heading font-semibold">Toko Kedai Rasa Rasa (Desa Jatisari, Geger, Madiun)</span>
                  </div>

                  {/* Dark overlay showing distance info */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-brand-green/20 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-xs text-stone-900">Area Layanan Pengiriman Gratis</h4>
                      <p className="text-[10px] text-stone-500 font-sans mt-0.5">Ongkos kirim gratis mencakup radius hingga sejauh 3 KM dari lokasi Kedai.</p>
                    </div>
                    <button 
                      onClick={() => scrollToSection("kontak")}
                      className="bg-brand-green text-white font-heading font-extrabold text-[11px] px-3.5 py-2 rounded-lg"
                    >
                      Kirim Sekarang
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. Section Testimoni Pelanggan (JavaScript Slider Slider) */}
      <section 
        className="py-20 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="font-alt text-xs font-extrabold text-brand-green tracking-widest uppercase block font-bold">Umpan Balik</span>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-stone-900 tracking-tight leading-none">
              Apa Kata Pelanggan Setia Kami?
            </h3>
            <p className="text-stone-650 font-sans text-sm md:text-base">
              Kisah nyata dan tanggapan jujur dari mereka yang telah merasakan langsung sensasi kesegaran orisinal dari Kedai Rasa Rasa.
            </p>
          </div>

          {/* Testimonial Panel Slider container */}
          <div className="max-w-4xl mx-auto relative px-4">
            
            <div className="relative overflow-hidden min-h-[300px] md:min-h-[220px] bg-brand-cream/30 border border-brand-fresh/20 rounded-[2.5rem] p-8 sm:p-12 shadow-xl flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col md:flex-row gap-6 md:gap-8 items-center"
                >
                  {/* Photo area */}
                  <div className="relative shrink-0">
                    <img 
                      src={TESTIMONIALS[currentTestimonial].image} 
                      alt={TESTIMONIALS[currentTestimonial].name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-green/20 rounded-full scale-105 animate-pulse"></div>
                  </div>

                  {/* Content copy area */}
                  <div className="space-y-4 text-center md:text-left flex-grow">
                    
                    {/* Stars bar */}
                    <div className="flex justify-center md:justify-start items-center text-amber-500 gap-0.5">
                      {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>

                    <p className="text-stone-700 italic font-sans text-base leading-relaxed">
                      "{TESTIMONIALS[currentTestimonial].comment}"
                    </p>

                    <div>
                      <span className="block font-heading font-extrabold text-stone-900 text-base">{TESTIMONIALS[currentTestimonial].name}</span>
                      <span className="text-xs text-stone-500 font-alt font-medium tracking-wide">{TESTIMONIALS[currentTestimonial].role}</span>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Quotes watermark ornament absolute background */}
              <span className="absolute bottom-6 right-8 text-stone-200/50 font-heading text-8xl pointer-events-none font-bold select-none">”</span>
              <span className="absolute top-12 left-8 text-stone-200/55 font-heading text-8xl pointer-events-none font-bold select-none leading-none">“</span>

            </div>

            {/* Slider Switch buttons right/left */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => {
                  setCurrentTestimonial((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
                }}
                className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:border-brand-green hover:text-brand-green shadow-xs transition cursor-pointer"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentTestimonial === idx ? "bg-brand-green w-8" : "bg-stone-300 w-2.5"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  ></button>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
                }}
                className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:border-brand-green hover:text-brand-green shadow-xs transition cursor-pointer"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 10. Contact Section (WhatsApp form integration) */}
      <section 
        id="kontak"
        className="py-20 bg-brand-cream-dark/30 relative scroll-mt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left direct contact details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              
              <div className="space-y-4">
                <span className="font-alt text-xs font-extrabold text-brand-green tracking-widest uppercase block font-bold">Kirim Pesanan</span>
                <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-stone-900 leading-tight">
                  Tanyakan Sesuatu atau Pesan Sekarang
                </h3>
                <p className="text-stone-650 font-sans text-sm md:text-base leading-relaxed">
                  Ingin memesan dalam jumlah banyak atau katering untuk syukuran, rapat kantor, dan pesta pernikahan? Jangan ragu mengirimkan informasi kepada kami melalui kontak ataupun formulir pemesanan langsung di samping.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-4 py-2">
                
                {/* Channel WA */}
                <a 
                  href="https://wa.me/6289516459560" 
                  target="_blank" 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 hover:border-brand-green hover:shadow-md transition-all group"
                  referrerPolicy="no-referrer"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-stone-900 text-sm group-hover:text-brand-green transition">WhatsApp Center</span>
                    <span className="text-xs text-stone-500 italic block mt-0.5">0895-1645-9560 (Online Fast Response)</span>
                  </div>
                </a>

                {/* Channel Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 hover:border-[#e1306c] hover:shadow-md transition-all group"
                  referrerPolicy="no-referrer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e1306c]/10 text-[#e1306c] flex items-center justify-center shrink-0">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-stone-900 text-sm group-hover:text-[#e1306c] transition">Direct Instagram</span>
                    <span className="text-xs text-stone-500 block mt-0.5">@kedairasarasa</span>
                  </div>
                </a>

                {/* Channel Email */}
                <a 
                  href="mailto:info@kedairasarasa.com" 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 hover:border-sky-500 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-stone-900 text-sm group-hover:text-sky-500 transition">Email Bisnis Resmi</span>
                    <span className="text-xs text-stone-500 block mt-0.5">info@kedairasarasa.com</span>
                  </div>
                </a>

              </div>

              {/* Secure guarantee badge */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-brand-green/20 flex items-center gap-3">
                <Check className="w-5 h-5 text-brand-green shrink-0" />
                <p className="text-[11px] text-stone-600 font-sans">
                  Sistem pemesanan kami direct langsung ke Chat operator WhatsApp toko kami demi kenyamanan, respon secepat kilat, dan transparansi negosiasi.
                </p>
              </div>

            </div>

            {/* Right Form Reservation */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-stone-100">
                <div className="mb-6">
                  <h4 className="font-heading font-extrabold text-2xl text-stone-950 flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-brand-fresh/20 text-brand-green">🥤</span>
                    Form Pemesanan & Checkout
                  </h4>
                  <p className="text-stone-500 font-sans text-xs mt-1">Pesan minuman segar favorit Anda secara langsung dengan kalkulator ongkir otomatis & metode pembayaran terlengkap.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Step A: Data Pemesan */}
                  <div className="space-y-4 border-b border-stone-100 pb-5">
                    <h5 className="font-heading font-bold text-stone-900 text-sm tracking-wider uppercase">1. Data Pemesan</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-stone-700 uppercase tracking-wider mb-2">Nama Pemesan *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Nama Anda (misal: Sutan Sjahrir)"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:outline-none text-stone-850 text-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-heading font-bold text-stone-700 uppercase tracking-wider mb-2">Nomor WhatsApp *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="Nomor WA (misal: 081234567890)"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:outline-none text-stone-850 text-sm transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-heading font-bold text-stone-700 uppercase tracking-wider mb-2">Lokasi GPS Pemesan *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Klik 'Dapatkan Jarak Otomatis (GPS Geolocation)' di bawah atau isi link sharelock Google Maps..."
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:outline-none text-stone-850 text-xs font-mono transition"
                      />
                    </div>
                  </div>

                  {/* Step B: Detail Pesanan */}
                  <div className="space-y-4 border-b border-stone-100 pb-5">
                    <h5 className="font-heading font-bold text-stone-900 text-sm tracking-wider uppercase">2. Pilih Menu Minuman</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-stone-700 uppercase tracking-wider mb-2">Pilih Menu *</label>
                        <select 
                          value={formDrink}
                          onChange={(e) => setFormDrink(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:outline-none text-stone-800 text-sm bg-white transition cursor-pointer"
                        >
                          <option value="Es Degan (Rp5.000)">Es Degan (Rp5.000)</option>
                          <option value="Es Dawet (Rp5.000)">Es Dawet (Rp5.000)</option>
                          <option value="Es Teh (Rp5.000)">Es Teh (Rp5.000)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-stone-700 uppercase tracking-wider mb-2">Jumlah Pesanan (Cup) *</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="200" 
                          required
                          value={formQty}
                          onChange={(e) => setFormQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:outline-none text-stone-850 text-sm transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step C: Lokasi & Hitung Ongkir */}
                  <div className="space-y-4 border-b border-stone-100 pb-5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h5 className="font-heading font-bold text-stone-900 text-sm tracking-wider uppercase">3. Jarak Pengiriman (& Ongkir)</h5>
                      <span className="text-[10px] bg-brand-fresh/20 text-brand-black px-2.5 py-0.5 rounded-full font-sans font-semibold">
                        Geger, Madiun
                      </span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-stone-600 font-sans">Jarak Pengiriman:</span>
                        <span className="font-heading font-extrabold text-stone-900 text-sm bg-white py-1 px-3 rounded-lg border border-stone-200">
                          {formDistance} KM
                        </span>
                      </div>

                      {/* Slider Input Manual */}
                      <div className="space-y-1">
                        <input 
                          type="range" 
                          min="0.5" 
                          max="25" 
                          step="0.5"
                          value={formDistance}
                          onChange={(e) => {
                            setFormDistance(parseFloat(e.target.value));
                            setGpsSuccess(false);
                          }}
                          className="w-full accent-brand-green cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0.5 KM (Dekat)</span>
                          <span>25 KM (Jauh)</span>
                        </div>
                      </div>

                      {/* GPS Geolocation trigger */}
                      <div>
                        <button
                          type="button"
                          onClick={handleGPSLocation}
                          disabled={gpsLoading}
                          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition duration-300 disabled:opacity-55 cursor-pointer"
                        >
                          <Navigation className={`w-3.5 h-3.5 text-brand-fresh ${gpsLoading ? "animate-spin" : ""}`} />
                          {gpsLoading ? "Mendeteksi Geopotensial GPS..." : "Dapatkan Jarak Otomatis (GPS Geolocation)"}
                        </button>

                        {gpsSuccess && (
                          <div className="mt-2 text-[11px] text-emerald-600 font-sans flex items-center gap-1.5 justify-center bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            Lokasi terdeteksi! Jarak Anda terisi otomatis 🎯
                          </div>
                        )}

                        {gpsError && (
                          <div className="mt-2 text-[10px] text-red-500 font-sans text-center bg-red-50 border border-red-100 p-2 rounded-lg">
                            {gpsError}
                          </div>
                        )}
                      </div>

                      {/* Ongkir rate card */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/55">
                        <span className="text-xs text-stone-650 font-sans">Kalkulasi Ongkos Kirim:</span>
                        {formDistance <= 2 ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-heading font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                            GRATIS ONGKIR
                          </span>
                        ) : (
                          <span className="font-heading font-extrabold text-stone-950 text-sm">
                            Rp {new Intl.NumberFormat("id-ID").format(getDeliveryFee(formDistance))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step D: Metode Pembayaran */}
                  <div className="space-y-4 border-b border-stone-100 pb-5">
                    <h5 className="font-heading font-bold text-stone-900 text-sm tracking-wider uppercase">4. Pilih Metode Pembayaran</h5>
                    
                    {/* Modern Delivery App Card Layout */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: "COD", label: "COD", icon: "🤝" },
                        { id: "ShopeePay", label: "ShopeePay", icon: "🟠" },
                        { id: "GoPay", label: "GoPay", icon: "🔵" },
                        { id: "DANA", label: "DANA", icon: "💎" },
                        { id: "OVO", label: "OVO", icon: "🟣" },
                        { id: "SeaBank", label: "SeaBank", icon: "💰" }
                      ].map((pay) => (
                        <label 
                          key={pay.id} 
                          onClick={() => setFormPaymentMethod(pay.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                            formPaymentMethod === pay.id 
                              ? "bg-brand-green/10 border-brand-green shadow-xs font-bold ring-2 ring-brand-green/20" 
                              : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="payment_method" 
                            value={pay.id} 
                            checked={formPaymentMethod === pay.id}
                            onChange={() => {}} // Hooked via parent click
                            className="hidden"
                          />
                          <span className="text-lg">{pay.icon}</span>
                          <span className="text-xs text-stone-900 font-heading">{pay.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Conditional Payment instruction details */}
                    <AnimatePresence mode="wait">
                      {formPaymentMethod === "COD" ? (
                        <motion.div 
                          key="cod-active"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-amber-50 rounded-2xl border border-amber-200 p-4"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-amber-100 text-amber-900 text-[9px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-md border border-amber-300">
                              COD Available 🤝
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-750 font-sans leading-relaxed">
                            Pembayaran dilakukan cash di tempat langsung kepada kurir kami saat pesanan minuman diterima secara aman di alamat rumah Anda.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="e-wallet-active"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-brand-cream/40 rounded-2xl border border-brand-green/20 p-4 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-brand-green font-heading font-extrabold text-xs">
                              Transfer Pembayaran Digital ({formPaymentMethod})
                            </span>
                            <span className="text-[9px] text-stone-400 bg-white border px-2 py-0.5 rounded-md">
                              Instan
                            </span>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-stone-150 flex items-center justify-between gap-3 shadow-2xs">
                            <div>
                              <span className="block text-[10px] text-stone-400 uppercase font-alt font-extrabold tracking-wider">
                                Nomor Handphone / Rekening
                              </span>
                              <span className="block font-mono font-bold text-stone-900 text-sm">
                                {formPaymentMethod === "SeaBank" ? "901847321045" : "089516459560"}
                              </span>
                              <span className="block text-[10px] text-stone-500 mt-0.5">
                                A/N: Farelino Yudhika Pallevi
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyPayment(formPaymentMethod === "SeaBank" ? "901847321045" : "089516459560")}
                              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-[11px] font-heading font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
                            >
                              <Copy className="w-3 h-3 text-brand-fresh" />
                              {copiedText ? "Disalin!" : "Salin No"}
                            </button>
                          </div>

                          <p className="text-[11px] text-stone-600 font-sans leading-relaxed bg-brand-green/5 p-2 rounded-lg border border-brand-green/10">
                            💡 Silakan transfer tagihan Anda ke rekening di atas, simpan tangkapan layar (bukti transfer), lantas tekan tombol checkout di bawah untuk mengirim data langsung ke WhatsApp Kedai kami!
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Optional message input */}
                  <div>
                    <label className="block text-xs font-heading font-bold text-stone-700 uppercase tracking-wider mb-2">Catatan Tambahan (opsional)</label>
                    <textarea 
                      rows={2}
                      placeholder="Contoh: Tolong kurangi tingkat manisnya, atau es batu dipisah..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:outline-none text-stone-850 text-sm transition"
                    ></textarea>
                  </div>

                  {/* Realtime Pricing Summary Display */}
                  <div className="bg-stone-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Harga Subtotal menu:</span>
                      <span className="font-semibold text-white">
                        Rp {new Intl.NumberFormat("id-ID").format((DRINK_PRICES[formDrink] || 5000) * formQty)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-400 pb-2 border-b border-stone-800">
                      <span>Biaya Pengantaran (Ongkir):</span>
                      <span className="font-semibold text-white">
                        {formDistance <= 2 ? "GRATIS ONGKIR" : `Rp ${new Intl.NumberFormat("id-ID").format(getDeliveryFee(formDistance))}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-sm text-brand-fresh">TOTAL BAYAR:</span>
                      <span className="font-heading font-extrabold text-xl text-brand-fresh">
                        Rp {new Intl.NumberFormat("id-ID").format(((DRINK_PRICES[formDrink] || 5000) * formQty) + getDeliveryFee(formDistance))}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-brand-green hover:bg-green-600 text-white font-heading font-bold text-sm tracking-wide rounded-full shadow-lg hover:shadow-xl hover:shadow-brand-green/20 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition duration-300" />
                      Kirim Ke WhatsApp
                    </button>

                    {/* Pay Button */}
                    <button
                      type="button"
                      onClick={handleDirectPayment}
                      disabled={formPaymentMethod === "COD"}
                      className={`w-full py-4 font-heading font-bold text-sm tracking-wide rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
                        formPaymentMethod === "COD"
                          ? "bg-stone-800 text-stone-550 opacity-55 cursor-not-allowed"
                          : "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-xl hover:shadow-amber-500/20 cursor-pointer"
                      }`}
                    >
                      <span className="text-base select-none">💳</span>
                      Bayar Sekarang
                    </button>
                  </div>

                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-emerald-50 text-brand-green rounded-xl text-center text-xs font-medium font-heading border border-emerald-200"
                      >
                        Membuka WhatsApp... Harap selesaikan pemesanan di tab baru.
                      </motion.div>
                    )}
                  </AnimatePresence>

                </form>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. Customizer Interactive Food Specification Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            
            {/* Modal glass backdrop shadow overlay */}
            <motion.div 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            ></motion.div>

            {/* Modal Card body */}
            <motion.div 
              className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              
              {/* Image thumbnail header with close icon banner button */}
              <div className="h-44 bg-brand-cream relative">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent"></div>
                
                <h4 className="absolute bottom-4 left-6 text-2xl font-heading font-black text-white">{selectedItem.name}</h4>
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow text-stone-700 hover:text-stone-900 flex items-center justify-center hover:scale-105 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selection custom configuration parameters. Scrollable body if long. */}
              <div className="p-6 overflow-y-auto space-y-5 flex-grow no-scrollbar">
                
                {/* 1. Sugar level choice */}
                <div className="space-y-2.5">
                  <span className="block text-xs font-heading font-extrabold text-stone-800 uppercase tracking-widest">Tingkat Kemanisan *</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {["Kurang Manis", "Normal", "Sangat Manis"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedSugar(lvl)}
                        className={`py-2 px-3 rounded-xl border text-xs font-heading font-bold transition flex justify-center items-center gap-1.5 cursor-pointer ${
                          selectedSugar === lvl 
                            ? "bg-brand-green/10 text-brand-green border-brand-green/60" 
                            : "border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {selectedSugar === lvl && <Check className="w-3.5 h-3.5 text-brand-green" />}
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Ice Density level choice */}
                <div className="space-y-2.5">
                  <span className="block text-xs font-heading font-extrabold text-stone-800 uppercase tracking-widest">Tingkat Es Batu *</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {["Tanpa Es", "Sedikit Es", "Normal"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedIce(lvl)}
                        className={`py-2 px-3 rounded-xl border text-xs font-heading font-bold transition flex justify-center items-center gap-1.5 cursor-pointer ${
                          selectedIce === lvl 
                            ? "bg-brand-green/10 text-brand-green border-brand-green/60" 
                            : "border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {selectedIce === lvl && <Check className="w-3.5 h-3.5 text-brand-green" />}
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Extra premium toppings choice */}
                <div className="space-y-2.5">
                  <span className="block text-xs font-heading font-extrabold text-stone-800 uppercase tracking-widest">Tambahkan Topping Premium (Bisa Lebih dari 1)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TOPPINGS.map((top) => {
                      const isChecked = selectedToppings.includes(top.name);
                      return (
                        <button
                          key={top.name}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedToppings(selectedToppings.filter((t) => t !== top.name));
                            } else {
                              setSelectedToppings([...selectedToppings, top.name]);
                            }
                          }}
                          className={`p-3 rounded-xl border text-left text-xs font-sans font-medium transition flex items-center justify-between cursor-pointer ${
                            isChecked 
                              ? "bg-brand-fresh/10 border-brand-green/60 text-brand-brown-dark" 
                              : "border-stone-200 text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked ? "bg-brand-green border-brand-green text-white" : "border-stone-300"
                            }`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </span>
                            {top.name}
                          </span>
                          <span className="font-heading font-bold text-stone-900">+Rp{top.price.toLocaleString("id-ID")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Quantity modification counter & Notes area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  <div className="space-y-2">
                    <span className="block text-xs font-heading font-extrabold text-stone-800 uppercase tracking-widest">Jumlah Cup</span>
                    <div className="flex items-center">
                      <button 
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-10 h-10 rounded-l-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 h-10 border-y border-stone-200 flex items-center justify-center font-heading font-extrabold text-stone-900">
                        {orderQuantity}
                      </span>
                      <button 
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="w-10 h-10 rounded-r-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-heading font-extrabold text-stone-800 uppercase tracking-widest">Catatan Tambahan</span>
                    <input 
                      type="text" 
                      placeholder="Contoh: Pisah gula kawak-nya kak" 
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-250 text-xs focus:ring-1 focus:ring-brand-green focus:outline-none"
                    />
                  </div>

                </div>

              </div>

              {/* Sticky bottom price summary & button */}
              <div className="p-6 bg-brand-cream border-t border-brand-fresh/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-stone-500 font-sans block uppercase tracking-wider font-bold">Total Pembayaran</span>
                  <span className="font-heading font-extrabold text-2xl text-brand-green">
                    Rp{getModalTotalPrice().toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-heading font-bold rounded-full transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleConfirmOrder}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-brand-green hover:bg-green-600 text-white text-xs font-heading font-bold rounded-full shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Pesan Ke WhatsApp
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. Sticky Footer */}
      <footer 
        id="applet-footer"
        className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
            
            {/* Column 1: Brand details */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-stone-900 shadow font-heading font-bold">
                  K
                </div>
                <span className="font-heading font-extrabold text-xl text-white">Kedai <span className="text-brand-green">Rasa Rasa</span></span>
              </div>
              <p className="text-stone-400 text-sm max-w-sm font-sans leading-relaxed">
                Menyajikan aneka aneka minuman segar nusantara murni yang higienis dan higienis. Dari bahan kelapa tebu murni pilihan demi menjaga warisan cita rasa bangsa yang orisinal.
              </p>
              
              <div className="flex items-center gap-3 pt-3">
                <a href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full bg-stone-850 hover:bg-brand-green hover:text-white flex items-center justify-center transition border border-stone-850" aria-label="Instagram Page" referrerPolicy="no-referrer">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://wa.me/6289516459560" target="_blank" className="w-10 h-10 rounded-full bg-stone-850 hover:bg-brand-green hover:text-white flex items-center justify-center transition border border-stone-850" aria-label="WhatsApp Hotline" referrerPolicy="no-referrer">
                  <Phone className="w-5 h-5" />
                </a>
                <a href="mailto:info@kedairasarasa.com" className="w-10 h-10 rounded-full bg-stone-850 hover:bg-brand-green hover:text-white flex items-center justify-center transition border border-stone-850" aria-label="Official Email">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-heading font-bold text-white text-base">Navigasi Cepat</h4>
              <ul className="space-y-2.5 text-sm font-sans">
                {[
                  { name: "Beranda Utama", id: "home" },
                  { name: "Katalog Menu", id: "menu" },
                  { name: "Promo & Diskon", id: "promo" },
                  { name: "Tentang Kami", id: "tentang" },
                  { name: "Informasi Lokasi", id: "lokasi" }
                ].map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => scrollToSection(link.id)}
                      className="hover:text-brand-fresh transition text-left cursor-pointer"
                    >
                      • {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Safe Operating */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-heading font-bold text-white text-base">Jam Operasional Toko</h4>
              <p className="text-sm font-sans text-stone-400">
                Kami siap menyajikan kesegaran terbaik murni untuk menemani hari Anda dari pagi hingga menyambut malam:
              </p>
              
              <div className="space-y-1.5 text-xs font-alt">
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span>Senin - Minggu</span>
                  <span className="font-bold text-brand-fresh">08.00 - 21.00 WIB</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Hari Libur Nasional</span>
                  <span className="font-bold text-brand-fresh">Buka Seperti Biasa</span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500 font-sans flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 Kedai Rasa Rasa. Semua Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="flex items-center gap-1">
              Dibuat dengan penuh kehangatan <Heart className="w-3.5 h-3.5 text-brand-green fill-current inline-block" /> untuk kesegaran harian Anda.
            </p>
          </div>

        </div>
      </footer>

      {/* 11. Floating WhatsApp Button right bottom */}
      <a 
        href="https://wa.me/6289516459560" 
        target="_blank"
        id="floating-whatsapp-widget"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        aria-label="Direct Chat WhatsApp Kedai"
        referrerPolicy="no-referrer"
      >
        <Phone className="w-6 h-6 animate-pulse" />
        
        {/* Visual green beacon dot */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-black animate-bounce">
          1
        </span>
      </a>

      {/* 12. Floating Back To Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            id="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-7 z-40 bg-white/95 text-stone-700 hover:text-brand-green border border-stone-200 hover:border-brand-fresh rounded-full p-2.5 shadow-xl hover:scale-110 active:scale-95 transition"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            aria-label="Scroll Back to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
