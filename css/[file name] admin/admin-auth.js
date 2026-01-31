[file name]: admin-auth.js
[file content begin]
/**
 * نظام المصادقة والإدارة لصفحة التحكم
 * يستخدم localStorage للتخزين المؤقت (يمكن تبديله بقاعدة بيانات حقيقية)
 */

// بيانات المستخدمين المخزنة (في تطبيق حقيقي، ستكون في قاعدة بيانات)
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123', // في التطبيق الحقيقي، يجب تشفير كلمات المرور
        name: 'المسؤول الرئيسي',
        email: 'admin@digtlmirror.com',
        role: 'مدير النظام',
        permissions: ['all']
    },
    {
        id: 2,
        username: 'manager',
        password: 'manager123',
        name: 'مدير المشاريع',
        email: 'manager@digtlmirror.com',
        role: 'مدير المشاريع',
        permissions: ['view', 'edit', 'delete']
    }
];

// بيانات الطلبات المخزنة (سيتم تخزينها في localStorage)
let requests = JSON.parse(localStorage.getItem('projectRequests')) || [
    {
        id: 1,
        clientName: 'أحمد محمد',
        clientEmail: 'ahmed@example.com',
        clientPhone: '+962790000001',
        projectType: 'website',
        projectDescription: 'تطوير موقع إلكتروني متكامل لمتجر ملابس',
        budget: 2500,
        status: 'completed',
        notes: 'تم الانتهاء من المشروع بنجاح',
        createdAt: '2025-01-15',
        completedAt: '2025-02-20'
    },
    {
        id: 2,
        clientName: 'سارة خالد',
        clientEmail: 'sara@example.com',
        clientPhone: '+962790000002',
        projectType: 'mobile',
        projectDescription: 'تطبيق موبايل لإدارة المطاعم',
        budget: 4000,
        status: 'in_progress',
        notes: 'قيد التطوير - المرحلة الثانية',
        createdAt: '2025-02-10',
        assignedTo: 'مدير المشاريع'
    },
    {
        id: 3,
        clientName: 'محمد عبدالله',
        clientEmail: 'mohammed@example.com',
        clientPhone: '+962790000003',
        projectType: 'ecommerce',
        projectDescription: 'منصة تجارة إلكترونية للمنتجات التقنية',
        budget: 6000,
        status: 'pending',
        notes: 'بانتظار الموافقة على الميزانية',
        createdAt: '2025-03-01'
    },
    {
        id: 4,
        clientName: 'فاطمة علي',
        clientEmail: 'fatima@example.com',
        clientPhone: '+962790000004',
        projectType: 'system',
        projectDescription: 'نظام إدارة الموارد البشرية',
        budget: 3500,
        status: 'pending',
        notes: 'تم استلام الطلب وجاري المراجعة',
        createdAt: '2025-03-05'
    },
    {
        id: 5,
        clientName: 'خالد حسن',
        clientEmail: 'khaled@example.com',
        clientPhone: '+962790000005',
        projectType: 'finance',
        projectDescription: 'تطبيق إدارة المحاسبة الشخصية',
        budget: 1500,
        status: 'cancelled',
        notes: 'تم الإلغاء بناء على طلب العميل',
        createdAt: '2025-02-28',
        cancelledAt: '2025-03-03'
    }
];

// حفظ الطلبات في localStorage
function saveRequests() {
    localStorage.setItem('projectRequests', JSON.stringify(requests));
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // التحقق إذا كان المستخدم مسجل الدخول بالفعل
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser && window.location.pathname.includes('admin-login.html')) {
        // إذا كان مسجلاً الدخول وذهب إلى صفحة تسجيل الدخول، قم بتوجيهه للوحة التحكم
        window.location.href = 'admin-dashboard.html';
        return;
    } else if (!currentUser && window.location.pathname.includes('admin-dashboard.html')) {
        // إذا لم يكن مسجلاً الدخول وحاول الوصول للوحة التحكم، قم بتوجيهه لتسجيل الدخول
        window.location.href = 'admin-login.html';
        return;
    }
    
    if (window.location.pathname.includes('admin-login.html')) {
        initLoginPage();
    }
});

