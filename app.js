// PulsaKu - Website Penjualan Pulsa Online
// Interactive JavaScript Application

// Global Variables
let currentUser = null;
let isLoggedIn = false;
let cart = [];
let transactions = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkLoginStatus();
    loadTransactionHistory();
});

// Initialize Application
function initializeApp() {
    console.log('🚀 PulsaKu Website Initialized!');
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup navbar scroll effect
    setupNavbarScroll();
    
    // Setup tabs functionality
    setupTabs();
    
    // Setup form validation
    setupFormValidation();
    
    // Load cart from localStorage
    loadCartFromStorage();
    
    // Initialize operator cards click handlers
    setupOperatorCards();
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Modal close events
    window.addEventListener('click', (e) => {
        const loginModal = document.getElementById('loginModal');
        const purchaseModal = document.getElementById('purchaseModal');
        
        if (e.target === loginModal) {
            closeLoginModal();
        }
        if (e.target === purchaseModal) {
            closePurchaseModal();
        }
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const purchaseForm = document.getElementById('purchaseForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchase);
    }
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Setup Tabs Functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Setup Operator Cards
function setupOperatorCards() {
    const operatorCards = document.querySelectorAll('.operator-card');
    
    operatorCards.forEach(card => {
        card.addEventListener('click', () => {
            const operator = card.getAttribute('data-operator');
            scrollToProduk();
            
            // Highlight selected operator products
            setTimeout(() => {
                highlightOperatorProducts(operator);
            }, 500);
        });
    });
}

function highlightOperatorProducts(operator) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const operatorIcon = card.querySelector(`.product-icon.${operator}`);
        if (operatorIcon) {
            card.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 1000);
        }
    });
}

// Authentication Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearForm('loginForm');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const phone = formData.get('phone');
    const password = formData.get('password');
    const rememberMe = formData.get('remember');
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Masuk...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (validateLogin(phone, password)) {
            // Successful login
            currentUser = {
                phone: phone,
                name: getNameFromPhone(phone),
                loginTime: new Date().toISOString()
            };
            
            isLoggedIn = true;
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(currentUser));
            }
            
            showNotification('Login berhasil! Selamat datang kembali.', 'success');
            closeLoginModal();
            updateUIForLoggedInUser();
            
        } else {
            showNotification('Nomor WhatsApp atau password salah. Silakan coba lagi.', 'error');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

function validateLogin(phone, password) {
    // Demo validation - in real app, this would be an API call
    const demoUsers = [
        { phone: '08123456789', password: 'admin123' },
        { phone: '08567890123', password: 'user123' },
        { phone: '08987654321', password: 'demo123' }
    ];
    
    return demoUsers.some(user => user.phone === phone && user.password === password);
}

function getNameFromPhone(phone) {
    // Simple name generation from phone number
    const names = ['Budi', 'Sari', 'Ahmad', 'Dewi', 'Rizki', 'Maya', 'Andi', 'Nina'];
    const index = parseInt(phone.slice(-1)) % names.length;
    return names[index];
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('transactions');
    cart = [];
    transactions = [];
    
    updateUIForLoggedOutUser();
    showNotification('Anda telah logout berhasil.', 'info');
}

function checkLoginStatus() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        currentUser = JSON.parse(rememberedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = showUserMenu;
    }
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Masuk';
        loginBtn.onclick = openLoginModal;
    }
}

function showUserMenu() {
    // Create user menu dropdown
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                <strong>${currentUser.name}</strong>
                <small>${currentUser.phone}</small>
            </div>
            <hr>
            <button onclick="showTransactionHistory()">Riwayat Transaksi</button>
            <button onclick="showProfile()">Profil Saya</button>
            <button onclick="showSupport()">Bantuan</button>
            <hr>
            <button onclick="logout()" class="logout-btn">Keluar</button>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Position menu
    const loginBtn = document.querySelector('.btn-login');
    const rect = loginBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 10 + 'px';
    menu.style.right = '2rem';
    menu.style.zIndex = '2001';
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeUserMenu, { once: true });
    }, 100);
}

function closeUserMenu() {
    const menu = document.querySelector('.user-menu');
    if (menu) menu.remove();
}

