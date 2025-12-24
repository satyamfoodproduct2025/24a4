# Library Work Automate - Dashboard

A comprehensive library management system for managing students, seat bookings, payments, and attendance tracking.

## 🎯 Project Overview

**Library Work Automate** is a modern web-based library management dashboard that helps library owners efficiently manage their operations. The system provides a complete solution for student registration, seat allocation, payment tracking, and attendance management.

## ✨ Features

### 📚 Core Features
- **Student Management**: Add, view, and manage student records with auto-generated credentials
- **Seat Booking System**: Visual seat booking with 4 shifts (6AM-10AM, 10AM-2PM, 2PM-6PM, 6PM-10PM)
- **Payment Tracking**: Track monthly payments based on shifts booked
- **Attendance System**: Mark and view daily attendance records
- **Settings**: Configure total seats, pricing, and location settings
- **Print Support**: Print-friendly views for all reports

### 🔐 Dual Login System
- **Owner Login**: Full access to all management features
- **Student Login**: View personal attendance and payment status

### 💾 Data Persistence
- LocalStorage-based data management
- No database required - runs entirely in the browser
- Data persists across sessions

## 🚀 Tech Stack

- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Backend**: Hono framework on Cloudflare Workers
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6
- **Deployment**: Cloudflare Pages

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/satyamfoodproduct2025/24a4.git
cd 24a4
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run development server:
```bash
npm run dev:sandbox
```

5. Open browser and navigate to `http://localhost:3000`

## 🎮 Usage

### Default Owner Credentials
- **Mobile**: `6201530654`
- **Password**: `Avinash`

### Adding Students
1. Login as owner
2. Navigate to "Students Data"
3. Fill in the student form with:
   - Full Name
   - Father Name
   - Address
   - Mobile Number (10 digits)
   - Admission Date
4. System auto-generates username (mobile) and password
5. Share credentials with student

### Booking Seats
1. Navigate to "Seat Management"
2. Click on available (green) slot
3. Enter student mobile number
4. Confirm booking

### Managing Payments
1. Navigate to "Payment Details"
2. View all students with their shift counts and monthly payments
3. Payment calculation: Number of shifts × Rate per shift

### Tracking Attendance
1. Navigate to "Attendance Log"
2. View daily attendance status for all students
3. Green = Present, Red = Absent

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 UI Features

- **Modern Dark Theme**: Eye-friendly dark interface with gradient accents
- **Smooth Animations**: Subtle animations for better UX
- **Color-Coded Tables**: Easy-to-read tables with color-coded headers
- **Interactive Elements**: Hover effects and click feedback
- **Print-Optimized**: Clean print layouts for reports

## 🔧 Configuration

### Settings Panel
Customize the following:
- Total number of seats (1-500)
- Rate per shift (₹)
- Library location (Latitude, Longitude)
- GPS range for attendance (meters)
- QR code for attendance verification

## 📊 Data Models

### Student Record
```javascript
{
  id: "unique-id",
  fullName: "Student Name",
  fatherName: "Father Name",
  address: "Address",
  mobileNumber: "1234567890",
  admissionDate: "2024-01-01",
  userName: "1234567890",
  password: "AUTO1234"
}
```

### Booking Record
```javascript
{
  id: "unique-id",
  studentId: "student-id",
  seat: 1,
  shift: 1
}
```

### Payment Record
```javascript
{
  id: "unique-id",
  studentId: "student-id",
  year: 2024,
  month: 1,
  amount: 900,
  date: "2024-01-01"
}
```

### Attendance Record
```javascript
{
  id: "unique-id",
  studentId: "student-id",
  date: "2024-01-01",
  times: [
    { in: "9:00 AM", out: "1:00 PM" }
  ]
}
```

## 🌐 URLs

- **GitHub Repository**: https://github.com/satyamfoodproduct2025/24a4
- **Live Demo**: (To be deployed on Cloudflare Pages)

## 📝 Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run dev:sandbox      # Start with Wrangler for sandbox testing

# Build
npm run build            # Build for production

# Preview
npm run preview          # Preview production build locally

# Deploy
npm run deploy           # Build and deploy to Cloudflare Pages
npm run deploy:prod      # Deploy to production with project name

# Utilities
npm run clean-port       # Kill process on port 3000
npm run test             # Test local server with curl
```

## 🚀 Deployment

### Cloudflare Pages

1. Configure Cloudflare API key in Deploy tab
2. Run deployment:
```bash
npm run deploy:prod
```

3. Your app will be live at: `https://library-work-automate.pages.dev`

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to any static hosting service:
   - Cloudflare Pages
   - Vercel
   - Netlify
   - GitHub Pages

## 🔒 Security Notes

- Owner password should be changed in production
- Student passwords are auto-generated and should be kept secure
- LocalStorage data is client-side - consider backend integration for production use
- No sensitive data should be stored in the browser

## 🛠️ Development

### Project Structure
```
webapp/
├── src/
│   └── index.tsx          # Hono backend entry
├── public/
│   └── static/
│       ├── app.js         # Main application logic
│       └── style.css      # Styling
├── dist/                  # Built files
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── wrangler.jsonc         # Cloudflare configuration
└── ecosystem.config.cjs   # PM2 configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by **Avinash Kumar**

## 🙏 Acknowledgments

- Font Awesome for icons
- Hono framework for the backend
- Cloudflare for hosting infrastructure
- Google Fonts for Montserrat font family

## 📞 Support

For support, please create an issue on GitHub or contact the owner.

---

**Note**: This is a fresh installation with no dummy data. All features are ready to use out of the box!
