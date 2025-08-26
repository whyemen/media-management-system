// الملف الرئيسي للتطبيق

// متغيرات عامة
let selectedDirectiveId = null;
let currentAssignmentCount = 1;

// بيانات الكيانات للمواقع والقنوات
let websiteEntities = {
    'الجزيرة نت': 'الإعلام المستقل',
    'العربية نت': 'السعودية',
    'بي بي سي عربي': 'الإعلام الدولي',
    'سكاي نيوز عربية': 'الإمارات',
    'فرانس 24': 'الإعلام الدولي',
    'الشرق الأوسط': 'السعودية',
    'سبأ نت': 'الحكومة',
    'وكالة سبأ للأنباء': 'الحكومة',
    'المسيرة نت': 'الحوثي',
    'الثورة نت': 'الحوثي',
    'المسيرة': 'الحوثي',
    'عدن تايم': 'الانتقالي',
    'عدن الغد': 'الانتقالي',
    'الأيام نت': 'الإعلام المستقل اليمني',
    'نشوان نيوز': 'الإعلام المستقل اليمني'
};

let tvEntities = {
    'الجزيرة': 'الإعلام المستقل',
    'العربية': 'السعودية',
    'بي بي سي عربي': 'الإعلام الدولي',
    'سكاي نيوز عربية': 'الإمارات',
    'فرانس 24': 'الإعلام الدولي',
    'الحدث': 'السعودية',
    'اليمن اليوم': 'الحكومة',
    'قناة اليمن': 'الحكومة',
    'سهيل': 'الحكومة',
    'المسيرة': 'الحوثي',
    'الحوثي': 'الحوثي',
    'يمن شباب': 'الحوثي',
    'عدن': 'الانتقالي',
    'الغد المشرق': 'الانتقالي',
    'بلقيس': 'الإعلام المستقل اليمني'
};

// دوال إدارة النوافذ المنبثقة
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        overlay.style.display = 'block';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// دالة إظهار نموذج الموجه
function showDirectiveForm() {
    showModal('directiveModal');
}

// دالة إظهار صندوق الوارد
function showInbox() {
    showModal('inboxModal');
    loadInboxContent();
}

