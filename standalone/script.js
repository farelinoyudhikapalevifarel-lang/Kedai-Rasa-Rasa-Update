/**
 * Kedai Rasa Rasa - Standalone JavaScript Handler
 * Features: Loading, sticky navbar, mobile drawer, interactive review slider, real-time promo countdown, WA integration.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loading Screen Handler
    const loadingScreen = document.getElementById("loading-screen");
    const loadingBar = document.getElementById("loading-bar");
    
    // Simulate loading completion
    if (loadingBar) {
        loadingBar.style.width = "100%";
    }
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add("fade-out");
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 600);
        }
    }, 1200);

    // 2. Glass Sticky Navbar Effect on Scroll
    const navbar = document.getElementById("main-navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("glass-effect", "shadow-md");
            navbar.classList.remove("py-5", "bg-transparent");
            navbar.classList.add("py-3.5");
        } else {
            navbar.classList.remove("glass-effect", "shadow-md", "py-3.5");
            navbar.classList.add("py-5", "bg-transparent");
        }
    });

    // 3. Mobile Navigation Toggle Drawer
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobilePanel = document.getElementById("mobile-nav-panel");
    
    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener("click", () => {
            mobilePanel.classList.toggle("hidden");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                if (icon.classList.contains("fa-bars")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close mobile drawer when links are selected
        const mobileLinks = mobilePanel.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobilePanel.classList.add("hidden");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // 4. Promo Countdown Timer (Counts down to 23:59:59 daily)
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function runCountdown() {
        const now = new Date();
        const target = new Date();
        target.setHours(23, 59, 59, 999);

        let diff = target.getTime() - now.getTime();
        
        if (diff <= 0) {
            diff = 0;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (hoursEl) hoursEl.textContent = h.toString().padStart(2, "0");
        if (minutesEl) minutesEl.textContent = m.toString().padStart(2, "0");
        if (secondsEl) secondsEl.textContent = s.toString().padStart(2, "0");
    }

    setInterval(runCountdown, 1000);
    runCountdown(); // Initial run

    // 5. Testimonial Carousel Slide Data
    window.testimonials = [
        {
            comment: "Es degannya segar banget! Pas diminum siang bolong sehabis olahraga.",
            name: "Andi Wijaya",
            role: "Tamu Kedai"
        },
        {
            comment: "Rasa Es Dawetnya authentic sekali! Santannya gurih bersih, gula merahnya kental.",
            name: "Siti Rahmawati",
            role: "Reviewer Kuliner"
        },
        {
            comment: "Tempat favorit sepulang kerja. Es teh melatimu harum dan murah meriah segar.",
            name: "Budi Santoso",
            role: "Warga Sekitar"
        }
    ];
    
    window.currentTestimonialIndex = 0;

    const testimonialComment = document.getElementById("testimonial-comment");
    const testimonialName = document.getElementById("testimonial-name");

    window.updateTestimonialUI = function() {
        const data = window.testimonials[window.currentTestimonialIndex];
        if (testimonialComment && testimonialName) {
            testimonialComment.style.opacity = 0;
            testimonialName.style.opacity = 0;
            
            setTimeout(() => {
                testimonialComment.textContent = `"${data.comment}"`;
                testimonialName.textContent = data.name;
                
                testimonialComment.style.opacity = 1;
                testimonialName.style.opacity = 1;
            }, 200);
        }
    };

    window.nextTestimonial = function() {
        window.currentTestimonialIndex = (window.currentTestimonialIndex + 1) % window.testimonials.length;
        window.updateTestimonialUI();
    };

    window.prevTestimonial = function() {
        window.currentTestimonialIndex = (window.currentTestimonialIndex - 1 + window.testimonials.length) % window.testimonials.length;
        window.updateTestimonialUI();
    };

    // Auto advancing slider slide every 6 seconds
    setInterval(() => {
        window.nextTestimonial();
    }, 6000);

    // 6. Direct WhatsApp Order Buttons from catalog
    window.orderViaWA = function(menuName) {
        const message = `Halo Kak Kedai Rasa Rasa! 👋\n\nSaya tertarik memesan menu segar ini:\n─────────────────────\n*Minuman:*  ${menuName}\n*Jumlah:*   1 Cup\n─────────────────────\nMohon segera diproses ya kak. Terima kasih! 🥤🌱`;
        const encodedText = encodeURIComponent(message);
        window.open(`https://wa.me/6289516459560?text=${encodedText}`, "_blank");
    };

    // --- AUTOMATED SHIPPING & CHECKOUT CALCULATION SYSTEM ---
    window.selectedPaymentMethodType = "COD";
    
    // Delivery Calculator Helper
    window.getDeliveryFee = function(distance) {
        if (distance <= 2) return 0;
        return Math.round(distance) * 1000;
    };

    window.formatIDRCurrency = function(value) {
        return "Rp " + new Intl.NumberFormat("id-ID").format(value);
    };

    window.runCalculations = function() {
        const drinkSelect = document.getElementById("v-drink");
        const qtyInput = document.getElementById("v-qty");
        const distanceSlider = document.getElementById("v-distance-slider");

        if (!drinkSelect || !qtyInput || !distanceSlider) return;

        const qty = Math.max(1, parseInt(qtyInput.value) || 1);
        const distance = parseFloat(distanceSlider.value);

        // Price lookup (All Drinks are Rp 5.000)
        const itemPrice = 5000;
        const subtotal = itemPrice * qty;
        const deliveryFee = window.getDeliveryFee(distance);
        const total = subtotal + deliveryFee;

        // Update displays
        const subtotalDisp = document.getElementById("v-subtotal-display");
        const ongkirDisp = document.getElementById("v-ongkir-display");
        const totalDisp = document.getElementById("v-total-display");

        if (subtotalDisp) subtotalDisp.innerText = window.formatIDRCurrency(subtotal);
        
        if (ongkirDisp) {
            if (deliveryFee === 0) {
                ongkirDisp.innerText = "GRATIS ONGKIR";
            } else {
                ongkirDisp.innerText = window.formatIDRCurrency(deliveryFee);
            }
        }

        if (totalDisp) totalDisp.innerText = window.formatIDRCurrency(total);

        // Update Slider Live Badge label
        const ongkirBadge = document.getElementById("v-ongkir-badge");
        const ongkirText = document.getElementById("v-ongkir-text");

        if (ongkirBadge && ongkirText) {
            if (deliveryFee === 0) {
                ongkirBadge.classList.remove("hidden");
                ongkirText.classList.add("hidden");
            } else {
                ongkirBadge.classList.add("hidden");
                ongkirText.classList.remove("hidden");
                ongkirText.innerText = window.formatIDRCurrency(deliveryFee);
            }
        }
    };

    window.handleDistanceSlider = function(val) {
        const distanceVal = document.getElementById("v-distance-val");
        if (distanceVal) distanceVal.innerText = parseFloat(val).toFixed(1);
        
        // Hide GPS success if manually sliding
        const gpsSuccess = document.getElementById("v-gps-success");
        if (gpsSuccess) gpsSuccess.classList.add("hidden");

        window.runCalculations();
    };

    window.getGPSLocation = function() {
        const gpsBtn = document.getElementById("v-gps-btn");
        const gpsIcon = document.getElementById("v-gps-icon");
        const gpsSuccess = document.getElementById("v-gps-success");
        const gpsError = document.getElementById("v-gps-error");
        
        if (!navigator.geolocation) {
            if (gpsError) {
                gpsError.classList.remove("hidden");
                gpsError.innerText = "Geolocation tidak didukung oleh browser Anda.";
            }
            return;
        }

        if (gpsBtn && gpsIcon) {
            gpsBtn.disabled = true;
            gpsIcon.className = "fa-solid fa-spinner animate-spin text-brand-fresh";
        }
        if (gpsError) gpsError.classList.add("hidden");
        if (gpsSuccess) gpsSuccess.classList.add("hidden");

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

                const roundedDist = Math.max(0.5, Math.round(distance * 2) / 2); // Quantize to nearest 0.5 KM
                const finalDist = Math.min(25, roundedDist); // Limit to slider max
                
                // Update elements
                const slider = document.getElementById("v-distance-slider");
                const distanceVal = document.getElementById("v-distance-val");
                const addressInput = document.getElementById("v-address");
                
                if (slider) slider.value = finalDist;
                if (distanceVal) distanceVal.innerText = finalDist.toFixed(1);
                if (addressInput) addressInput.value = `https://www.google.com/maps?q=${userLat},${userLng}`;

                if (gpsBtn && gpsIcon) {
                    gpsBtn.disabled = false;
                    gpsIcon.className = "fa-solid fa-crosshairs text-brand-fresh";
                }
                if (gpsSuccess) gpsSuccess.classList.remove("hidden");
                
                window.runCalculations();
            },
            () => {
                if (gpsBtn && gpsIcon) {
                    gpsBtn.disabled = false;
                    gpsIcon.className = "fa-solid fa-crosshairs text-brand-fresh";
                }
                if (gpsError) {
                    gpsError.classList.remove("hidden");
                    gpsError.innerText = "Gagal mendeteksi lokasi otomatis. Izinkan GPS perangkat Anda.";
                }
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    window.selectPaymentMethod = function(method) {
        window.selectedPaymentMethodType = method;
        
        // Remove active styled classes from all label elements
        const cards = document.querySelectorAll(".payment-method-card");
        cards.forEach(card => {
            card.className = "payment-method-card flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer border-stone-200 bg-white hover:border-stone-300 transition-all duration-300";
            const radio = card.querySelector("input[type='radio']");
            if (radio) radio.checked = false;
        });

        // Add active classes to selected card
        const selectedCard = document.getElementById("payment-card-" + method);
        if (selectedCard) {
            selectedCard.className = "payment-method-card flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer border-brand-green bg-brand-green/10 shadow-xs font-bold ring-2 ring-brand-green/20 transition-all duration-300";
            const radio = selectedCard.querySelector("input[type='radio']");
            if (radio) radio.checked = true;
        }

        // Handle descriptions details blocks display
        const codDetails = document.getElementById("v-payment-cod-details");
        const decDetails = document.getElementById("v-payment-digital-details");
        const valLabel = document.getElementById("v-digital-no");
        const walletTitle = document.getElementById("v-digital-method-title");
        const payBtn = document.getElementById("v-pay-btn");

        if (method === "COD") {
            if (codDetails) codDetails.classList.remove("hidden");
            if (decDetails) decDetails.classList.add("hidden");
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.className = "w-full py-4 bg-stone-800 text-stone-550 opacity-55 font-heading font-bold text-sm rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2 group cursor-not-allowed";
            }
        } else {
            if (codDetails) codDetails.classList.add("hidden");
            if (decDetails) decDetails.classList.remove("hidden");
            
            if (walletTitle) walletTitle.innerText = "Transfer Pembayaran Digital (" + method + ")";
            
            // Set Wallet Key Values
            if (valLabel) {
                 if (method === "SeaBank") {
                     valLabel.innerText = "901847321045";
                 } else {
                     valLabel.innerText = "089516459560";
                 }
            }
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.className = "w-full py-4 bg-amber-500 hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/20 text-white font-heading font-bold text-sm rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2 group cursor-pointer";
            }
        }
    };

    window.copyDigitalPaymentNo = function() {
        const noEl = document.getElementById("v-digital-no");
        const copyStatus = document.getElementById("v-copy-status");
        if (!noEl) return;

        const text = noEl.innerText;
        navigator.clipboard.writeText(text).then(() => {
            if (copyStatus) {
                copyStatus.innerText = "Disalin!";
                setTimeout(() => { copyStatus.innerText = "Salin No"; }, 2000);
            }
        }).catch(() => {
            // fallback
            try {
                const el = document.createElement('textarea');
                el.value = text;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                if (copyStatus) {
                    copyStatus.innerText = "Disalin!";
                    setTimeout(() => { copyStatus.innerText = "Salin No"; }, 2000);
                }
            } catch (err) {}
        });
    };

    // 7. Contact Reservation Form submissions
    window.handleVanillaSubmit = function(e) {
        e.preventDefault();
        
        const nameVal = document.getElementById("v-name").value;
        const phoneVal = document.getElementById("v-phone").value;
        const addressVal = document.getElementById("v-address").value;
        const drinkVal = document.getElementById("v-drink").value;
        const qtyVal = parseInt(document.getElementById("v-qty").value) || 1;
        const distanceSlider = document.getElementById("v-distance-slider");
        const msgVal = document.getElementById("v-msg").value;

        const dist = parseFloat(distanceSlider.value);
        const subtotal = 5000 * qtyVal;
        const ongkirFee = window.getDeliveryFee(dist);
        const total = subtotal + ongkirFee;

        const formatMessagePrice = function(num) {
            return "Rp " + new Intl.NumberFormat("id-ID").format(num);
        };

        const message = `Halo Kak Kedai Rasa Rasa! 🥤\n\nSaya ingin memesan menu segar lewat Website Standalone:\n─────────────────────\n*Nama Pemesan:*  ${nameVal}\n*No. WhatsApp:*  ${phoneVal || "-"}\n*Alamat:*        ${addressVal || "-"}\n*Jarak Kirim:*    ${dist} KM\n\n*Pesanan:*      ${drinkVal.split(" (")[0]} (${qtyVal} Cup)\n*Subtotal:*     ${formatMessagePrice(subtotal)}\n*Ongkos Kirim:* ${ongkirFee === 0 ? "GRATIS ONGKIR" : formatMessagePrice(ongkirFee)}\n*Total Bayar:*   ${formatMessagePrice(total)}\n\n*Metode Bayar:* ${window.selectedPaymentMethodType}\n*Catatan:*      _${msgVal || "-"}_ \n─────────────────────\nMohon segera diproses pesanannya ya kak. Terima kasih banyak 🙏✨`;

        const encodedText = encodeURIComponent(message);
        window.open(`https://wa.me/6289516459560?text=${encodedText}`, "_blank");

        if (window.selectedPaymentMethodType !== "COD") {
            const paymentPhone = window.selectedPaymentMethodType === "SeaBank" ? "901847321045" : "089516459560";
            let redirectUrl = "";
            switch (window.selectedPaymentMethodType) {
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
                setTimeout(function() {
                    window.location.href = redirectUrl;
                }, 1200);
            }
        }
    };

    window.directPaymentStandalone = function() {
        if (window.selectedPaymentMethodType === "COD") return;
        const paymentPhone = window.selectedPaymentMethodType === "SeaBank" ? "901847321045" : "089516459560";
        let redirectUrl = "";
        switch (window.selectedPaymentMethodType) {
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

    // Run calculations initially
    window.runCalculations();

});
