[file name]: admin-dashboard.js
[file content begin]
/**
 * ملف JavaScript الرئيسي للوحة التحكم
 */

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // عرض اسم المستخدم
    const currentUserEl = document.getElementById('currentUser');
    if (currentUserEl) {
        currentUserEl.textContent = currentUser.name;
    }
    
    // تحديث التاريخ الحالي
    updateCurrentDate();
    
    // تهيئة المكونات
    initSidebar();
    initNavigation();
    initNotifications();
    initUserMenu();
    initModals();
    initDataTables();
    initCharts();
    initFilters();
    
    // تحديث الإحصائيات
    updateStats();
    
    // تحميل البيانات
    loadData();
    
    // إخفاء شاشة التحميل
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }, 1000);
});

// تحديث التاريخ الحالي
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const dateString = now.toLocaleDateString('ar-SA', options);
    const dateEl = document.getElementById('currentDate');
    
    if (dateEl) {
        dateEl.textContent = dateString;
    }
}

// تهيئة الشريط الجانبي
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // إغلاق الشريط الجانبي عند النقر على زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// تهيئة التنقل بين الصفحات
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageId = this.getAttribute('data-page');
            
            // تحديث القائمة النشطة
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // إظهار الصفحة المحددة
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${pageId}Page`) {
                    page.classList.add('active');
                }
            });
            
            // تحديث عنوان الصفحة
            if (pageTitle) {
                const pageName = this.querySelector('span').textContent;
                pageTitle.textContent = pageName;
            }
            
            // إغلاق الشريط الجانبي على الأجهزة الصغيرة
            if (window.innerWidth <= 992) {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('active');
            }
            
            // تحميل بيانات الصفحة
            loadPageData(pageId);
        });
    });
}

// تهيئة الإشعارات
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.style.display = 
                notificationDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function() {
            notificationDropdown.style.display = 'none';
        });
        
        // منع إغلاق القائمة عند النقر داخلها
        notificationDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // تحديث الإشعارات
    updateNotifications();
}

// تحديث الإشعارات
function updateNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;
    
    const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    
    const notifications = [
        {
            id: 1,
            title: 'طلبات جديدة',
            message: `لديك ${pendingRequests} طلبات قيد الانتظار`,
            time: 'منذ 5 دقائق',
            read: false,
            type: 'warning'
        },
        {
            id: 2,
            title: 'مشروع مكتمل',
            message: 'تم الانتهاء من مشروع موقع الويب لشركة التقنية',
            time: 'منذ ساعتين',
            read: true,
            type: 'success'
        },
        {
            id: 3,
            title: 'تذكير',
            message: 'اجتماع مراجعة المشاريع غداً الساعة 10 صباحاً',
            time: 'منذ يوم',
            read: false,
            type: 'info'
        }
    ];
    
    notificationList.innerHTML = '';
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        notificationItem.innerHTML = `
            <div class="notification-title">
                <strong>${notification.title}</strong>
                <span class="notification-time">${notification.time}</span>
            </div>
            <div class="notification-message">${notification.message}</div>
        `;
        notificationList.appendChild(notificationItem);
    });
}

// تهيئة قائمة المستخدم
function initUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutLink = document.getElementById('logoutLink');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = 
                userDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function() {
            userDropdown.style.display = 'none';
        });
        
        // منع إغلاق القائمة عند النقر داخلها
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// تهيئة النوافذ المنبثقة
function initModals() {
    // نافذة إضافة/تعديل الطلب
    const addRequestBtn = document.getElementById('addRequestBtn');
    const requestModal = document.getElementById('requestModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModal');
    const saveRequestBtn = document.getElementById('saveRequest');
    
    if (addRequestBtn) {
        addRequestBtn.addEventListener('click', function() {
            openRequestModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeModal);
    }
    
    if (saveRequestBtn) {
        saveRequestBtn.addEventListener('click', saveRequest);
    }
    
    // نافذة التفاصيل
    const closeDetailsModalBtn = document.getElementById('closeDetailsModal');
    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.addEventListener('click', function() {
            const detailsModal = document.getElementById('detailsModal');
            detailsModal.classList.remove('active');
        });
    }
    
    // نافذة التأكيد
    const cancelConfirmBtn = document.getElementById('cancelConfirm');
    const confirmActionBtn = document.getElementById('confirmAction');
    
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    }
    
    if (confirmActionBtn) {
        confirmActionBtn.addEventListener('click', executeConfirmedAction);
    }
    
    // إغلاق النوافذ عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
            closeConfirmModal();
            
            const detailsModal = document.getElementById('detailsModal');
            if (detailsModal) {
                detailsModal.classList.remove('active');
            }
        }
    });
}

// تهيئة جداول البيانات
function initDataTables() {
    const recentRequestsTable = $('#recentRequestsTable');
    const requestsTable = $('#requestsTable');
    
    if (recentRequestsTable.length) {
        recentRequestsTable.DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/ar.json'
            },
            order: [[4, 'desc']],
            pageLength: 5,
            searching: false,
            lengthChange: false,
            info: false,
            paging: false
        });
    }
    
    if (requestsTable.length) {
        requestsTable.DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/ar.json'
            },
            order: [[0, 'desc']],
            pageLength: 10
        });
    }
}

// تهيئة الرسوم البيانية
function initCharts() {
    const ctx = document.getElementById('projectTypeChart');
    
    if (!ctx) return;
    
    const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    const projectTypes = {
        'website': 'مواقع ويب',
        'mobile': 'تطبيقات موبايل',
        'system': 'أنظمة الشركات',
        'ecommerce': 'متاجر إلكترونية',
        'finance': 'تطبيقات مالية'
    };
    
    const counts = {};
    Object.keys(projectTypes).forEach(type => {
        counts[type] = requests.filter(r => r.projectType === type).length;
    });
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.values(projectTypes),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: [
                    '#2563eb',
                    '#10b981',
                    '#8b5cf6',
                    '#f59e0b',
                    '#ec4899'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// تهيئة الفلاتر
function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

// تطبيق الفلاتر
function applyFilters() {
    const status = document.getElementById('statusFilter').value;
    const type = document.getElementById('typeFilter').value;
    const search = document.getElementById('searchInput').value;
    
    // هنا يمكن إضافة منطق تصفية البيانات
    console.log('تطبيق الفلاتر:', { status, type, search });
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    applyFilters();
}

// تحديث الإحصائيات
function updateStats() {
    const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    
    // تحديث إحصائيات الطلبات
    const totalEl = document.getElementById('totalRequests');
    const pendingEl = document.getElementById('pendingRequests');
    const completedEl = document.getElementById('completedRequests');
    const revenueEl = document.getElementById('totalRevenue');
    
    if (totalEl) totalEl.textContent = requests.length;
    if (pendingEl) pendingEl.textContent = requests.filter(r => r.status === 'pending').length;
    if (completedEl) completedEl.textContent = requests.filter(r => r.status === 'completed').length;
    
    // حساب الإيرادات
    const totalRevenue = requests
        .filter(r => r.status === 'completed' && r.budget)
        .reduce((sum, r) => sum + (r.budget || 0), 0);
    
    if (revenueEl) revenueEl.textContent = `$${totalRevenue.toLocaleString()}`;
    
    // تحديث العداد في القائمة الجانبية
    const pendingCountEl = document.getElementById('pendingCount');
    if (pendingCountEl) {
        pendingCountEl.textContent = requests.filter(r => r.status === 'pending').length;
    }
}

// تحميل البيانات
function loadData() {
    const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    
    // تحديث جدول آخر الطلبات
    const recentTableBody = document.querySelector('#recentRequestsTable tbody');
    if (recentTableBody) {
        recentTableBody.innerHTML = '';
        
        const recentRequests = [...requests]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        recentRequests.forEach(request => {
            const row = document.createElement('tr');
            const statusClass = getStatusClass(request.status);
            const statusText = getStatusText(request.status);
            
            row.innerHTML = `
                <td>#${request.id}</td>
                <td>${request.clientName}</td>
                <td>${getProjectTypeText(request.projectType)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${request.createdAt}</td>
                <td>
                    <button class="btn btn-sm btn-info view-details" data-id="${request.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            recentTableBody.appendChild(row);
        });
        
        // إضافة مستمعات الأحداث لأزرار التفاصيل
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                showRequestDetails(requestId);
            });
        });
    }
    
    // تحديث جدول جميع الطلبات
    const requestsTableBody = document.querySelector('#requestsTable tbody');
    if (requestsTableBody) {
        requestsTableBody.innerHTML = '';
        
        requests.forEach(request => {
            const row = document.createElement('tr');
            const statusClass = getStatusClass(request.status);
            const statusText = getStatusText(request.status);
            const budget = request.budget ? `$${request.budget.toLocaleString()}` : 'غير محدد';
            
            row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.clientName}</td>
                <td>${request.clientEmail}</td>
                <td>${getProjectTypeText(request.projectType)}</td>
                <td>${budget}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${request.createdAt}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info view-details" data-id="${request.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success edit-request" data-id="${request.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-request" data-id="${request.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            requestsTableBody.appendChild(row);
        });
        
        // إضافة مستمعات الأحداث للأزرار
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                showRequestDetails(requestId);
            });
        });
        
        document.querySelectorAll('.edit-request').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                openRequestModal(requestId);
            });
        });
        
        document.querySelectorAll('.delete-request').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                confirmDeleteRequest(requestId);
            });
        });
    }
}

