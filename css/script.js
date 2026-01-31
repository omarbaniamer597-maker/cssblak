// كود JavaScript لإدارة صفحة الانتظار
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    const percentageElement = document.getElementById('percentage');
    const loadingText = document.getElementById('loadingText');
    
    let percentage = 0;
    let loadingMessages = [
        "جاري تحميل المحتوى...",
        "جاري تهيئة البيانات...",
        "جاري تحميل الصور...",
        "جاري إعداد الواجهة...",
        "جاري التحميل النهائي..."
    ];
    let messageIndex = 0;
    
    const progressInterval = setInterval(() => {
        percentage += 3.33;
        if (percentage > 100) percentage = 100;
        percentageElement.textContent = Math.round(percentage) + '%';
        
        if (percentage >= (messageIndex + 1) * 20 && messageIndex < loadingMessages.length - 1) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
            loadingText.style.animation = 'fadeInUp 0.5s ease-out';
            setTimeout(() => {
                loadingText.style.animation = '';
            }, 500);
        }
        
        if (percentage >= 100) {
            clearInterval(progressInterval);
            
            loadingText.textContent = "تم التحميل بنجاح!";
            loadingText.style.color = "#dbeafe";
            loadingText.style.fontWeight = "bold";
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainContent.classList.add('visible');
                }, 800);
            }, 500);
        }
    }, 100);
    
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.classList.add('visible');
            }, 800);
        }
    }, 3500);
});

