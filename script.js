// ======================== SHARED DATA & LOGIC ========================
let currentUser = null;
const roomsData = [
    { id: 1, name: "Oceanic Presidential Suite", price: 890, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format", desc: "Private terrace, oceanfront, marble bath", capacity: 4, category: "Suite" },
    { id: 2, name: "Royal Heritage Suite", price: 540, img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format", desc: "Handcrafted furniture, city skyline view", capacity: 3, category: "Suite" },
    { id: 3, name: "Zen Garden Villa", price: 720, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format", desc: "Private garden, plunge pool, butler", capacity: 4, category: "Villa" },
    { id: 4, name: "Sky Penthouse", price: 1250, img: "https://images.unsplash.com/photo-1584132967338-7a5d2768fecd?w=600&auto=format", desc: "360° views, jacuzzi, private bar", capacity: 5, category: "Penthouse" },
    { id: 5, name: "Executive Business Room", price: 390, img: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=600&auto=format", desc: "Workspace, high-speed WiFi, express check-in", capacity: 2, category: "Deluxe" },
    { id: 6, name: "Family Deluxe Room", price: 470, img: "https://images.unsplash.com/photo-1582719500961-0d2efea1c3d1?w=600&auto=format", desc: "Two bedrooms, kid-friendly amenities", capacity: 5, category: "Deluxe" },
    { id: 7, name: "Mountain View Cabin", price: 320, img: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&auto=format", desc: "Cozy fireplace, mountain trekking nearby", capacity: 2, category: "Standard" },
    { id: 8, name: "Honeymoon Paradise", price: 650, img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&auto=format", desc: "Romantic decor, candle-light dinner setup", capacity: 2, category: "Suite" },
    { id: 9, name: "Safari Lodge", price: 410, img: "https://images.unsplash.com/photo-1493246318656-5bbd4afb09b7?w=600&auto=format", desc: "Wilderness view, eco-friendly interior", capacity: 3, category: "Standard" }
];

const testimonials = [
    { name: "Ananya Sharma", rating: 5, comment: "Best luxury stay in Mumbai! The service is top-notch." },
    { name: "Rahul Verma", rating: 5, comment: "Presidential suite was worth every penny. View is breathtaking." },
    { name: "John Smith", rating: 4, comment: "Loved the spa session. Highly recommended for relaxation." }
];

let allBookings = []; 

// Storage Management
function saveToLocal() {
    localStorage.setItem("grandvista_bookings", JSON.stringify(allBookings));
    if(currentUser) localStorage.setItem("grandvista_user", JSON.stringify(currentUser));
    else localStorage.removeItem("grandvista_user");
}

function loadLocalData() {
    const storedBook = localStorage.getItem("grandvista_bookings");
    if(storedBook) allBookings = JSON.parse(storedBook);
    const storedUser = localStorage.getItem("grandvista_user");
    if(storedUser) currentUser = JSON.parse(storedUser);
}

// Navigation Helper
function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Sticky Header Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.luxury-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Auth UI - Robust Single-Instance Logic
function updateAuthUI() {
    // Target both possible containers (Sidebar or Top Header)
    const sidebarWidget = document.getElementById("authWidgetSidebar");
    const topWidget = document.getElementById("authWidget");
    
    // Clear existing dynamic mobile auth to prevent duplication
    document.querySelectorAll(".auth-mobile-extra").forEach(el => el.remove());

    let authHTML = '';
    if(currentUser) {
        authHTML = `
            <div class="auth-group">
                <div class="user-greeting">
                    <i class="fas fa-user-circle"></i> <span>${currentUser.name}</span>
                </div>
                <button class="logoutBtnMain btn-outline-gold">Logout</button>
            </div>
        `;
    } else {
        authHTML = `
            <div class="auth-group">
                <button class="signinMainBtn btn-outline-gold">Sign In</button>
                <button class="signupMainBtn btn-gold">Sign Up</button>
            </div>
        `;
    }

    // Priority 1: Sidebar (Dashboard)
    if (sidebarWidget) {
        sidebarWidget.innerHTML = authHTML;
    } 
    // Priority 2: Top Header (Standard Pages)
    else if (topWidget) {
        topWidget.innerHTML = authHTML;
        
        // Handle Mobile Menu Injection (Only if sidebar doesn't exist)
        const mobileNav = document.getElementById("navMenu");
        if (mobileNav) {
            const mobileAuthDiv = document.createElement("div");
            mobileAuthDiv.className = "auth-mobile-extra"; // Use unique class for easy clearing
            mobileAuthDiv.innerHTML = authHTML;
            mobileNav.appendChild(mobileAuthDiv);
        }
    }

    // Attach listeners
    document.querySelectorAll(".logoutBtnMain").forEach(btn => btn.onclick = () => {
        currentUser = null;
        saveToLocal();
        window.location.reload();
    });
    document.querySelectorAll(".signinMainBtn").forEach(btn => btn.onclick = () => openAuthModal('signin'));
    document.querySelectorAll(".signupMainBtn").forEach(btn => btn.onclick = () => openAuthModal('signup'));
}

// Theme Switcher
function initTheme() {
    const savedTheme = localStorage.getItem("grandvista_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    const header = document.querySelector(".luxury-header");
    const toggleHTML = `<button class="theme-toggle" id="themeToggleBtn" title="Switch Theme">
        <i class="fas ${savedTheme === 'light' ? 'fa-moon' : 'fa-sun'}"></i>
    </button>`;
    
    // Add toggle to nav-menu if not exists
    const navMenu = document.getElementById("navMenu");
    if(navMenu && !document.getElementById("themeToggleBtn")) {
        navMenu.insertAdjacentHTML('beforeend', toggleHTML);
        document.getElementById("themeToggleBtn").addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("grandvista_theme", next);
            document.querySelector("#themeToggleBtn i").className = next === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("navMenu");
    if(btn && nav) {
        btn.onclick = () => nav.classList.toggle("active");
    }
}

// Auth Modal
let authMode = 'signin';
function openAuthModal(mode) {
    authMode = mode;
    let modal = document.getElementById("authModal");
    if(!modal) {
        const modalHTML = `
            <div id="authModal" class="modal-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:3000;">
                <div class="modal-container" style="background:var(--bg-card); padding:3rem; border-radius:1.5rem; width:90%; max-width:400px; position:relative; border: 1px solid var(--glass-border);">
                    <h3 id="authTitle" style="font-family:'Playfair Display'; font-size:2rem; color:var(--primary); margin-bottom:1.5rem;">Sign In</h3>
                    <input type="email" id="authEmail" placeholder="Email" style="width:100%; padding:1rem; margin-bottom:1rem; border-radius:0.5rem; border:1px solid var(--glass-border); background:var(--bg-main); color:var(--text-main);">
                    <input type="password" id="authPass" placeholder="Password" style="width:100%; padding:1rem; margin-bottom:1.5rem; border-radius:0.5rem; border:1px solid var(--glass-border); background:var(--bg-main); color:var(--text-main);">
                    <button id="authSubmit" class="btn-gold" style="width:100%; padding:1rem;">Continue</button>
                    <p id="authToggle" style="text-align:center; margin-top:1.5rem; cursor:pointer; color:var(--primary); font-size:0.9rem; font-weight:600;">New here? Create account</p>
                    <button onclick="document.getElementById('authModal').remove()" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.5rem; color:var(--text-muted); cursor:pointer;">&times;</button>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById("authModal");
        
        document.getElementById("authToggle").onclick = () => {
            authMode = authMode === 'signin' ? 'signup' : 'signin';
            document.getElementById("authTitle").innerText = authMode === 'signin' ? 'Sign In' : 'Sign Up';
            document.getElementById("authToggle").innerText = authMode === 'signin' ? 'New here? Create account' : 'Already have an account? Sign In';
        };
        
        document.getElementById("authSubmit").onclick = () => {
            const email = document.getElementById("authEmail").value;
            if(!email) return alert("Please enter email");
            currentUser = { email: email, name: email.split('@')[0] };
            saveToLocal();
            window.location.reload();
        };
    }
}

// Chatbot Logic
function initChatbot() {
    const chatbotHTML = `
        <div class="chatbot-trigger" id="chatbotTrigger"><i class="fas fa-comment-dots"></i></div>
        <div class="chatbot-window" id="chatbotWindow">
            <div style="background:var(--primary); padding:1.5rem; color:white; display:flex; justify-content:space-between; align-items:center;">
                <h4 style="font-family:'Playfair Display'">Vista AI Concierge</h4>
                <i class="fas fa-times" id="closeChat" style="cursor:pointer"></i>
            </div>
            <div id="chatMessages" style="flex:1; padding:1.5rem; overflow-y:auto; display:flex; flex-direction:column; gap:1rem;">
                <div style="background:var(--primary-light); color:var(--primary-dark); padding:1rem; border-radius:1rem; align-self:flex-start; font-size:0.9rem;">
                    Welcome to Grand Vista! I'm your eco-luxury concierge. How can I help you today?
                </div>
            </div>
            <div style="padding:1rem; border-top:1px solid var(--glass-border); display:flex; gap:0.5rem;">
                <input type="text" id="chatInput" placeholder="Ask anything..." style="flex:1; padding:0.8rem; border-radius:2rem; border:1px solid var(--glass-border); background:var(--bg-main); color:var(--text-main); font-size:0.9rem;">
                <button id="sendChat" style="background:var(--primary); color:white; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer;"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>`;
    
    if(!document.getElementById("chatbotTrigger")) {
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        const trigger = document.getElementById("chatbotTrigger");
        const windowEl = document.getElementById("chatbotWindow");
        const closeBtn = document.getElementById("closeChat");
        const input = document.getElementById("chatInput");
        const send = document.getElementById("sendChat");
        const messages = document.getElementById("chatMessages");

        trigger.onclick = () => windowEl.classList.toggle("active");
        closeBtn.onclick = () => windowEl.classList.remove("active");

        const addMsg = (text, type) => {
            const div = document.createElement("div");
            div.style.padding = "0.8rem 1.2rem";
            div.style.borderRadius = "1rem";
            div.style.fontSize = "0.9rem";
            div.style.maxWidth = "85%";
            if(type === 'user') {
                div.style.background = "var(--primary)";
                div.style.color = "white";
                div.style.alignSelf = "flex-end";
            } else {
                div.style.background = "var(--primary-light)";
                div.style.color = "var(--primary-dark)";
                div.style.alignSelf = "flex-start";
            }
            div.innerText = text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        };

        const handleChat = () => {
            const text = input.value.trim();
            if(!text) return;
            addMsg(text, 'user');
            input.value = "";
            
            let reply = "I'm not sure about that. Try asking about rooms, services, or locations!";
            const q = text.toLowerCase();
            if(q.includes("room")) reply = "We have suites, villas, and standard rooms starting at $320. Check our Accommodations page!";
            else if(q.includes("service")) reply = "We offer fine dining, royal spa, and an infinity pool. All eco-friendly!";
            else if(q.includes("location")) reply = "We are located at Marina Drive, Mumbai.";
            
            setTimeout(() => addMsg(reply, 'bot'), 600);
        };

        send.onclick = handleChat;
        input.onkeypress = (e) => { if(e.key === 'Enter') handleChat(); };
    }
}

// Global Load
document.addEventListener('DOMContentLoaded', () => {
    loadLocalData();
    initTheme();
    initNavigation();
    updateAuthUI();
    initMobileMenu();
    initChatbot();
});