// تحميل بيانات الصفحة
function loadPageData(pageId) {
    switch(pageId) {
        case 'dashboard':
            updateStats();
            initCharts();
            break;
        case 'requests':
            loadData();
            break;
        // يمكن إضافة المزيد من الحالات للصفحات الأخرى
    }
}

// فتح نافذة إضافة/تعديل الطلب
function openRequestModal(requestId = null) {
    const modal = document.getElementById('requestModal');
    const modalTitle = document.getElementById('modalTitle');
    const requestForm = document.getElementById('requestForm');
    
    if (requestId) {
        // وضع التعديل
        modalTitle.textContent = 'تعديل الطلب';
        
        const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
        const request = requests.find(r => r.id === parseInt(requestId));
        
        if (request) {
            document.getElementById('requestId').value = request.id;
            document.getElementById('clientName').value = request.clientName;
            document.getElementById('clientEmail').value = request.clientEmail;
            document.getElementById('clientPhone').value = request.clientPhone || '';
            document.getElementById('projectType').value = request.projectType;
            document.getElementById('projectDescription').value = request.projectDescription;
            document.getElementById('budget').value = request.budget || '';
            document.getElementById('requestStatus').value = request.status;
            document.getElementById('notes').value = request.notes || '';
        }
    } else {
        // وضع الإضافة
        modalTitle.textContent = 'إضافة طلب جديد';
        requestForm.reset();
        document.getElementById('requestId').value = '';
        document.getElementById('requestStatus').value = 'pending';
    }
    
    modal.classList.add('active');
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const modal = document.getElementById('requestModal');
    modal.classList.remove('active');
}

