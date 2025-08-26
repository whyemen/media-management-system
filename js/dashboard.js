// إدارة لوحات التحكم والإشعارات

// بيانات الإشعارات النموذجية
const sampleNotifications = [
    {
        id: 2,
        source: 'الدائرة السياسية',
        type: 'consultation_response',
        priority: 'medium',
        time: 'منذ 15 دقيقة',
        content: 'رد على الاستشارة المرسلة بخصوص الموقف السياسي من القضية المطروحة',
        actions: ['view']
    },
    {
        id: 3,
        source: 'مسؤول المسار الاجتماعي',
        type: 'report',
        priority: 'normal',
        time: 'منذ 30 دقيقة',
        content: 'تقرير يومي عن تنفيذ التكاليف المحولة للمسار الاجتماعي',
        actions: ['view']
    },
    {
        id: 4,
        source: 'راصد الشبكات الاجتماعية',
        type: 'monitoring',
        priority: 'medium',
        time: 'منذ ساعة',
        content: 'رصد محتوى مهم يتطلب تحليل عاجل على منصات التواصل الاجتماعي',
        actions: ['assign']
    },
    {
        id: 5,
        source: 'شعبة الإنتاج',
        type: 'production',
        priority: 'normal',
        time: 'منذ ساعتين',
        content: 'اكتمال إنتاج المواد الإعلامية المطلوبة وجاهزيتها للنشر',
        actions: ['approve', 'review']
    }
];

// دالة تحميل الإشعارات للمدير
function loadNotifications() {
    // قراءة التكاليف من localStorage
    const directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    
    // دمج الإشعارات النموذجية مع التكاليف
    const allNotifications = [...directorInbox, ...sampleNotifications];
    
    // ترتيب الإشعارات حسب الوقت (الأحدث أولاً)
    allNotifications.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp) : new Date();
        const timeB = b.timestamp ? new Date(b.timestamp) : new Date();
        return timeB - timeA;
    });
    
    // تحديث عداد الإشعارات
    const counter = document.getElementById('notificationCounter');
    if (counter) {
        counter.textContent = allNotifications.length;
    }
    
    // تحديث قائمة الإشعارات في صندوق الوارد
    updateInboxNotifications(allNotifications);
}

