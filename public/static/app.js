// Library Work Automate - Main Application
// ==================================================
// Global State Management
// ==================================================

const state = {
    currentUser: null,
    currentView: 'login',
    loginType: 'owner',
    students: [], // NO DUMMY DATA
    bookings: [], // NO DUMMY DATA
    payments: [], // NO DUMMY DATA
    attendance: [], // NO DUMMY DATA
    settings: {
        ownerMobile: '6201530654',
        ownerPassword: 'Avinash',
        totalSeats: 50,
        ratePerShift: 300,
        shifts: 4,
        shiftTimes: {
            1: "6AM-10AM",
            2: "10AM-2PM", 
            3: "2PM-6PM",
            4: "6PM-10PM"
        },
        libraryLocation: {
            lat: 25.6127,
            lng: 85.1589,
            range: 20,
            set: false
        },
        qrCode: "LibraryWorkAutomate_StaticQR_v1"
    }
};

// ==================================================
// Utility Functions
// ==================================================

function generatePassword(fullName, mobile) {
    const namePart = fullName.trim().toUpperCase().replace(/[^A-Z\\s]/g, '').slice(0, 4);
    const mobilePart = mobile.slice(-4);
    return namePart.replace(/\\s/g, '') + mobilePart;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function getMonthName(month) {
    const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return names[month - 1];
}

// ==================================================
// Data Management Functions
// ==================================================

function addStudent(data) {
    const password = generatePassword(data.fullName, data.mobileNumber);
    const student = {
        ...data,
        userName: data.mobileNumber,
        password,
        id: Date.now().toString()
    };
    state.students.push(student);
    saveToLocalStorage();
    return student;
}

function updateStudent(id, data) {
    const index = state.students.findIndex(s => s.id === id);
    if (index !== -1) {
        state.students[index] = { ...state.students[index], ...data };
        saveToLocalStorage();
        return true;
    }
    return false;
}

function deleteStudent(id) {
    state.students = state.students.filter(s => s.id !== id);
    state.bookings = state.bookings.filter(b => b.studentId !== id);
    saveToLocalStorage();
}

function getStudentBySeatNo(seatNo) {
    const booking = state.bookings.find(b => b.seat === seatNo);
    return booking ? state.students.find(s => s.id === booking.studentId) : null;
}

function addBooking(studentId, seat, shift) {
    const booking = {
        studentId,
        seat: parseInt(seat),
        shift: parseInt(shift),
        id: Date.now().toString()
    };
    state.bookings.push(booking);
    saveToLocalStorage();
    return booking;
}

function removeBooking(seat, shift) {
    state.bookings = state.bookings.filter(b => !(b.seat === seat && b.shift === shift));
    saveToLocalStorage();
}

function getStudentBookings(studentId) {
    return state.bookings.filter(b => b.studentId === studentId);
}

function calculatePayment(studentId) {
    const bookings = getStudentBookings(studentId);
    return bookings.length * state.settings.ratePerShift;
}

function addPayment(studentId, year, month, amount) {
    const payment = {
        studentId,
        year: parseInt(year),
        month: parseInt(month),
        amount: parseFloat(amount),
        date: getCurrentDate(),
        id: Date.now().toString()
    };
    state.payments.push(payment);
    saveToLocalStorage();
    return payment;
}

function getStudentPayments(studentId) {
    return state.payments.filter(p => p.studentId === studentId);
}

function markAttendance(studentId, timeIn, timeOut) {
    const today = getCurrentDate();
    const existing = state.attendance.find(a => a.studentId === studentId && a.date === today);
    
    if (existing) {
        existing.times.push({ in: timeIn, out: timeOut });
    } else {
        state.attendance.push({
            studentId,
            date: today,
            times: [{ in: timeIn, out: timeOut }],
            id: Date.now().toString()
        });
    }
    saveToLocalStorage();
}

function getStudentAttendance(studentId, year, month) {
    return state.attendance.filter(a => {
        const date = new Date(a.date);
        return a.studentId === studentId && 
               date.getFullYear() === year && 
               date.getMonth() === month;
    });
}

// ==================================================
// Local Storage Functions
// ==================================================

function saveToLocalStorage() {
    try {
        localStorage.setItem('libraryWorkData', JSON.stringify({
            students: state.students,
            bookings: state.bookings,
            payments: state.payments,
            attendance: state.attendance,
            settings: state.settings
        }));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('libraryWorkData');
        if (data) {
            const parsed = JSON.parse(data);
            state.students = parsed.students || [];
            state.bookings = parsed.bookings || [];
            state.payments = parsed.payments || [];
            state.attendance = parsed.attendance || [];
            if (parsed.settings) {
                state.settings = { ...state.settings, ...parsed.settings };
            }
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
    }
}

// ==================================================
// View Rendering Functions
// ==================================================

function render() {
    const app = document.getElementById('app');
    
    switch(state.currentView) {
        case 'login':
            app.innerHTML = renderLogin();
            break;
        case 'dashboard':
            app.innerHTML = renderDashboard();
            break;
        case 'students':
            app.innerHTML = renderStudents();
            break;
        case 'seats':
            app.innerHTML = renderSeats();
            break;
        case 'payments':
            app.innerHTML = renderPayments();
            break;
        case 'attendance':
            app.innerHTML = renderAttendance();
            break;
        case 'settings':
            app.innerHTML = renderSettings();
            break;
        default:
            app.innerHTML = renderLogin();
    }
    
    attachEventListeners();
}

function renderLogin() {
    return \`
        <div class="login-container">
            <div class="header-text">
                <h2>Library Work</h2>
                <h1>Automate</h1>
            </div>
            <div class="tab-buttons">
                <button class="tab-button \${state.loginType === 'owner' ? 'active' : ''}" 
                        onclick="handleTabSwitch('owner')">Owner Login</button>
                <button class="tab-button \${state.loginType === 'student' ? 'active' : ''}" 
                        onclick="handleTabSwitch('student')">Student Login</button>
            </div>
            <form onsubmit="handleLogin(event)">
                <div class="input-group">
                    <i class="fas fa-mobile-alt"></i>
                    <input type="text" id="mobile" placeholder="Mobile Number" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="password" placeholder="Password" required>
                </div>
                <button type="submit" class="login-btn-final">
                    \${state.loginType.toUpperCase()} LOGIN
                </button>
            </form>
            <p id="errorMsg" class="error-message hidden"></p>
        </div>
    \`;
}

function renderDashboard() {
    return \`
        <div class="main-panel">
            <div class="welcome-header">
                <h2>Welcome</h2>
                <p>Library Work Automate Dashboard</p>
            </div>
            <div class="button-grid">
                <button class="dashboard-btn" onclick="navigateTo('students')" 
                        style="background: linear-gradient(135deg, #007bff, #00bcd4);">
                    <i class="fas fa-users"></i>
                    Students Data
                </button>
                <button class="dashboard-btn" onclick="navigateTo('seats')" 
                        style="background: linear-gradient(135deg, #ff9800, #ffc107);">
                    <i class="fas fa-chair"></i>
                    Seat Management
                </button>
                <button class="dashboard-btn" onclick="navigateTo('payments')" 
                        style="background: linear-gradient(135deg, #dc3545, #ff2a6d);">
                    <i class="fas fa-wallet"></i>
                    Payment Details
                </button>
                <button class="dashboard-btn" onclick="navigateTo('attendance')">
                    <i class="fas fa-calendar-check"></i>
                    Attendance Log
                </button>
                <button class="dashboard-btn" onclick="navigateTo('settings')" 
                        style="background: linear-gradient(135deg, #009688, #00bcd4);">
                    <i class="fas fa-cog"></i>
                    Settings
                </button>
            </div>
            <button class="logout-btn" onclick="handleLogout()">LOGOUT</button>
        </div>
    \`;
}

function renderStudents() {
    const studentsHTML = state.students.map((student, index) => \`
        <tr>
            <td>\${index + 1}</td>
            <td>\${student.fullName}</td>
            <td>\${student.fatherName}</td>
            <td>\${student.address}</td>
            <td>\${student.mobileNumber}</td>
            <td>\${formatDate(student.admissionDate)}</td>
            <td>\${student.userName}</td>
            <td>\${student.password}</td>
            <td>
                <button onclick="handleDeleteStudent('\${student.id}')" 
                        style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                    Delete
                </button>
            </td>
        </tr>
    \`).join('');
    
    return \`
        <div class="main-panel">
            <h2 style="color: var(--gradient-end); margin-bottom: 20px;">
                <i class="fas fa-users"></i> Registered Students
            </h2>
            
            <form onsubmit="handleAddStudent(event)" style="margin-bottom: 30px;">
                <input type="text" id="fullName" placeholder="Full Name" required>
                <input type="text" id="fatherName" placeholder="Father Name" required>
                <input type="text" id="address" placeholder="Address" required>
                <input type="tel" id="mobileNumber" placeholder="Mobile (10 digits)" 
                       required minlength="10" maxlength="10">
                <input type="date" id="admissionDate" required>
                <button type="submit">Add Student</button>
            </form>
            
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Full Name</th>
                            <th>Father Name</th>
                            <th>Address</th>
                            <th>Mobile</th>
                            <th>Admission Date</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${studentsHTML || '<tr><td colspan="9" class="text-center">No students registered yet</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="action-buttons-footer">
                <button class="back-btn" onclick="navigateTo('dashboard')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="print-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>
    \`;
}

function renderSeats() {
    let tableRows = '';
    for (let seat = 1; seat <= state.settings.totalSeats; seat++) {
        let row = \`<tr><td class="text-center"><b>\${seat}</b></td>\`;
        for (let shift = 1; shift <= state.settings.shifts; shift++) {
            const booking = state.bookings.find(b => b.seat === seat && b.shift === shift);
            const student = booking ? state.students.find(s => s.id === booking.studentId) : null;
            
            if (student) {
                row += \`<td style="background: #f8d7da; color: #721c24; text-align: center; cursor: pointer;" 
                            onclick="handleRemoveBooking(\${seat}, \${shift})">
                            \${student.fullName}<br>(\${student.mobileNumber.slice(-4)})
                        </td>\`;
            } else {
                row += \`<td style="background: #d4edda; color: #155724; text-align: center; cursor: pointer;" 
                            onclick="handleAddBooking(\${seat}, \${shift})">
                            Available
                        </td>\`;
            }
        }
        row += '</tr>';
        tableRows += row;
    }
    
    return \`
        <div class="main-panel">
            <h2 style="color: var(--gradient-start); margin-bottom: 20px;">
                <i class="fas fa-chair"></i> Seat Booking Dashboard
            </h2>
            
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%;">Seat No.</th>
                            <th style="width: 22.5%;">Shift 1 (6AM-10AM)</th>
                            <th style="width: 22.5%;">Shift 2 (10AM-2PM)</th>
                            <th style="width: 22.5%;">Shift 3 (2PM-6PM)</th>
                            <th style="width: 22.5%;">Shift 4 (6PM-10PM)</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${tableRows}
                    </tbody>
                </table>
            </div>
            
            <div class="action-buttons-footer">
                <button class="back-btn" onclick="navigateTo('dashboard')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="print-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>
    \`;
}

function renderPayments() {
    const paymentsHTML = state.students.map((student, index) => {
        const payment = calculatePayment(student.id);
        const bookings = getStudentBookings(student.id);
        const shifts = bookings.length;
        
        return \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${student.fullName}</td>
                <td>\${student.address}</td>
                <td>\${student.mobileNumber}</td>
                <td class="text-center">\${shifts}</td>
                <td class="text-center" style="color: #4caf50; font-weight: bold;">₹\${payment}</td>
            </tr>
        \`;
    }).join('');
    
    return \`
        <div class="main-panel">
            <h2 style="color: #f44336; margin-bottom: 20px;">
                <i class="fas fa-wallet"></i> Payment Details
            </h2>
            
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Full Name</th>
                            <th>Address</th>
                            <th>Mobile</th>
                            <th>Shifts</th>
                            <th>Monthly Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${paymentsHTML || '<tr><td colspan="6" class="text-center">No payment records</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="action-buttons-footer">
                <button class="back-btn" onclick="navigateTo('dashboard')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="print-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>
    \`;
}

function renderAttendance() {
    const today = new Date();
    const attendanceHTML = state.students.map((student, index) => {
        const todayAttendance = state.attendance.find(a => 
            a.studentId === student.id && a.date === getCurrentDate()
        );
        const status = todayAttendance && todayAttendance.times.length > 0 ? 'Present' : 'Absent';
        const statusColor = status === 'Present' ? '#4caf50' : '#dc3545';
        
        return \`
            <tr>
                <td>\${index + 1}</td>
                <td>\${student.fullName}</td>
                <td>\${student.mobileNumber}</td>
                <td class="text-center" style="color: \${statusColor}; font-weight: bold;">\${status}</td>
                <td class="text-center">
                    \${todayAttendance ? todayAttendance.times.map(t => \`\${t.in} - \${t.out}\`).join(', ') : '-'}
                </td>
            </tr>
        \`;
    }).join('');
    
    return \`
        <div class="main-panel">
            <h2 style="color: #17a2b8; margin-bottom: 20px;">
                <i class="fas fa-calendar-check"></i> Attendance Log - \${formatDate(getCurrentDate())}
            </h2>
            
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Full Name</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Times</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${attendanceHTML || '<tr><td colspan="5" class="text-center">No attendance records</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="action-buttons-footer">
                <button class="back-btn" onclick="navigateTo('dashboard')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="print-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>
    \`;
}

function renderSettings() {
    return \`
        <div class="main-panel">
            <h2 style="color: var(--gradient-end); margin-bottom: 20px;">
                <i class="fas fa-cog"></i> Settings
            </h2>
            
            <form onsubmit="handleUpdateSettings(event)">
                <div style="grid-column: 1 / -1;">
                    <h3 style="color: var(--gradient-start); margin-bottom: 15px;">General Settings</h3>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #bbb;">Total Seats</label>
                    <input type="number" id="totalSeats" value="\${state.settings.totalSeats}" 
                           min="1" max="500" required>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #bbb;">Rate Per Shift (₹)</label>
                    <input type="number" id="ratePerShift" value="\${state.settings.ratePerShift}" 
                           min="1" required>
                </div>
                
                <div style="grid-column: 1 / -1;">
                    <h3 style="color: var(--gradient-start); margin: 20px 0 15px 0;">Location Settings</h3>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #bbb;">Latitude</label>
                    <input type="text" id="locationLat" value="\${state.settings.libraryLocation.lat}" 
                           placeholder="25.6127">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #bbb;">Longitude</label>
                    <input type="text" id="locationLng" value="\${state.settings.libraryLocation.lng}" 
                           placeholder="85.1589">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #bbb;">Range (meters)</label>
                    <input type="number" id="locationRange" value="\${state.settings.libraryLocation.range}" 
                           min="1" max="100">
                </div>
                
                <button type="submit">Save Settings</button>
            </form>
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <h3 style="color: var(--gradient-end); margin-bottom: 15px;">
                    <i class="fas fa-qrcode"></i> Library QR Code
                </h3>
                <p style="color: #bbb; margin-bottom: 10px;">QR Code: <strong>\${state.settings.qrCode}</strong></p>
                <p style="color: #aaa; font-size: 0.9rem;">Students need to scan this QR code for attendance</p>
            </div>
            
            <div class="action-buttons-footer">
                <button class="back-btn" onclick="navigateTo('dashboard')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </div>
    \`;
}

// ==================================================
// Event Handlers
// ==================================================

function attachEventListeners() {
    // This function is called after each render to attach event listeners
    // Event handlers are defined as global functions to work with onclick attributes
}

function handleTabSwitch(type) {
    state.loginType = type;
    render();
}

function handleLogin(event) {
    event.preventDefault();
    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    
    if (state.loginType === 'owner') {
        if (mobile === state.settings.ownerMobile && password === state.settings.ownerPassword) {
            state.currentUser = { type: 'owner', mobile };
            state.currentView = 'dashboard';
            render();
        } else {
            errorMsg.textContent = 'Invalid owner credentials';
            errorMsg.classList.remove('hidden');
        }
    } else {
        const student = state.students.find(s => 
            s.userName === mobile && s.password === password
        );
        if (student) {
            state.currentUser = { type: 'student', ...student };
            state.currentView = 'dashboard'; // For students, show a simplified dashboard
            render();
        } else {
            errorMsg.textContent = 'Invalid student credentials';
            errorMsg.classList.remove('hidden');
        }
    }
}

function handleLogout() {
    state.currentUser = null;
    state.currentView = 'login';
    render();
}

function handleAddStudent(event) {
    event.preventDefault();
    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        fatherName: document.getElementById('fatherName').value.trim(),
        address: document.getElementById('address').value.trim(),
        mobileNumber: document.getElementById('mobileNumber').value.trim(),
        admissionDate: document.getElementById('admissionDate').value
    };
    
    // Check for duplicate mobile
    if (state.students.some(s => s.mobileNumber === data.mobileNumber)) {
        alert('Mobile number already registered!');
        return;
    }
    
    const student = addStudent(data);
    alert(\`Student added successfully!\\nUsername: \${student.userName}\\nPassword: \${student.password}\`);
    render();
}

function handleDeleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudent(id);
        render();
    }
}

function handleAddBooking(seat, shift) {
    const mobile = prompt('Enter student mobile number (10 digits):');
    if (!mobile || mobile.length !== 10) {
        alert('Invalid mobile number');
        return;
    }
    
    const student = state.students.find(s => s.mobileNumber === mobile);
    if (!student) {
        alert('Student not found. Please add the student first.');
        return;
    }
    
    addBooking(student.id, seat, shift);
    alert(\`Seat \${seat}, Shift \${shift} booked for \${student.fullName}\`);
    render();
}

function handleRemoveBooking(seat, shift) {
    if (confirm(\`Cancel booking for Seat \${seat}, Shift \${shift}?\`)) {
        removeBooking(seat, shift);
        render();
    }
}

function handleUpdateSettings(event) {
    event.preventDefault();
    
    state.settings.totalSeats = parseInt(document.getElementById('totalSeats').value);
    state.settings.ratePerShift = parseInt(document.getElementById('ratePerShift').value);
    state.settings.libraryLocation.lat = parseFloat(document.getElementById('locationLat').value);
    state.settings.libraryLocation.lng = parseFloat(document.getElementById('locationLng').value);
    state.settings.libraryLocation.range = parseInt(document.getElementById('locationRange').value);
    state.settings.libraryLocation.set = true;
    
    saveToLocalStorage();
    alert('Settings saved successfully!');
}

function navigateTo(view) {
    state.currentView = view;
    render();
}

// Make functions globally available
window.handleTabSwitch = handleTabSwitch;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.handleAddStudent = handleAddStudent;
window.handleDeleteStudent = handleDeleteStudent;
window.handleAddBooking = handleAddBooking;
window.handleRemoveBooking = handleRemoveBooking;
window.handleUpdateSettings = handleUpdateSettings;
window.navigateTo = navigateTo;

// ==================================================
// Initialize Application
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    render();
});