// تهيئة صفحة تسجيل الدخول
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const showPasswordBtn = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    
    // زر إظهار/إخفاء كلمة المرور
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }
    
    // معالجة تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const rememberMe = document.getElementById('remember').checked;
            
            // التحقق من بيانات المستخدم
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // تسجيل الدخول ناجح
                showMessage(loginMessage, 'تم تسجيل الدخول بنجاح! جاري التوجيه...', 'success');
                
                // حفظ بيانات المستخدم
                const userData = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    permissions: user.permissions
                };
                
                if (rememberMe) {
                    // حفظ لمدة 7 أيام
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 7);
                    userData.expiry = expiryDate.getTime();
                }
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // توجيه المستخدم إلى لوحة التحكم بعد تأخير بسيط
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
            } else {
                // فشل تسجيل الدخول
                showMessage(loginMessage, 'اسم المستخدم أو كلمة المرور غير صحيحة!', 'error');
            }
        });
    }
}

// عرض الرسائل
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `login-message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'admin-login.html';
}

// التحقق من صلاحيات المستخدم
function checkPermission(permission) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        return false;
    }
    
    // إذا كان لديه جميع الصلاحيات
    if (currentUser.permissions.includes('all')) {
        return true;
    }
    
    // التحقق من صلاحية محددة
    return currentUser.permissions.includes(permission);
}

// الحصول على بيانات المستخدم الحالي
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// تحديث إحصائيات الطلبات
function updateStats() {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    
    // حساب إجمالي الإيرادات (فقط المشاريع المكتملة)
    const totalRevenue = requests
        .filter(r => r.status === 'completed' && r.budget)
        .reduce((sum, r) => sum + (r.budget || 0), 0);
    
    // تحديث العناصر في الصفحة إذا كانت موجودة
    const totalEl = document.getElementById('totalRequests');
    const pendingEl = document.getElementById('pendingRequests');
    const completedEl = document.getElementById('completedRequests');
    const revenueEl = document.getElementById('totalRevenue');
    
    if (totalEl) totalEl.textContent = totalRequests;
    if (pendingEl) pendingEl.textContent = pendingRequests;
    if (completedEl) completedEl.textContent = completedRequests;
    if (revenueEl) revenueEl.textContent = `$${totalRevenue.toLocaleString()}`;
    
    // تحديث العداد في القائمة الجانبية
    const pendingCountEl = document.getElementById('pendingCount');
    if (pendingCountEl) {
        pendingCountEl.textContent = pendingRequests;
    }
}

// الحصول على جميع الطلبات
function getAllRequests() {
    return requests;
}

// الحصول على طلب بواسطة ID
function getRequestById(id) {
    return requests.find(r => r.id === parseInt(id));
}

// إضافة طلب جديد
function addRequest(requestData) {
    const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
    
    const newRequest = {
        id: newId,
        ...requestData,
        createdAt: new Date().toISOString().split('T')[0],
        status: requestData.status || 'pending'
    };
    
    requests.push(newRequest);
    saveRequests();
    updateStats();
    
    return newRequest;
}

// تحديث طلب موجود
function updateRequest(id, requestData) {
    const index = requests.findIndex(r => r.id === parseInt(id));
    
    if (index !== -1) {
        requests[index] = {
            ...requests[index],
            ...requestData
        };
        
        saveRequests();
        updateStats();
        return requests[index];
    }
    
    return null;
}

// حذف طلب
function deleteRequest(id) {
    const index = requests.findIndex(r => r.id === parseInt(id));
    
    if (index !== -1) {
        requests.splice(index, 1);
        saveRequests();
        updateStats();
        return true;
    }
    
    return false;
}

// تصفية الطلبات
function filterRequests(filters = {}) {
    let filtered = [...requests];
    
    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(r => r.status === filters.status);
    }
    
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(r => r.projectType === filters.type);
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(r => 
            r.clientName.toLowerCase().includes(searchTerm) ||
            r.clientEmail.toLowerCase().includes(searchTerm) ||
            r.projectDescription.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

// الحصول على إحصائيات نوع المشاريع
function getProjectTypeStats() {
    const stats = {};
    
    requests.forEach(request => {
        const type = request.projectType;
        if (!stats[type]) {
            stats[type] = 0;
        }
        stats[type]++;
    });
    
    return stats;
}

// تصدير الدوال للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllRequests,
        getRequestById,
        addRequest,
        updateRequest,
        deleteRequest,
        filterRequests,
        getProjectTypeStats,
        updateStats,
        checkPermission,
        getCurrentUser,
        logout
    };
}
[file content end]
