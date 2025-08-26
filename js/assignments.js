// إدارة التكاليف لمسؤولي المسارات

// متغيرات التكاليف
let currentAssignmentCount = 1;

// دالة إظهار نموذج التكليف
function showAssignmentForm() {
    if (!currentUser || currentUser.role !== 'path_manager') {
        showNotification('غير مصرح لك بهذا الإجراء', 'error');
        return;
    }
    
    showModal('assignmentModal');
    
    // إعادة تعيين عداد التكاليف
    currentAssignmentCount = 1;
    
    // تحديث قوائم مستوى النشر
    updateAssignmentPublishLevelOptions();
    
    // إعادة تعيين النموذج للتكليف الأول فقط
    resetAssignmentForm();
}

// دالة إعادة تعيين نموذج التكليف
function resetAssignmentForm() {
    const container = document.getElementById('assignmentsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="assignment-form" id="assignment1">
            <h4>التكليف الأول</h4>
            <div class="form-row">
                <div class="form-group full-width">
                    <label>نص التكليف:</label>
                    <textarea class="assignment-text" placeholder="اكتب نص التكليف هنا..." required></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label>الجهة المنفذة:</label>
                    <input type="text" class="executing-entity" placeholder="اسم الجهة المنفذة" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group half-width">
                    <label>زمن التنفيذ:</label>
                    <input type="datetime-local" class="execution-time" required>
                </div>
                <div class="form-group half-width">
                    <label>مستوى النشر:</label>
                    <select class="publish-level" required>
                        <option value="">اختر مستوى النشر</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group half-width">
                    <label>نوع الوسيلة:</label>
                    <select class="media-type" onchange="updateMediaOptionsNew(this)" required>
                        <option value="">اختر نوع الوسيلة</option>
                        <option value="تلفزيوني">تلفزيوني</option>
                        <option value="موقع">موقع</option>
                        <option value="شبكات اجتماعية">شبكات اجتماعية</option>
                    </select>
                </div>
                <div class="form-group half-width">
                    <label>الوسيلة:</label>
                    <select class="specific-media-select" required>
                        <option value="">اختر الوسيلة</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    // تحديث قوائم مستوى النشر للتكليف الأول
    updateAssignmentPublishLevelOptions();
}

// دالة إضافة تكليف آخر
function addAnotherAssignment() {
    currentAssignmentCount++;
    const container = document.getElementById('assignmentsContainer');
    
    const newAssignmentHTML = `
        <div class="assignment-form" id="assignment${currentAssignmentCount}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4>التكليف ${currentAssignmentCount}</h4>
                <button type="button" class="remove-assignment-btn" onclick="removeAssignment(${currentAssignmentCount})">حذف التكليف</button>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label>نص التكليف:</label>
                    <textarea class="assignment-text" placeholder="اكتب نص التكليف هنا..." required></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label>الجهة المنفذة:</label>
                    <input type="text" class="executing-entity" placeholder="اسم الجهة المنفذة" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group half-width">
                    <label>زمن التنفيذ:</label>
                    <input type="datetime-local" class="execution-time" required>
                </div>
                <div class="form-group half-width">
                    <label>مستوى النشر:</label>
                    <select class="publish-level" required>
                        <option value="">اختر مستوى النشر</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group half-width">
                    <label>نوع الوسيلة:</label>
                    <select class="media-type" onchange="updateMediaOptionsNew(this)" required>
                        <option value="">اختر نوع الوسيلة</option>
                        <option value="تلفزيوني">تلفزيوني</option>
                        <option value="موقع">موقع</option>
                        <option value="شبكات اجتماعية">شبكات اجتماعية</option>
                    </select>
                </div>
                <div class="form-group half-width">
                    <label>الوسيلة:</label>
                    <select class="specific-media-select" required>
                        <option value="">اختر الوسيلة</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newAssignmentHTML);
    
    // تحديث قوائم مستوى النشر للتكليف الجديد
    updateAssignmentPublishLevelOptions();
    
    // التمرير للتكليف الجديد
    const newAssignment = document.getElementById(`assignment${currentAssignmentCount}`);
    if (newAssignment) {
        newAssignment.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showNotification(`تم إضافة التكليف ${currentAssignmentCount}`);
}

// دالة حذف التكليف
function removeAssignment(assignmentNumber) {
    if (assignmentNumber === 1) {
        showNotification('لا يمكن حذف التكليف الأول', 'error');
        return;
    }
    
    const assignmentElement = document.getElementById(`assignment${assignmentNumber}`);
    if (assignmentElement) {
        assignmentElement.remove();
        showNotification(`تم حذف التكليف ${assignmentNumber}`);
    }
}

// دالة إرسال جميع التكاليف
function submitAllAssignments() {
    if (!currentUser || currentUser.role !== 'path_manager') {
        showNotification('غير مصرح لك بهذا الإجراء', 'error');
        return;
    }
    
    const assignmentForms = document.querySelectorAll('.assignment-form');
    const assignments = [];
    
    // جمع بيانات جميع التكاليف
    assignmentForms.forEach((form, index) => {
        const assignmentText = form.querySelector('.assignment-text').value.trim();
        const executingEntity = form.querySelector('.executing-entity').value.trim();
        const executionTime = form.querySelector('.execution-time').value;
        const publishLevel = form.querySelector('.publish-level').value;
        const mediaType = form.querySelector('.media-type').value;
        const specificMedia = form.querySelector('.specific-media-select').value;
        
        // التحقق من الحقول المطلوبة
        if (!assignmentText || !executingEntity || !executionTime || !publishLevel || !mediaType || !specificMedia) {
            showNotification(`يرجى ملء جميع الحقول في التكليف ${index + 1}`, 'error');
            return;
        }
        
        assignments.push({
            id: generateId(),
            text: assignmentText,
            executingEntity: executingEntity,
            executionTime: executionTime,
            publishLevel: publishLevel,
            mediaType: mediaType,
            specificMedia: specificMedia,
            path: currentUser.path,
            timestamp: new Date().toISOString()
        });
    });
    
    if (assignments.length === 0) {
        showNotification('لا توجد تكاليف صالحة للإرسال', 'error');
        return;
    }
    
    // إرسال التكاليف إلى صندوق الوارد للمدير
    const directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    
    assignments.forEach(assignment => {
        directorInbox.push({
            id: assignment.id,
            type: 'assignment',
            title: `تكليف من ${currentUser.name}`,
            content: assignment.text,
            details: {
                executingEntity: assignment.executingEntity,
                executionTime: assignment.executionTime,
                publishLevel: assignment.publishLevel,
                mediaType: assignment.mediaType,
                specificMedia: assignment.specificMedia,
                path: assignment.path
            },
            timestamp: assignment.timestamp,
            source: currentUser.name
        });
    });
    
    localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
    
    // حفظ التكاليف في سجل مسؤول المسار
    const pathAssignments = JSON.parse(localStorage.getItem(`assignments_${currentUser.path}`) || '[]');
    pathAssignments.push(...assignments);
    localStorage.setItem(`assignments_${currentUser.path}`, JSON.stringify(pathAssignments));
    
    closeModal('assignmentModal');
    showNotification(`تم إرسال ${assignments.length} تكليف بنجاح إلى المدير`);
    
    // إعادة تعيين النموذج
    currentAssignmentCount = 1;
}

// دالة تحديث خيارات مستوى النشر للتكاليف
function updateAssignmentPublishLevelOptions() {
    const publishLevels = JSON.parse(localStorage.getItem('publishLevels') || '[]');
    const publishLevelSelects = document.querySelectorAll('.publish-level');
    
    publishLevelSelects.forEach(select => {
        // الاحتفاظ بالقيمة المحددة حالياً
        const currentValue = select.value;
        
        // مسح الخيارات الحالية (عدا الخيار الأول)
        select.innerHTML = '<option value="">اختر مستوى النشر</option>';
        
        // إضافة مستويات النشر المحفوظة
        publishLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.name;
            option.textContent = level.name;
            select.appendChild(option);
        });
        
        // استعادة القيمة المحددة
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// دالة تحديث خيارات الوسائل حسب النوع
function updateMediaOptionsNew(selectElement) {
    const assignmentForm = selectElement.closest('.assignment-form');
    if (!assignmentForm) return;
    
    const mediaSelect = assignmentForm.querySelector('.specific-media-select');
    if (!mediaSelect) return;
    
    const mediaType = selectElement.value;
    
    // مسح الخيارات الحالية
    mediaSelect.innerHTML = '<option value="">اختر الوسيلة</option>';
    
    if (mediaType === 'تلفزيوني') {
        // إضافة القنوات التلفزيونية من إدارة الوسائل
        const channels = JSON.parse(localStorage.getItem('tvChannels') || '[]');
        channels.forEach(channel => {
            const option = document.createElement('option');
            option.value = channel.name;
            option.textContent = channel.name;
            mediaSelect.appendChild(option);
        });
    } else if (mediaType === 'موقع') {
        // إضافة المواقع من إدارة الوسائل
        const websites = JSON.parse(localStorage.getItem('websites') || '[]');
        websites.forEach(website => {
            const option = document.createElement('option');
            option.value = website.name;
            option.textContent = website.name;
            mediaSelect.appendChild(option);
        });
    } else if (mediaType === 'شبكات اجتماعية') {
        // إضافة "ناشطين" تلقائياً
        const option = document.createElement('option');
        option.value = 'ناشطين';
        option.textContent = 'ناشطين';
        option.selected = true;
        mediaSelect.appendChild(option);
    }
}

// دالة عرض التكاليف المرسلة
function showMyAssignments() {
    if (!currentUser || currentUser.role !== 'path_manager') {
        showNotification('غير مصرح لك بهذا الإجراء', 'error');
        return;
    }
    
    const pathAssignments = JSON.parse(localStorage.getItem(`assignments_${currentUser.path}`) || '[]');
    
    if (pathAssignments.length === 0) {
        showNotification('لا توجد تكاليف مرسلة');
        return;
    }
    
    // يمكن تطوير واجهة عرض التكاليف هنا
    alert(`لديك ${pathAssignments.length} تكليف مرسل`);
}

// إعداد مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث قوائم مستوى النشر عند تحميل الصفحة
    if (currentUser && currentUser.role === 'path_manager') {
        updateAssignmentPublishLevelOptions();
    }
});