// كود إدارة المشاريع والواجهة التفاعلية
document.addEventListener('DOMContentLoaded', function() {
    // بيانات المشاريع
    const projectsData = {
        'website': {
            title: 'تطوير مواقع الويب المتكاملة',
            description: 'تصميم وتطوير مواقع ويب احترافية متجاوبة مع جميع الأجهزة',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
            features: [
                'تصميم متجاوب مع جميع الأجهزة',
                'تحسين محركات البحث (SEO)',
                'سرعة تحميل عالية',
                'واجهة مستخدم سهلة الاستخدام',
                'نظام إدارة محتوى متكامل',
                'حماية وأمان عالي'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
            liveUrl: 'https://example.com/websites'
        },
        'mobile': {
            title: 'تطبيقات الموبايل الذكية',
            description: 'تطوير تطبيقات موبايل مبتكرة لأنظمة iOS و Android',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
            features: [
                'تطوير تطبيقات iOS و Android',
                'واجهة مستخدم جذابة وسهلة',
                'أداء عالي وسرعة في الاستجابة',
                'تكامل مع الأنظمة المختلفة',
                'تحديثات مستمرة ودعم فني',
                'توافق مع أحدث إصدارات الأنظمة'
            ],
            tech: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
            liveUrl: 'https://example.com/mobile-apps'
        },
        'system': {
            title: 'أنظمة إدارة الشركات',
            description: 'حلول برمجية متكاملة لإدارة عمليات الشركات بكفاءة',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
            features: [
                'نظام إدارة العملاء (CRM)',
                'نظام إدارة الموارد البشرية',
                'نظام المحاسبة والمالية',
                'نظام إدارة المخزون',
                'تقارير وإحصائيات متقدمة',
                'تكامل مع الأنظمة الخارجية'
            ],
            tech: ['ERP', 'CRM', 'HRM', 'Accounting', 'PHP', 'MySQL'],
            liveUrl: 'https://example.com/corporate-systems'
        },
        'ecommerce': {
            title: 'منصات التجارة الإلكترونية',
            description: 'متاجر إلكترونية متكاملة مع أنظمة دفع وإدارة متقدمة',
            image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
            features: [
                'تصميم متاجر إلكترونية متكاملة',
                'أنظمة دفع إلكتروني آمنة',
                'إدارة المخزون والطلبات',
                'لوحة تحكم متقدمة للمسؤول',
                'تحليلات مبيعات متقدمة',
                'تكامل مع خدمات الشحن'
            ],
            tech: ['WooCommerce', 'Shopify', 'Payment Gateway', 'Magento', 'Laravel'],
            liveUrl: 'https://example.com/ecommerce'
        },
        'finance': {
            title: 'التطبيقات المالية والمحاسبية',
            description: 'أنظمة إدارة مالية متقدمة للشركات والأفراد',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1115&q=80',
            features: [
                'أنظمة محاسبة متكاملة',
                'إدارة الميزانيات والتقارير',
                'تحليل البيانات المالية',
                'تتبع المصروفات والإيرادات',
                'تقارير ضريبية تلقائية',
                'توقعات مالية وتحليلات'
            ],
            tech: ['Accounting', 'Analytics', 'Reports', 'Python', 'Django', 'PostgreSQL'],
            liveUrl: 'https://example.com/finance-apps'
        }
    };

    // العناصر الرئيسية
    const projectsSidebar = document.getElementById('projectsSidebar');
    const projectDetails = document.getElementById('projectDetails');
    const closeProjectBtn = document.getElementById('closeProjectBtn');
    const backToHomeBtn = document.getElementById('backToHome');
    const showProjectsBtn = document.getElementById('showProjectsBtn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectSidebarBtns = document.querySelectorAll('.project-sidebar-btn');
    
    // عناصر تفاصيل المشروع
    const projectTitle = document.getElementById('projectTitle');
    const projectDesc = document.getElementById('projectDesc');
    const projectImage = document.getElementById('projectImage');
    const projectFeatures = document.getElementById('projectFeatures');
    const projectTech = document.getElementById('projectTech');
    const viewLiveProject = document.getElementById('viewLiveProject');
    const requestSimilar = document.getElementById('requestSimilar');
    
    // إظهار/إخفاء الشريط الجانبي للمشاريع
    function toggleProjectsSidebar() {
        projectsSidebar.classList.toggle('active');
    }
    
    // عرض تفاصيل المشروع
    function showProjectDetails(projectId) {
        const project = projectsData[projectId];
        
        if (!project) return;
        
        // تعبئة البيانات
        projectTitle.textContent = project.title;
        projectDesc.textContent = project.description;
        projectImage.src = project.image;
        projectImage.alt = project.title;
        
        // تعبئة المميزات
        projectFeatures.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            projectFeatures.appendChild(li);
        });
        
        // تعبئة التقنيات
        projectTech.innerHTML = '';
        project.tech.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-badge';
            span.textContent = tech;
            projectTech.appendChild(span);
        });
        
        // تحديث رابط المشروع الحي
        viewLiveProject.onclick = () => {
            window.open(project.liveUrl, '_blank');
        };
        
        // تحديث زر طلب مشروع مماثل
        requestSimilar.onclick = () => {
            projectDetails.classList.remove('active');
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
                document.getElementById('message').value = `أرغب في طلب مشروع مشابه لمشروع ${project.title}`;
            }, 300);
        };
        
        // إظهار تفاصيل المشروع
        projectDetails.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // إغلاق تفاصيل المشروع
    function closeProjectDetails() {
        projectDetails.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // إخفاء الشريط الجانبي بعد 3 ثواني من الإغلاق
        setTimeout(() => {
            projectsSidebar.classList.remove('active');
        }, 3000);
    }
    
    // العودة للصفحة الرئيسية
    function backToHome() {
        projectsSidebar.classList.remove('active');
        document.getElementById('home').scrollIntoView({behavior: 'smooth'});
    }
    
    // أحداث النقر على أزرار المشاريع في الشريط الجانبي
    projectSidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            
            // إزالة النشط من جميع الأزرار
            projectSidebarBtns.forEach(b => b.classList.remove('active'));
            
            // إضافة النشط للزر المحدد
            this.classList.add('active');
            
            // عرض تفاصيل المشروع
            showProjectDetails(projectId);
        });
    });
    
    // أحداث النقر على بطاقات المشاريع
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            
            // إظهار الشريط الجانبي أولاً
            projectsSidebar.classList.add('active');
            
            // تحديث الزر النشط في الشريط الجانبي
            projectSidebarBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-project') === projectId) {
                    btn.classList.add('active');
                }
            });
            
            // عرض تفاصيل المشروع بعد تأخير بسيط
            setTimeout(() => {
                showProjectDetails(projectId);
            }, 300);
        });
    });
    
    // أحداث الأزرار
    if (showProjectsBtn) {
        showProjectsBtn.addEventListener('click', toggleProjectsSidebar);
    }
    
    if (closeProjectBtn) {
        closeProjectBtn.addEventListener('click', closeProjectDetails);
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', backToHome);
    }
    
    // إغلاق تفاصيل المشروع بالضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectDetails.classList.contains('active')) {
            closeProjectDetails();
        }
    });
    
    // إغلاق تفاصيل المشروع بالضغط خارج المحتوى
    projectDetails.addEventListener('click', function(e) {
        if (e.target === this) {
            closeProjectDetails();
        }
    });
    
    // إظهار الشريط الجانبي عند التمرير لقسم المشاريع
    const projectsSection = document.getElementById('projects');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth > 1200) {
                projectsSidebar.classList.add('active');
            }
        });
    }, { threshold: 0.3 });
    
    if (projectsSection) {
        observer.observe(projectsSection);
    }
    
    // إخفاء الشريط الجانبي عند التمرير بعيداً
    window.addEventListener('scroll', function() {
        if (window.scrollY < 100) {
            projectsSidebar.classList.remove('active');
        }
    });
    
    // تحديث شريط التقدم
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${progress}%`;
        }
    }
    
    // تحديث النقاط النشطة
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');
    
    function updateActiveDot() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-target') === current) {
                dot.classList.add('active');
            }
        });
    }
    
    // أحداث النقر على النقاط الجانبية
    navDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                navDots.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // أحداث التمرير
    window.addEventListener('scroll', function() {
        updateScrollProgress();
        updateActiveDot();
    });
    
    // كود القائمة المتنقلة
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav) nav.classList.remove('active');
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (nav && !e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
        }
    });
    
    // كود النموذج
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if(name && email && message) {
                alert(`شكراً ${name}! تم استلام رسالتك بنجاح وسنقوم بالرد عليك قريباً.`);
                contactForm.reset();
            } else {
                alert('الرجاء ملء جميع الحقول المطلوبة.');
            }
        });
    }
    
    // التمرير السلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if(window.innerWidth <= 768 && nav) {
                    nav.classList.remove('active');
                }
            }
        });
    });
    
    // تهيئة
    updateScrollProgress();
    updateActiveDot();
});
