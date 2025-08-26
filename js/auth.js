// نظام المصادقة وإدارة المستخدمين

// بيانات المستخدمين والصلاحيات
const users = {
    'director': {
        password: '123',
        role: 'director',
        name: 'قيادة الدائرة',
        dashboard: 'directorDashboard',
        modules: ['social', 'web', 'tv', 'analysis', 'production', 'publishing', 'political', 'directives', 'consultations']
    },
    'social': {
        password: '123',
        role: 'social_monitor',
        name: 'راصد الشبكات الاجتماعية',
        dashboard: 'socialDashboard',
        modules: ['social']
    },
    'web': {
        password: '123',
        role: 'web_monitor',
        name: 'راصد المواقع الإلكترونية',
        dashboard: 'webDashboard',
        modules: ['web']
    },
    'tv': {
        password: '123',
        role: 'tv_monitor',
        name: 'راصد القنوات التلفزيونية',
        dashboard: 'tvDashboard',
        modules: ['tv']
    },
    'analyst': {
        password: '123',
        role: 'analyst',
        name: 'المحلل',
        dashboard: 'analystDashboard',
        modules: ['analysis']
    },
    // مسؤولو المسارات الخمسة
    'political_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار السياسي',
        dashboard: 'pathManagerDashboard',
        path: 'السياسي',
        modules: ['path_management']
    },
    'cultural_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الثقافي',
        dashboard: 'pathManagerDashboard',
        path: 'الثقافي',
        modules: ['path_management']
    },
    'social_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الاجتماعي',
        dashboard: 'pathManagerDashboard',
        path: 'الاجتماعي',
        modules: ['path_management']
    },
    'propaganda_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الدعائي',
        dashboard: 'pathManagerDashboard',
        path: 'الدعائي',
        modules: ['path_management']
    },
    'international_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الدولي',
        dashboard: 'pathManagerDashboard',
        path: 'الدولي',
        modules: ['path_management']
    }
};

// متغير المستخدم الحالي
let currentUser = null;

// دالة تسجيل الدخول
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        
        // إخفاء نموذج تسجيل الدخول
        document.getElementById('loginContainer').style.display = 'none';
        
        // إظهار لوحة التحكم المناسبة
        document.getElementById(users[username].dashboard).style.display = 'block';
        
        // تحديث عنوان لوحة التحكم لمسؤولي المسارات
        if (users[username].role === 'path_manager') {
            const titleElement = document.getElementById('pathManagerTitle');
            if (titleElement) {
                titleElement.textContent = users[username].name;
            }
        }
        
        // تحميل البيانات المناسبة حسب نوع المستخدم
        loadUserData(username);
        
        showNotification(`مرحباً ${users[username].name}`);
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// دالة تحميل بيانات المستخدم
function loadUserData(username) {
    const user = users[username];
    
    switch(user.role) {
        case 'director':
            loadNotifications();
            updateStats();
            break;
        case 'analyst':
            loadMonitoringData();
            break;
        case 'path_manager':
            loadPathDirectives(user.path);
            updateAssignmentPublishLevelOptions();
            break;
        case 'social_monitor':
        case 'web_monitor':
        case 'tv_monitor':
            updatePublishLevelOptions();
            updateFileOptions();
            updateIssueOptions();
            break;
    }
}

// دالة تسجيل الخروج
function logout() {
    currentUser = null;
    
    // إخفاء جميع لوحات التحكم
    const dashboards = document.querySelectorAll('.dashboard');
    dashboards.forEach(dashboard => {
        dashboard.style.display = 'none';
    });
    
    // إظهار نموذج تسجيل الدخول
    document.getElementById('loginContainer').style.display = 'block';
    
    // مسح النماذج
    document.getElementById('loginForm').reset();
    
    showNotification('تم تسجيل الخروج بنجاح');
}

// دالة التحقق من الصلاحيات
function hasPermission(module) {
    if (!currentUser) return false;
    return currentUser.modules.includes(module);
}

// دالة عرض الإشعارات
function showNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// إضافة أنماط CSS للإشعارات
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ربط دالة تسجيل الدخول بالنموذج
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
});