// دالة تحميل محتوى صندوق الوارد
function loadInboxContent() {
    const inboxContent = document.getElementById('inboxContent');
    if (!inboxContent) return;
    
    // قراءة التكاليف من localStorage
    const directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    
    if (directorInbox.length === 0) {
        inboxContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>لا توجد تكاليف في صندوق الوارد</h3>
                <p>سيتم عرض التكاليف المرسلة من مسؤولي المسارات هنا</p>
            </div>
        `;
        return;
    }
    
    // ترتيب التكاليف حسب التاريخ (الأحدث أولاً)
    directorInbox.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    inboxContent.innerHTML = directorInbox.map(assignment => `
        <div class="notification-item">
            <div class="notification-header">
                <span class="notification-source">${assignment.title}</span>
                <span class="notification-time">${new Date(assignment.timestamp).toLocaleString('ar-SA')}</span>
                <span class="assignment-badge" style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 12px;">تكليف</span>
            </div>
            <div class="notification-content">${assignment.content}</div>
            <div class="assignment-details" style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <div style="margin-bottom: 8px;"><strong>الجهة المنفذة:</strong> ${assignment.details.executingEntity}</div>
                <div style="margin-bottom: 8px;"><strong>زمن التنفيذ:</strong> ${new Date(assignment.details.executionTime).toLocaleString('ar-SA')}</div>
                <div style="margin-bottom: 8px;"><strong>مستوى النشر:</strong> ${assignment.details.publishLevel}</div>
                <div style="margin-bottom: 8px;"><strong>نوع الوسيلة:</strong> ${assignment.details.mediaType}</div>
                <div style="margin-bottom: 8px;"><strong>الوسيلة:</strong> ${assignment.details.specificMedia}</div>
                <div><strong>المسار:</strong> ${assignment.details.path}</div>
            </div>
            <div class="notification-actions">
                <button class="notification-btn approve-btn" onclick="approveAssignment('${assignment.id}', this)">إقرار التكليف ✅</button>
                <button class="notification-btn reject-btn" onclick="rejectAssignment('${assignment.id}', this)">رفض التكليف ❌</button>
                <button class="notification-btn consult-btn" onclick="requestAssignmentModification('${assignment.id}', this)">طلب تعديل ⚠️</button>
            </div>
        </div>
    `).join('');
}

// دالة إقرار التكليف
function approveAssignment(assignmentId, buttonElement) {
    // إزالة التكليف من صندوق الوارد
    let directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    directorInbox = directorInbox.filter(assignment => assignment.id !== assignmentId);
    localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
    
    // إضافة إلى التكاليف المعتمدة
    const approvedAssignments = JSON.parse(localStorage.getItem('approvedAssignments') || '[]');
    const assignment = JSON.parse(localStorage.getItem('directorInbox') || '[]').find(a => a.id === assignmentId);
    if (assignment) {
        assignment.status = 'approved';
        assignment.approvedAt = new Date().toISOString();
        approvedAssignments.push(assignment);
        localStorage.setItem('approvedAssignments', JSON.stringify(approvedAssignments));
    }
    
    // تحديث الواجهة
    buttonElement.parentElement.innerHTML = '<span style="color: #28a745; font-weight: bold;">✅ تم إقرار التكليف</span>';
    showNotification('تم إقرار التكليف بنجاح');
    
    // تحديث الإحصائيات
    updateStats();
}

// دالة رفض التكليف
function rejectAssignment(assignmentId, buttonElement) {
    // إزالة التكليف من صندوق الوارد
    let directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    directorInbox = directorInbox.filter(assignment => assignment.id !== assignmentId);
    localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
    
    // تحديث الواجهة
    buttonElement.parentElement.innerHTML = '<span style="color: #dc3545; font-weight: bold;">❌ تم رفض التكليف</span>';
    showNotification('تم رفض التكليف');
    
    // تحديث الإحصائيات
    updateStats();
}

// دالة طلب تعديل التكليف
function requestAssignmentModification(assignmentId, buttonElement) {
    const reason = prompt('أدخل سبب طلب التعديل:');
    if (reason) {
        // إزالة التكليف من صندوق الوارد
        let directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
        directorInbox = directorInbox.filter(assignment => assignment.id !== assignmentId);
        localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
        
        // تحديث الواجهة
        buttonElement.parentElement.innerHTML = `<span style="color: #ffc107; font-weight: bold;">⚠️ تم طلب التعديل: ${reason}</span>`;
        showNotification('تم إرسال طلب التعديل');
        
        // تحديث الإحصائيات
        updateStats();
    }
}

// دالة تحديث الإحصائيات
function updateStats() {
    const directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    const approvedAssignments = JSON.parse(localStorage.getItem('approvedAssignments') || '[]');
    const monitoringData = JSON.parse(localStorage.getItem('monitoringData') || '[]');
    
    // تحديث عدد الموجهات المعلقة
    const pendingElement = document.getElementById('pendingDirectives');
    if (pendingElement) {
        pendingElement.textContent = directorInbox.length;
    }
    
    // تحديث عدد الموجهات المعتمدة
    const approvedElement = document.getElementById('approvedDirectives');
    if (approvedElement) {
        approvedElement.textContent = approvedAssignments.length;
    }
    
    // تحديث عدد التقارير الجديدة
    const reportsElement = document.getElementById('newReports');
    if (reportsElement) {
        reportsElement.textContent = monitoringData.length;
    }
}

// دالة إظهار التقارير
function showReports() {
    alert('ميزة عرض التقارير قيد التطوير');
}

// دالة إدارة التبويبات
function showTab(tabName) {
    // إخفاء جميع محتويات التبويبات
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع أزرار التبويبات
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // إظهار التبويب المحدد
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // تفعيل زر التبويب المحدد
    const selectedButton = event.target;
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// دالة إنشاء معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// دالة تنسيق التاريخ
function formatDate(date) {
    return new Date(date).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// إعداد مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إغلاق النوافذ المنبثقة عند النقر على الخلفية
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // منع إغلاق النافذة عند النقر على المحتوى
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // تحديث الإحصائيات عند تحميل الصفحة
    updateStats();
});