// حفظ الطلب
function saveRequest() {
    const requestId = document.getElementById('requestId').value;
    const requestData = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        projectType: document.getElementById('projectType').value,
        projectDescription: document.getElementById('projectDescription').value,
        budget: document.getElementById('budget').value ? 
                parseInt(document.getElementById('budget').value) : null,
        status: document.getElementById('requestStatus').value,
        notes: document.getElementById('notes').value
    };
    
    // التحقق من صحة البيانات
    if (!requestData.clientName || !requestData.clientEmail || !requestData.projectType || !requestData.projectDescription) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    
    if (requestId) {
        // تحديث طلب موجود
        const index = requests.findIndex(r => r.id === parseInt(requestId));
        if (index !== -1) {
            requests[index] = {
                ...requests[index],
                ...requestData
            };
        }
    } else {
        // إضافة طلب جديد
        const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
        const newRequest = {
            id: newId,
            ...requestData,
            createdAt: new Date().toISOString().split('T')[0]
        };
        requests.push(newRequest);
    }
    
    // حفظ في localStorage
    localStorage.setItem('projectRequests', JSON.stringify(requests));
    
    // تحديث الواجهة
    loadData();
    updateStats();
    
    // إغلاق النافذة
    closeModal();
    
    // عرض رسالة نجاح
    alert(`تم ${requestId ? 'تحديث' : 'إضافة'} الطلب بنجاح`);
}

