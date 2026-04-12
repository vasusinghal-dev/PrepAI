# 🎯 Interview Report Generator

An AI-powered web application that generates personalized interview preparation reports based on job descriptions, resumes, and self-descriptions. The app analyzes candidate profiles and job requirements to create tailored technical and behavioral questions, skill gap analysis, and a structured learning roadmap.

## ✨ Features

### Core Features

- **AI-Powered Report Generation**: Generate comprehensive interview reports using Gemini AI
- **Resume Parsing**: Upload PDF resumes and automatically extract content
- **Job Description Analysis**: Paste job descriptions for targeted preparation
- **Personalized Questions**: Get technical and behavioral questions tailored to your profile
- **Skill Gap Analysis**: Identify missing skills and prioritize learning
- **Learning Roadmap**: Receive a 30-day structured preparation plan
- **Resume PDF Generation**: AI-generated, ATS-friendly resume tailored to job descriptions

### User Interface

- **Dark Theme**: Modern dark-themed UI for reduced eye strain
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Dashboard**: Tab-based navigation for easy access to different sections
- **Real-time Validation**: Form validation with clear error messages
- **Loading States**: Visual feedback during report generation

### Report Sections

- **Overview**: View job description, resume, and self-description
- **Technical Questions**: Curated technical questions with interviewer intentions
- **Behavioral Questions**: STAR-method based behavioral questions
- **Roadmap**: Day-by-day preparation plan with actionable tasks
- **Skill Gaps**: Visual representation of missing skills with severity levels

## 🚀 Tech Stack

### Frontend

- **React 18** - UI framework
- **React Router DOM** - Navigation and routing
- **SCSS** - Styling with dark theme
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling

### AI & Processing

- **Google Gemini AI** - Report generation and resume enhancement
- **pdf-parse** - PDF text extraction

## 📁 Project Structure

```
interview-report-generator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── interview.controller.js
│   │   │   └── auth.controller.js
│   │   ├── models/
│   │   │   ├── blacklist.model.js
│   │   │   ├── interview.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── interview.routes.js
│   │   │   └── auth.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   └── ai.sanitizer.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TechnicalQuestions.jsx
│   │   │   ├── BehavioralQuestions.jsx
│   │   │   ├── RoadMap.jsx
│   │   │   └── Overview.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Reports.jsx
│   │   ├── hooks/
│   │   │   └── useInterview.jsx
│   │   ├── services/
│   │   │   └── interview.api.js
│   │   ├── styles/
│   │   │   ├── home.scss
│   │   │   ├── interview.scss
│   │   │   └── reports.scss
│   │   └── validations/
│   │       └── home.validation.js
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── context/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── auth.form.scss
│   │   │   └── interview/
│   │   │       ├── components/
│   │   │       ├── context/
│   │   │       ├── hooks/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       ├── style/
│   │   │       └── validations/
│   │   ├── style/
│   │   │   └── button.scss
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   ├── main.jsx
│   │   └── style.scss
│   └── package.json
└── README.md
```

## 🎯 Usage

### Generating an Interview Report

1. **Enter Job Description**: Paste the job description (minimum 50 characters)
2. **Upload Resume (Optional)**: Upload PDF resume (max 5MB)
3. **Add Self Description (Optional)**: Tell about your experience and skills
4. **Generate Report**: Click "Generate Interview Report" button
5. **View Results**: Navigate through different sections using the sidebar

### Navigating the Report

- **Overview**: View all input data in organized tabs
- **Technical Questions**: Practice with role-specific technical questions
- **Behavioral Questions**: Prepare answers using STAR method
- **Road Map**: Follow the 30-day preparation plan
- **Skill Gaps**: Identify and prioritize missing skills

### Download AI-Generated Resume

Click the "AI Generate Resume PDF" button in the Overview section to download an ATS-friendly, tailored resume.

## 🔒 Validation Rules

### Job Description

- Required field
- Minimum 50 characters
- Maximum 5000 characters

### Resume File

- Optional but recommended
- PDF format only
- Maximum file size: 5MB

### Self Description

- Optional
- Maximum 3000 characters
- At least one of Resume or Self Description required

## 📱 Responsive Design

- **Desktop**: Three-column layout with sidebar navigation
- **Tablet**: Collapsed sidebar with flexible content
- **Mobile**: Stacked layout with bottom navigation

## 🎨 Styling

- Dark theme with `#0f141a` background
- Accent color: `#e1034d` (red/pink)
- Success color: `#10b981` (green)
- Warning color: `#f59e0b` (orange)
- Error color: `#ef4444` (red)
- Smooth animations and transitions

## 🔐 Authentication

The application uses JWT-based authentication:

- Register/Login required to access reports
- Each user's reports are isolated and secure
- Tokens stored in localStorage

## 🚀 API Endpoints

### Interview Routes

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/api/interview/generate`       | Generate new interview report    |
| GET    | `/api/interview/:id`            | Get report by ID                 |
| GET    | `/api/interview/reports/all`    | Get all user reports             |
| DELETE | `/api/interview/:id`            | Delete a report                  |
| GET    | `/api/interview/resume/pdf/:id` | Download AI-generated resume PDF |

### Auth Routes

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login`    | User login        |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Authors

- **Vasu Singhal** - _Initial work_

## 🙏 Acknowledgments

- Google Gemini AI for report generation
- OpenAI for inspiration
- All contributors and testers

## 📞 Support

For support, email vasu.singhal.work@gmail.com or create an issue in the GitHub repository.

## 🐛 Known Issues

- Large PDF files may take time to parse
- AI generation may take 10-15 seconds for complex reports
- Some ad blockers may interfere with API calls

## 📝 Changelog

### v1.0.0 (2024-04-12)

- Initial release
- Core report generation functionality
- Resume PDF generation
- User authentication
- Responsive design

---

**Made with ❤️ by Vasu Singhal**

```

This README provides a comprehensive overview of your project, including setup instructions, features, tech stack, usage guidelines, and more. You can customize it further based on your specific needs!
```