// Product Functions
function scrollToProduk() {
    const produkSection = document.getElementById('produk');
    if (produkSection) {
        const navHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = produkSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function showPriceList() {
    showNotification('Daftar harga lengkap sedang dimuat...', 'info');
    scrollToProduk();
}

function buyProduct(operator, nominal, price) {
    if (!isLoggedIn) {
        showNotification('Silakan masuk terlebih dahulu untuk melakukan pembelian.', 'warning');
        openLoginModal();
        return;
    }
    
    const productData = {
        operator: operator,
        nominal: nominal,
        price: price,
        type: getProductType(operator)
    };
    
    openPurchaseModal(productData);
}

function getProductType(operator) {
    if (operator.includes('data')) return 'Paket Data';
    if (operator === 'pln') return 'Token Listrik';
    if (operator === 'gopay') return 'E-Wallet';
    return 'Pulsa Reguler';
}

function openPurchaseModal(product) {
    const modal = document.getElementById('purchaseModal');
    const detailsDiv = document.getElementById('purchaseDetails');
    
    if (modal && detailsDiv) {
        // Populate product details
        const operatorName = getOperatorName(product.operator);
        const nominalText = typeof product.nominal === 'number' ? 
            `Rp ${product.nominal.toLocaleString('id-ID')}` : 
            product.nominal;
        
        detailsDiv.innerHTML = `
            <div class="purchase-summary">
                <div class="purchase-product">
                    <div class="purchase-operator ${product.operator.replace('-data', '')}">
                        <i class="${getOperatorIcon(product.operator)}"></i>
                    </div>
                    <div class="purchase-info">
                        <h4>${operatorName}</h4>
                        <p>${product.type} - ${nominalText}</p>
                    </div>
                </div>
                <div class="purchase-price">
                    Rp ${product.price.toLocaleString('id-ID')}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Store product in modal for form submission
        modal.dataset.product = JSON.stringify(product);
    }
}

function getOperatorName(operator) {
    const operators = {
        'telkomsel': 'Telkomsel',
        'telkomsel-data': 'Telkomsel',
        'xl': 'XL Axiata',
        'indosat': 'Indosat Ooredoo',
        'tri': '3 (Tri)',
        'smartfren': 'Smartfren',
        'axis': 'AXIS',
        'pln': 'PLN',
        'gopay': 'GoPay'
    };
    return operators[operator] || operator.toUpperCase();
}

function getOperatorIcon(operator) {
    const icons = {
        'telkomsel': 'fas fa-signal',
        'telkomsel-data': 'fas fa-signal',
        'xl': 'fas fa-wifi',
        'indosat': 'fas fa-broadcast-tower',
        'tri': 'fas fa-mobile-alt',
        'smartfren': 'fas fa-network-wired',
        'axis': 'fas fa-satellite-dish',
        'pln': 'fas fa-bolt',
        'gopay': 'fas fa-wallet'
    };
    return icons[operator] || 'fas fa-mobile-alt';
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearForm('purchaseForm');
    }
}

function handlePurchase(e) {
    e.preventDefault();
    
    const modal = document.getElementById('purchaseModal');
    const product = JSON.parse(modal.dataset.product);
    
    const formData = new FormData(e.target);
    const purchaseData = {
        id: generateTransactionId(),
        product: product,
        customer: {
            name: formData.get('customerName'),
            phone: currentUser.phone,
            targetNumber: formData.get('targetNumber')
        },
        payment: {
            method: formData.get('paymentMethod'),
            amount: product.price
        },
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Memproses...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Add to transaction history
        addToTransactionHistory(purchaseData);
        
        // Update status to success
        purchaseData.status = 'success';
        
        showNotification(`Pembelian berhasil! ${product.type} akan segera terkirim ke ${purchaseData.customer.targetNumber}`, 'success');
        closePurchaseModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success details
        showPurchaseSuccess(purchaseData);
        
    }, 2000);
}

function generateTransactionId() {
    return 'TRX' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function addToTransactionHistory(transaction) {
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactionHistory() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
}

function showPurchaseSuccess(transaction) {
    const successDiv = document.createElement('div');
    successDiv.className = 'purchase-success-modal';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Transaksi Berhasil!</h3>
            <div class="success-details">
                <p><strong>ID Transaksi:</strong> ${transaction.id}</p>
                <p><strong>Produk:</strong> ${transaction.product.type}</p>
                <p><strong>Nomor Tujuan:</strong> ${transaction.customer.targetNumber}</p>
                <p><strong>Total:</strong> Rp ${transaction.payment.amount.toLocaleString('id-ID')}</p>
            </div>
            <p class="success-note">Pulsa/paket akan terkirim dalam 1-3 menit</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-primary">
                Tutup
            </button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 10000);
}

// User Functions
function showTransactionHistory() {
    closeUserMenu();
    
    if (transactions.length === 0) {
        showNotification('Belum ada riwayat transaksi.', 'info');
        return;
    }
    
    const historyModal = document.createElement('div');
    historyModal.className = 'modal';
    historyModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Riwayat Transaksi</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="transaction-list">
                    ${transactions.slice(0, 10).map(transaction => `
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <h4>${transaction.product.type} - ${getOperatorName(transaction.product.operator)}</h4>
                                <p>Ke: ${transaction.customer.targetNumber}</p>
                                <small>${new Date(transaction.timestamp).toLocaleDateString('id-ID')} - ${transaction.id}</small>
                            </div>
                            <div class="transaction-amount">
                                <span class="amount">Rp ${transaction.payment.amount.toLocaleString('id-ID')}</span>
                                <span class="status ${transaction.status}">${transaction.status === 'success' ? 'Berhasil' : 'Pending'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(historyModal);
    historyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showProfile() {
    closeUserMenu();
    showNotification('Halaman profil dalam pengembangan.', 'info');
}

function showSupport() {
    closeUserMenu();
    showNotification('Hubungi customer service di WhatsApp: 0812-3456-7890', 'info');
}

function showRegisterForm() {
    showNotification('Formulir pendaftaran dalam pengembangan. Gunakan akun demo: 08123456789 / admin123', 'info');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Form Validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
    });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Clear previous validation
    input.classList.remove('error');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
    
    // Validate based on input type/name
    if (input.name === 'phone' || input.name === 'targetNumber') {
        if (!isValidPhoneNumber(value)) {
            showInputError(input, 'Nomor telepon tidak valid (contoh: 08123456789)');
        }
    }
    
    if (input.type === 'password') {
        if (value.length < 6) {
            showInputError(input, 'Password minimal 6 karakter');
        }
    }
    
    if (input.name === 'customerName') {
        if (value.length < 2) {
            showInputError(input, 'Nama minimal 2 karakter');
        }
    }
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^(08|62)\d{8,13}$/;
    return phoneRegex.test(phone);
}

function showInputError(input, message) {
    input.classList.add('error');
    
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    
    input.parentNode.appendChild(errorMsg);
}

// Cart Functions
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// API Integration Functions (for real implementation)
function sendToAPI(endpoint, data) {
    // This function would handle API calls to your backend
    // For now, it's just a placeholder for demonstration
    console.log(`API Call to ${endpoint}:`, data);
    
    // Example API structure:
    // return fetch(`/api/${endpoint}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${getAuthToken()}`
    //     },
    //     body: JSON.stringify(data)
    // });
}

// Mock API responses for demo
function mockAPIResponse(type, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Transaksi berhasil diproses',
                data: data
            });
        }, 1000);
    });
}

// Export functions for global access
window.PulsaKu = {
    openLoginModal,
    closeLoginModal,
    openPurchaseModal,
    closePurchaseModal,
    buyProduct,
    scrollToProduk,
    showPriceList,
    logout,
    showTransactionHistory,
    showProfile,
    showSupport,
    showRegisterForm
};

// Console welcome message
console.log(`
🚀 PulsaKu Website Loaded Successfully!
📱 Platform penjualan pulsa online terpercaya
💡 Demo Login: 08123456789 / admin123
🛠️ Ready for API integration
`);

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Page loaded in ${loadTime}ms`);
});

// Track user interactions for analytics
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-buy')) {
        console.log('Product purchase initiated:', e.target.closest('.product-card'));
    }
    
    if (e.target.classList.contains('operator-card')) {
        console.log('Operator selected:', e.target.getAttribute('data-operator'));
    }
});