// دالة تحديث إشعارات صندوق الوارد
function updateInboxNotifications(notifications) {
    const inboxContent = document.getElementById('inboxContent');
    if (!inboxContent) return;
    
    if (notifications.length === 0) {
        inboxContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>لا توجد إشعارات</h3>
                <p>سيتم عرض الإشعارات والتكاليف هنا</p>
            </div>
        `;
        return;
    }
    
    inboxContent.innerHTML = notifications.map(notification => {
        if (notification.type === 'assignment') {
            return createAssignmentNotificationHTML(notification);
        } else {
            return createRegularNotificationHTML(notification);
        }
    }).join('');
}

// دالة إنشاء HTML للتكليف
function createAssignmentNotificationHTML(assignment) {
    return `
        <div class="notification-item">
            <div class="notification-header">
                <span class="notification-source">${assignment.title}</span>
                <span class="notification-time">${formatDate(assignment.timestamp)}</span>
                <span class="assignment-badge" style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 12px;">تكليف</span>
            </div>
            <div class="notification-content">${assignment.content}</div>
            <div class="assignment-details" style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <div style="margin-bottom: 8px;"><strong>الجهة المنفذة:</strong> ${assignment.details.executingEntity}</div>
                <div style="margin-bottom: 8px;"><strong>زمن التنفيذ:</strong> ${formatDate(assignment.details.executionTime)}</div>
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
    `;
}

// دالة إنشاء HTML للإشعار العادي
function createRegularNotificationHTML(notification) {
    const priorityClass = notification.priority === 'urgent' ? 'urgent' : 
                         notification.priority === 'medium' ? 'medium' : 'normal';
    
    return `
        <div class="notification-item ${priorityClass}">
            <div class="notification-header">
                <span class="notification-source">${notification.source}</span>
                <span class="notification-time">${notification.time}</span>
            </div>
            <div class="notification-content">${notification.content}</div>
            <div class="notification-actions">
                ${createNotificationButtons(notification.actions)}
            </div>
        </div>
    `;
}

// دالة إنشاء أزرار الإشعارات
function createNotificationButtons(actions) {
    const buttonMap = {
        'approve': '<button class="notification-btn approve-btn" onclick="handleNotificationAction(\'approve\')">موافقة ✅</button>',
        'reject': '<button class="notification-btn reject-btn" onclick="handleNotificationAction(\'reject\')">رفض ❌</button>',
        'consult': '<button class="notification-btn consult-btn" onclick="handleNotificationAction(\'consult\')">استشارة 💬</button>',
        'view': '<button class="notification-btn consult-btn" onclick="handleNotificationAction(\'view\')">عرض 👁️</button>',
        'assign': '<button class="notification-btn approve-btn" onclick="handleNotificationAction(\'assign\')">تكليف 📋</button>',
        'review': '<button class="notification-btn consult-btn" onclick="handleNotificationAction(\'review\')">مراجعة 🔍</button>'
    };
    
    return actions.map(action => buttonMap[action] || '').join('');
}

// دالة معالجة إجراءات الإشعارات
function handleNotificationAction(action) {
    switch(action) {
        case 'approve':
            showNotification('تم الموافقة على الطلب');
            break;
        case 'reject':
            showNotification('تم رفض الطلب');
            break;
        case 'consult':
            showNotification('تم إرسال طلب الاستشارة');
            break;
        case 'view':
            showNotification('عرض التفاصيل...');
            break;
        case 'assign':
            showNotification('تم إرسال التكليف');
            break;
        case 'review':
            showNotification('تم إرسال للمراجعة');
            break;
        default:
            showNotification('تم تنفيذ الإجراء');
    }
}

// دالة إضافة موجه جديد
function addDirective(event) {
    event.preventDefault();
    
    const title = document.getElementById('directiveTitle').value;
    const content = document.getElementById('directiveContent').value;
    const priority = document.getElementById('directivePriority').value;
    
    if (!title || !content || !priority) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const directive = {
        id: generateId(),
        title: title,
        content: content,
        priority: priority,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // حفظ الموجه
    const directives = JSON.parse(localStorage.getItem('directives') || '[]');
    directives.push(directive);
    localStorage.setItem('directives', JSON.stringify(directives));
    
    // إظهار نافذة اختيار المسارات
    selectedDirectiveId = directive.id;
    closeModal('directiveModal');
    showModal('pathSelectionModal');
    
    // مسح النموذج
    document.getElementById('directiveForm').reset();
    
    showNotification('تم إضافة الموجه بنجاح');
}

// دالة إرسال الموجه للمسارات المحددة
function sendToSelectedPaths() {
    const checkboxes = document.querySelectorAll('.path-selection input[type="checkbox"]:checked');
    const selectedPaths = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedPaths.length === 0) {
        showNotification('يرجى اختيار مسار واحد على الأقل', 'error');
        return;
    }
    
    // الحصول على الموجه
    const directives = JSON.parse(localStorage.getItem('directives') || '[]');
    const directive = directives.find(d => d.id === selectedDirectiveId);
    
    if (!directive) {
        showNotification('خطأ في العثور على الموجه', 'error');
        return;
    }
    
    // إرسال الموجه لكل مسار محدد
    selectedPaths.forEach(path => {
        const pathDirectives = JSON.parse(localStorage.getItem(`pathDirectives_${path}`) || '[]');
        pathDirectives.push({
            ...directive,
            path: path,
            receivedAt: new Date().toISOString()
        });
        localStorage.setItem(`pathDirectives_${path}`, JSON.stringify(pathDirectives));
    });
    
    // تحديث حالة الموجه
    directive.status = 'sent';
    directive.sentToPaths = selectedPaths;
    directive.sentAt = new Date().toISOString();
    localStorage.setItem('directives', JSON.stringify(directives));
    
    closeModal('pathSelectionModal');
    showNotification(`تم إرسال الموجه إلى ${selectedPaths.length} مسار`);
    
    // مسح الاختيارات
    checkboxes.forEach(cb => cb.checked = false);
    selectedDirectiveId = null;
}

// دالة تحميل موجهات المسار
function loadPathDirectives(pathName) {
    const pathDirectives = JSON.parse(localStorage.getItem(`pathDirectives_${pathName}`) || '[]');
    
    // يمكن إضافة منطق عرض الموجهات هنا
    console.log(`تم تحميل ${pathDirectives.length} موجه للمسار ${pathName}`);
}

// دالة إظهار موجهات المسار
function showPathDirectives() {
    if (!currentUser || currentUser.role !== 'path_manager') {
        showNotification('غير مصرح لك بهذا الإجراء', 'error');
        return;
    }
    
    const pathDirectives = JSON.parse(localStorage.getItem(`pathDirectives_${currentUser.path}`) || '[]');
    
    if (pathDirectives.length === 0) {
        showNotification('لا توجد موجهات مرسلة لهذا المسار');
        return;
    }
    
    // عرض الموجهات في نافذة منبثقة أو صفحة منفصلة
    alert(`لديك ${pathDirectives.length} موجه في هذا المسار`);
}

// ربط الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // ربط نموذج إضافة الموجه
    const directiveForm = document.getElementById('directiveForm');
    if (directiveForm) {
        directiveForm.addEventListener('submit', addDirective);
    }
    
    // تحديث الإحصائيات كل 30 ثانية
    setInterval(updateStats, 30000);
});

