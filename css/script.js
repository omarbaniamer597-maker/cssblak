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
        
        // تنظيف الذاكرة
        projectFeatures.innerHTML = '';
        projectTech.innerHTML = '';
        
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
    
    // إضافة تأثيرات hover للشريط الجانبي
    projectSidebarBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            const projectId = this.getAttribute('data-project');
            const allCards = document.querySelectorAll('.project-card');
            
            // تسليط الضوء على البطاقة المقابلة
            allCards.forEach(card => {
                if (card.getAttribute('data-project') === projectId) {
                    card.style.transform = 'translateY(-10px) scale(1.05)';
                    card.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.3)';
                    card.style.zIndex = '10';
                } else {
                    card.style.opacity = '0.7';
                    card.style.transform = 'scale(0.95)';
                }
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            const allCards = document.querySelectorAll('.project-card');
            
            // إعادة جميع البطاقات للحالة الأصلية
            allCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.zIndex = '';
            });
        });
    });
    
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
    let scrollTimeout;
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        if (scrollProgressBar) {
            // تأثير سلس للشريط
            scrollProgressBar.style.width = `${progress}%`;
            
            // تغيير اللون بناءً على الموقع
            const hue = 210 + (progress * 0.3);
            scrollProgressBar.style.background = `linear-gradient(90deg, 
                hsl(${hue}, 100%, 60%) 0%,
                hsl(${hue + 20}, 100%, 60%) 100%)`;
        }
        
        // تأثير الشد للشريط عند الوصول لـ 100%
        if (progress > 99.5) {
            scrollProgressBar.style.height = '7px';
        } else {
            scrollProgressBar.style.height = '5px';
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
        // تحسين الأداء بتأخير التحديثات
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            updateScrollProgress();
            updateActiveDot();
        }, 10);
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
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // عرض حالة التحميل
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.disabled = true;
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // التحقق من البريد الإلكتروني
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if(!name || !email || !message) {
                showNotification('الرجاء ملء جميع الحقول المطلوبة.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            if(!emailRegex.test(email)) {
                showNotification('الرجاء إدخال بريد إلكتروني صحيح.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            try {
                // محاكاة إرسال البيانات
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // نجاح الإرسال
                showNotification(`شكراً ${name}! تم إرسال رسالتك بنجاح وسنرد عليك خلال 24 ساعة.`, 'success');
                
                // تسجيل البيانات (يمكنك إضافة API هنا)
                console.log({
                    name,
                    email,
                    phone,
                    message,
                    timestamp: new Date().toISOString()
                });
                
                contactForm.reset();
                
            } catch (error) {
                showNotification('حدث خطأ أثناء الإرسال. حاول مرة أخرى.', 'error');
            } finally {
                // استعادة الحالة الأصلية
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // دالة لعرض الإشعارات
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // إغلاق الإشعار
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // إزالة الإشعار تلقائياً بعد 5 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // زر العودة للأعلى
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // نظام lazy loading للصور
    const lazyImages = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.hasAttribute('data-src')) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    lazyImages.forEach(img => {
        if (img.hasAttribute('data-src')) {
            imageObserver.observe(img);
        }
    });
    
    // كود الساعة الإبداعية في الخلفية
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على عناصر الساعة
    const canvas = document.getElementById('creativeClock');
    const ctx = canvas.getContext('2d');
    const toggleClockBtn = document.getElementById('toggleClock');
    const changeThemeBtn = document.getElementById('changeClockTheme');
    const settingsBtn = document.getElementById('clockSettings');
    const settingsPanel = document.getElementById('clockSettingsPanel');
    const saveSettingsBtn = document.getElementById('saveClockSettings');
    const resetSettingsBtn = document.getElementById('resetClockSettings');
    
    // إعدادات الساعة
    let clockSettings = {
        active: true,
        speed: 5,
        intensity: 7,
        color: '#2563eb',
        effect: 'particles',
        showParticles: true,
        showGlow: true,
        mouseInteraction: true,
        theme: 'default'
    };
    
    // تهيئة الساعة
    let particles = [];
    let waves = [];
    let mouse = { x: 0, y: 0, active: false };
    let time = new Date();
    let animationId = null;
    
    // حجم الكانفاس
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // تحميل الإعدادات من localStorage
    function loadSettings() {
        const saved = localStorage.getItem('creativeClockSettings');
        if (saved) {
            clockSettings = { ...clockSettings, ...JSON.parse(saved) };
            updateControls();
        }
    }
    
    // حفظ الإعدادات
    function saveSettings() {
        localStorage.setItem('creativeClockSettings', JSON.stringify(clockSettings));
        showNotification('تم حفظ إعدادات الساعة', 'success');
    }
    
    // تحديث عناصر التحكم
    function updateControls() {
        document.getElementById('clockSpeed').value = clockSettings.speed;
        document.getElementById('clockIntensity').value = clockSettings.intensity;
        document.getElementById('clockEffects').value = clockSettings.effect;
        document.getElementById('clockParticles').checked = clockSettings.showParticles;
        document.getElementById('clockGlow').checked = clockSettings.showGlow;
        document.getElementById('clockInteraction').checked = clockSettings.mouseInteraction;
        
        // تحديث قيم العرض
        updateRangeValues();
        
        // تحديث الألوان النشطة
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === clockSettings.color) {
                btn.classList.add('active');
            }
        });
        
        // تحديث حالة الساعة
        if (clockSettings.active) {
            canvas.classList.add('active');
            toggleClockBtn.innerHTML = '<i class="fas fa-clock"></i>';
            toggleClockBtn.title = 'إيقاف الساعة';
            startClock();
        } else {
            canvas.classList.remove('active');
            toggleClockBtn.innerHTML = '<i class="fas fa-play"></i>';
            toggleClockBtn.title = 'تشغيل الساعة';
            stopClock();
        }
    }
    
    // تحديث قيم المدخلات
    function updateRangeValues() {
        const speedLabels = ['بطيء جداً', 'بطيء', 'متوسط', 'سريع', 'سريع جداً'];
        const intensityLabels = ['ضعيفة', 'قليلة', 'متوسطة', 'كثيفة', 'عالية'];
        
        const speedIndex = Math.floor((clockSettings.speed - 1) / 2);
        const intensityIndex = Math.floor((clockSettings.intensity - 1) / 2);
        
        document.getElementById('speedValue').textContent = speedLabels[speedIndex] || 'متوسط';
        document.getElementById('intensityValue').textContent = intensityLabels[intensityIndex] || 'عالية';
    }
    
    // إنشاء جسيمات
    function createParticles() {
        if (!clockSettings.showParticles) return;
        
        const particleCount = Math.floor(clockSettings.intensity * 5);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * (clockSettings.speed * 0.5),
                speedY: (Math.random() - 0.5) * (clockSettings.speed * 0.5),
                color: clockSettings.color,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    // إنشاء موجات
    function createWaves() {
        waves = [];
        const waveCount = Math.floor(clockSettings.intensity / 2);
        
        for (let i = 0; i < waveCount; i++) {
            waves.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 100 + 50,
                speed: Math.random() * 0.5 + 0.1,
                width: Math.random() * 3 + 1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    // رسم الساعة والرسومات
    function drawClock() {
        // مسح الكانفاس
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // وقت حقيقي
        time = new Date();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        
        // الرسم حسب نوع التأثير
        switch (clockSettings.effect) {
            case 'particles':
                drawParticles();
                drawTimeCircle(hours, minutes, seconds, milliseconds);
                break;
            case 'waves':
                drawWaves();
                drawTimeWaves(hours, minutes, seconds);
                break;
            case 'circuits':
                drawCircuits();
                drawTimeCircuits(hours, minutes, seconds);
                break;
            case 'binary':
                drawBinary();
                drawTimeBinary(hours, minutes, seconds);
                break;
            case 'stars':
                drawStars();
                drawTimeStars(hours, minutes, seconds);
                break;
        }
        
        // التأثيرات الإضافية
        if (clockSettings.showGlow) {
            drawGlowEffects();
        }
        
        if (clockSettings.mouseInteraction && mouse.active) {
            drawMouseInteraction();
        }
    }
    
    // رسم الجسيمات
    function drawParticles() {
        particles.forEach(particle => {
            // تحديث الموقع
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // تجاوز الحواف
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // التفاعل مع الماوس
            if (clockSettings.mouseInteraction && mouse.active) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    particle.x -= Math.cos(angle) * force * 2;
                    particle.y -= Math.sin(angle) * force * 2;
                }
            }
            
            // رسم الجسيم
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
            ctx.fill();
            
            // وصل الجسيمات القريبة
            particles.forEach(otherParticle => {
                const dx = otherParticle.x - particle.x;
                const dy = otherParticle.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = particle.color.replace(')', `, ${0.05})`).replace('rgb', 'rgba');
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    
    // رسم دائرة الوقت
    function drawTimeCircle(h, m, s, ms) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        
        // رسم الدائرة الأساسية
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = clockSettings.color.replace(')', `, 0.1)`).replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // ساعة
        const hourAngle = (h % 12 + m / 60) * (Math.PI * 2) / 12 - Math.PI / 2;
        const hourX = centerX + Math.cos(hourAngle) * radius * 0.5;
        const hourY = centerY + Math.sin(hourAngle) * radius * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(hourX, hourY);
        ctx.strokeStyle = clockSettings.color;
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // دقيقة
        const minuteAngle = (m + s / 60) * (Math.PI * 2) / 60 - Math.PI / 2;
        const minuteX = centerX + Math.cos(minuteAngle) * radius * 0.7;
        const minuteY = centerY + Math.sin(minuteAngle) * radius * 0.7;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(minuteX, minuteY);
        ctx.strokeStyle = clockSettings.color.replace(')', `, 0.8)`).replace('rgb', 'rgba');
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // ثانية
        const secondAngle = (s + ms / 1000) * (Math.PI * 2) / 60 - Math.PI / 2;
        const secondX = centerX + Math.cos(secondAngle) * radius * 0.9;
        const secondY = centerY + Math.sin(secondAngle) * radius * 0.9;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(secondX, secondY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // رسم الموجات
    function drawWaves() {
        waves.forEach(wave => {
            wave.radius += wave.speed;
            
            if (wave.radius > Math.max(canvas.width, canvas.height) * 2) {
                wave.radius = Math.random() * 100 + 50;
                wave.x = Math.random() * canvas.width;
                wave.y = Math.random() * canvas.height;
            }
            
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.strokeStyle = clockSettings.color.replace(')', `, ${wave.opacity})`).replace('rgb', 'rgba');
            ctx.lineWidth = wave.width;
            ctx.stroke();
        });
    }
    
    // رسم موجات الوقت
    function drawTimeWaves(h, m, s) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // موجة الساعات
        ctx.beginPath();
        for (let i = 0; i < 24; i++) {
            const angle = (i * (Math.PI * 2) / 24) - Math.PI / 2;
            const radius = 100 + Math.sin((h + i) * 0.5) * 50;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = clockSettings.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // رسم الدوائر الكهربائية
    function drawCircuits() {
        const nodeCount = Math.floor(clockSettings.intensity * 3);
        
        for (let i = 0; i < nodeCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            // رسم العقد
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = clockSettings.color;
            ctx.fill();
            
            // وصل العقد
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() > 0.7) {
                    const x2 = Math.random() * canvas.width;
                    const y2 = Math.random() * canvas.height;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = clockSettings.color.replace(')', `, 0.3)`).replace('rgb', 'rgba');
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    
                    // إضافة نقاط على الخط
                    for (let k = 0; k < 3; k++) {
                        const t = (k + 1) / 4;
                        const px = x + (x2 - x) * t;
                        const py = y + (y2 - y) * t;
                        
                        ctx.beginPath();
                        ctx.arc(px, py, 1, 0, Math.PI * 2);
                        ctx.fillStyle = clockSettings.color;
                        ctx.fill();
                    }
                }
            }
        }
    }
    
    // رسم الأرقام الثنائية
    function drawBinary() {
        const charCount = Math.floor(clockSettings.intensity * 20);
        const fontSize = 14;
        
        for (let i = 0; i < charCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const digit = Math.random() > 0.5 ? '1' : '0';
            
            ctx.font = `${fontSize}px 'Courier New', monospace`;
            ctx.fillStyle = clockSettings.color.replace(')', `, ${Math.random() * 0.5 + 0.1})`).replace('rgb', 'rgba');
            ctx.fillText(digit, x, y);
        }
    }
    
    // رسم النجوم
    function drawStars() {
        const starCount = Math.floor(clockSettings.intensity * 15);
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 2 + 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = clockSettings.color.replace(')', `, ${Math.random() * 0.8 + 0.2})`).replace('rgb', 'rgba');
            ctx.fill();
            
            // تأثير التلألؤ
            if (Math.random() > 0.8) {
                ctx.beginPath();
                ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = clockSettings.color.replace(')', `, 0.1)`).replace('rgb', 'rgba');
                ctx.fill();
            }
        }
    }
    
    // تأثيرات التوهج
    function drawGlowEffects() {
        const time = new Date();
        const pulse = (Math.sin(time.getTime() * 0.001) + 1) * 0.5;
        
        // توهج خفيف في المركز
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.3
        );
        gradient.addColorStop(0, clockSettings.color.replace(')', `, ${0.1 + pulse * 0.1})`).replace('rgb', 'rgba'));
        gradient.addColorStop(1, clockSettings.color.replace(')', `, 0)`).replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // التفاعل مع الماوس
    function drawMouseInteraction() {
        if (!clockSettings.mouseInteraction || !mouse.active) return;
        
        // دائرة حول الماوس
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
        ctx.strokeStyle = clockSettings.color.replace(')', `, 0.3)`).replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // خطوط من الماوس
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const length = 100 + Math.sin(Date.now() * 0.001 + i) * 50;
            const endX = mouse.x + Math.cos(angle) * length;
            const endY = mouse.y + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = clockSettings.color.replace(')', `, ${0.5})`).replace('rgb', 'rgba');
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    
    // دالة التحديث الرئيسية
    function updateClock() {
        drawClock();
        animationId = requestAnimationFrame(updateClock);
    }
    
    // بدء الساعة
    function startClock() {
        if (animationId) return;
        resizeCanvas();
        createParticles();
        createWaves();
        updateClock();
    }
    
    // إيقاف الساعة
    function stopClock() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    // تبديل الساعة
    toggleClockBtn.addEventListener('click', function() {
        clockSettings.active = !clockSettings.active;
        updateControls();
    });
    
    // تغيير الثيم
    changeThemeBtn.addEventListener('click', function() {
        const themes = ['default', 'dark', 'light', 'colorful'];
        const currentIndex = themes.indexOf(clockSettings.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        clockSettings.theme = themes[nextIndex];
        applyTheme();
    });
    
    // تطبيق الثيم
    function applyTheme() {
        switch (clockSettings.theme) {
            case 'dark':
                clockSettings.color = '#10b981';
                canvas.style.opacity = '0.3';
                break;
            case 'light':
                clockSettings.color = '#3b82f6';
                canvas.style.opacity = '0.2';
                break;
            case 'colorful':
                const colors = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
                clockSettings.color = colors[Math.floor(Math.random() * colors.length)];
                break;
            default:
                clockSettings.color = '#2563eb';
                canvas.style.opacity = '0.4';
        }
        updateControls();
    }
    
    // إظهار/إخفاء الإعدادات
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.toggle('show');
    });
    
    // تغيير الألوان
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', function() {
            clockSettings.color = this.dataset.color;
            updateControls();
        });
    });
    
    // تحديث الإعدادات من المدخلات
    document.getElementById('clockSpeed').addEventListener('input', function() {
        clockSettings.speed = parseInt(this.value);
        updateRangeValues();
    });
    
    document.getElementById('clockIntensity').addEventListener('input', function() {
        clockSettings.intensity = parseInt(this.value);
        updateRangeValues();
    });
    
    document.getElementById('clockEffects').addEventListener('change', function() {
        clockSettings.effect = this.value;
        particles = [];
        waves = [];
        createParticles();
        createWaves();
    });
    
    // حفظ الإعدادات
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // إعادة الضبط
    resetSettingsBtn.addEventListener('click', function() {
        clockSettings = {
            active: true,
            speed: 5,
            intensity: 7,
            color: '#2563eb',
            effect: 'particles',
            showParticles: true,
            showGlow: true,
            mouseInteraction: true,
            theme: 'default'
        };
        updateControls();
        showNotification('تم إعادة تعيين الإعدادات', 'success');
    });
    
    // أحداث الماوس
    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouse.active = false;
    });
    
    // تغيير الحجم
    window.addEventListener('resize', function() {
        resizeCanvas();
        particles = [];
        waves = [];
        createParticles();
        createWaves();
    });
    
    // إغلاق لوحة الإعدادات بالنقر خارجها
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && 
            !settingsBtn.contains(e.target) && 
            !e.target.closest('.clock-btn')) {
            settingsPanel.classList.remove('show');
        }
    });
    
    // تهيئة الساعة
    resizeCanvas();
    loadSettings();
    updateControls();
    
    // إضافة مؤشر الوقت الحقيقي
    function createTimeDisplay() {
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'time-display';
        timeDisplay.innerHTML = `
            <h4>الوقت الحالي</h4>
            <div class="current-time" id="currentTime">00:00:00</div>
        `;
        document.body.appendChild(timeDisplay);
        
        // تحديث الوقت
        function updateTimeDisplay() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ar-SA');
            document.getElementById('currentTime').textContent = timeString;
            
            // إظهار/إخفاء عند التمرير
            if (window.scrollY > 300) {
                timeDisplay.classList.add('show');
            } else {
                timeDisplay.classList.remove('show');
            }
        }
        
        setInterval(updateTimeDisplay, 1000);
        updateTimeDisplay();
        
        // إخفاء عند النقر
        timeDisplay.addEventListener('click', function() {
            this.classList.remove('show');
        });
    }
    
    createTimeDisplay();
});
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