// عرض تفاصيل الطلب
function showRequestDetails(requestId) {
    const requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    const request = requests.find(r => r.id === parseInt(requestId));
    
    if (!request) {
        alert('الطلب غير موجود');
        return;
    }
    
    const detailsModal = document.getElementById('detailsModal');
    const requestDetails = document.getElementById('requestDetails');
    
    const statusText = getStatusText(request.status);
    const statusClass = getStatusClass(request.status);
    const projectTypeText = getProjectTypeText(request.projectType);
    const budget = request.budget ? `$${request.budget.toLocaleString()}` : 'غير محدد';
    
    requestDetails.innerHTML = `
        <div class="request-details-grid">
            <div class="detail-item">
                <div class="detail-label">رقم الطلب</div>
                <div class="detail-value">#${request.id}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">الحالة</div>
                <div class="detail-value">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">نوع المشروع</div>
                <div class="detail-value">${projectTypeText}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">الميزانية</div>
                <div class="detail-value">${budget}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">اسم العميل</div>
                <div class="detail-value">${request.clientName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">البريد الإلكتروني</div>
                <div class="detail-value">${request.clientEmail}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">رقم الهاتف</div>
                <div class="detail-value">${request.clientPhone || 'غير متوفر'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">تاريخ الإنشاء</div>
                <div class="detail-value">${request.createdAt}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>وصف المشروع</h4>
            <p>${request.projectDescription}</p>
        </div>
        
        ${request.notes ? `
            <div class="detail-section">
                <h4>ملاحظات إضافية</h4>
                <p>${request.notes}</p>
            </div>
        ` : ''}
        
        <div class="action-buttons mt-3">
            <button class="btn btn-primary edit-request" data-id="${request.id}">
                <i class="fas fa-edit"></i> تعديل الطلب
            </button>
            <button class="btn btn-danger delete-request" data-id="${request.id}">
                <i class="fas fa-trash"></i> حذف الطلب
            </button>
        </div>
    `;
    
    // إضافة مستمعات الأحداث للأزرار
    requestDetails.querySelector('.edit-request').addEventListener('click', function() {
        detailsModal.classList.remove('active');
        setTimeout(() => {
            openRequestModal(requestId);
        }, 300);
    });
    
    requestDetails.querySelector('.delete-request').addEventListener('click', function() {
        detailsModal.classList.remove('active');
        setTimeout(() => {
            confirmDeleteRequest(requestId);
        }, 300);
    });
    
    detailsModal.classList.add('active');
}

// تأكيد حذف الطلب
function confirmDeleteRequest(requestId) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmActionBtn = document.getElementById('confirmAction');
    
    confirmMessage.textContent = 'هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذه العملية.';
    confirmActionBtn.setAttribute('data-id', requestId);
    confirmActionBtn.onclick = function() {
        deleteRequest(requestId);
    };
    
    confirmModal.classList.add('active');
}

// حذف الطلب
function deleteRequest(requestId) {
    let requests = JSON.parse(localStorage.getItem('projectRequests')) || [];
    requests = requests.filter(r => r.id !== parseInt(requestId));
    
    localStorage.setItem('projectRequests', JSON.stringify(requests));
    
    // تحديث الواجهة
    loadData();
    updateStats();
    
    // إغلاق نافذة التأكيد
    closeConfirmModal();
    
    // عرض رسالة نجاح
    alert('تم حذف الطلب بنجاح');
}

// إغلاق نافذة التأكيد
function closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.classList.remove('active');
}

// تنفيذ الإجراء المؤكد
function executeConfirmedAction() {
    const confirmActionBtn = document.getElementById('confirmAction');
    const action = confirmActionBtn.onclick;
    
    if (action) {
        action();
    }
    
    closeConfirmModal();
}

// وظائف مساعدة
function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'in_progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'pending': 'status-pending',
        'in_progress': 'status-in_progress',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    
    return classMap[status] || '';
}

function getProjectTypeText(type) {
    const typeMap = {
        'website': 'موقع ويب',
        'mobile': 'تطبيق موبايل',
        'system': 'نظام شركة',
        'ecommerce': 'متجر إلكتروني',
        'finance': 'تطبيق مالي'
    };
    
    return typeMap[type] || type;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'admin-login.html';
}

