import React, { Component, createRef } from 'react';
import { callApi, getSession } from './api';
import {
  FaRegImage, FaRegFileVideo, FaRegTrashAlt,
  FaPlusSquare, FaRegFileAlt, FaUser, FaRegFilePdf, FaHome
} from 'react-icons/fa';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const allowedTypes = [
  'image/jpeg', 'image/png', 'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/rtf', 'application/vnd.oasis.opendocument.text',
  'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', 'video/x-ms-wmv'
];

const CATEGORIES = [
  'Water Management',
  'Traffic Management',
  'Sanitation Management',
  'Education Management',
  'Municipals Management',
  'Public Infrastructure'
];
const PRIORITIES = [
  { label: 'Low', color: 'bg-green-100 text-green-700 border-green-400' },
  { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-400' },
  { label: 'High', color: 'bg-red-100 text-red-700 border-red-400' }
];

class Complaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      submissionType: 'Public',
      category: '',
      priority: '',
      subject: '',
      description: '',
      uploadedFilesInfo: [],
      fileError: '',
      theme: localStorage.getItem("appTheme") || "light"
    };
    this.fileInputRef = createRef();
  }

  componentDidMount() {
    document.body.className = this.state.theme === "dark" ? "bg-gray-900" : "";
    const crs = getSession('csrid');
    if (!crs) return window.location.replace('/');
    callApi('POST', 'http://localhost:8419/users/getfullname', JSON.stringify({ csrid: crs }), (response) => {
      this.setState({ username: response });
    });
  }

  setSubmissionType = (type) => this.setState({ submissionType: type });
  setCategory = (cat) => this.setState({ category: cat });
  setPriority = (priority) => this.setState({ priority });

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onFileSelected = (e) => {
    const files = Array.from(e.target.files);
    const currFilesInfo = [...this.state.uploadedFilesInfo];
    const MAX_FILES = 2;
    let errorMsg = '';
    if (currFilesInfo.length + files.length > MAX_FILES) {
      this.setState({ fileError: `Maximum ${MAX_FILES} files allowed.` });
      e.target.value = '';
      return;
    }
    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) errorMsg = `Unsupported file type: ${file.name}`;
      else if (file.size > MAX_FILE_SIZE) errorMsg = `File too large (max 50MB): ${file.name}`;
      else {
        const reader = new FileReader();
        reader.onloadend = () => {
          currFilesInfo.push({ name: file.name, type: file.type, base64: reader.result });
          this.setState({ uploadedFilesInfo: currFilesInfo, fileError: '' });
        };
        reader.readAsDataURL(file);
      }
    });
    if (errorMsg) this.setState({ fileError: errorMsg });
    e.target.value = '';
  };

  handleDeleteMedia = (index) => {
    const files = [...this.state.uploadedFilesInfo];
    files.splice(index, 1);
    this.setState({ uploadedFilesInfo: files });
  };

  // CRITICAL SECTION: This guarantees admin will get your user's complaint.
  submitComplaint = () => {
    const crs = getSession('csrid');
    if (!crs) return;
    const complaintsKey = `complaints_${crs}`;
    const {
      submissionType, category, priority,
      subject, description, uploadedFilesInfo
    } = this.state;

    // Compose the complaint object with all fields needed for both user/admin view.
    const newComplaint = {
      id: Date.now(),
      submissionType,
      category,
      priority,
      subject,
      description,
      attachments: uploadedFilesInfo,
      status: 'Complaint Submitted',
      timeline: [{
        status: 'Complaint Submitted',
        date: new Date().toLocaleString(),
        comment: 'Submitted by user.'
      }]
    };

    // Add to user's own complaints
    const stored = window.sessionStorage.getItem(complaintsKey);
    const complaints = stored ? JSON.parse(stored) : [];
    complaints.push(newComplaint);
    window.sessionStorage.setItem(complaintsKey, JSON.stringify(complaints));

    // Add to admin view complaints_all (IMPORTANT!)
    // Enrich with username and date for admin display compatibility.
    const allStored = window.sessionStorage.getItem('complaints_all');
    const allComplaints = allStored ? JSON.parse(allStored) : [];
    allComplaints.push({
      ...newComplaint,
      user: this.state.username || "Anonymous",
      date: new Date().toISOString().split("T")[0]
    });
    window.sessionStorage.setItem('complaints_all', JSON.stringify(allComplaints));

    alert('Complaint submitted successfully!');
    this.setState({
      submissionType: 'Public',
      category: '',
      priority: '',
      subject: '',
      description: '',
      uploadedFilesInfo: [],
      fileError: ''
    });
  };

  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return <FaRegImage size={25} />;
    if (fileType.startsWith('video/')) return <FaRegFileVideo size={25} />;
    if (fileType === 'application/pdf') return <FaRegFilePdf size={25} />;
    return <FaRegFileAlt size={25} />;
  }

  handleLogout = () => {
    window.sessionStorage.clear();
    window.location.replace("/login");
  };

  render() {
    const {
      username, submissionType, category, priority,
      subject, description, uploadedFilesInfo, fileError, theme
    } = this.state;

    return (
      <>
        {/* Header Bar */}
        <header className="w-full h-[60px] flex items-center justify-between px-5 sm:px-8 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow fixed top-0 z-10">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
            Grievance Portal
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-white text-sm sm:text-base mr-2">Welcome, {username || "User"}</span>
            <button
              onClick={this.handleLogout}
              className="bg-gradient-to-r from-pink-400 via-orange-400 to-pink-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-pink-500 hover:to-orange-500"
            >
              Logout
            </button>
          </div>
        </header>
        {/* Centered Complaint Box */}
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"} min-h-screen w-full flex justify-center items-center pt-[72px] pb-32`}>
          <div
            className="
              bg-white/80 backdrop-blur-md rounded-3xl shadow-lg flex flex-col
              py-7 px-4 xs:px-6 sm:px-8 md:px-10
              w-full
              max-w-[355px] xs:max-w-[370px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[470px] xl:max-w-[500px] 2xl:max-w-[520px]
            "
            style={{ boxSizing: 'border-box' }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">
              Submit Complaint
            </h2>
            <p className="text-center text-sm md:text-base text-purple-700 mb-4">
              Welcome, {username || 'User'}!
            </p>
            {/* Submission Type */}
            <div className="flex gap-2 mb-3">
              {['Public', 'Anonymous'].map((type) => (
                <button
                  key={type}
                  onClick={() => this.setSubmissionType(type)}
                  className={`flex-1 py-2 rounded-2xl font-semibold transition-all text-sm md:text-base ${
                    submissionType === type
                      ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-purple-700 border border-purple-300 hover:bg-purple-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {/* Category Select Dropdown */}
            <div className="mb-3">
              <label className="block text-purple-700 font-bold mb-1">Category</label>
              <select
                className="w-full p-3 rounded-xl border border-purple-300 bg-white/80 text-purple-700 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={category}
                onChange={(e) => this.setCategory(e.target.value)}
              >
                <option value="">Select Category...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Priority Section */}
            <div className="mb-3">
              <label className="block text-purple-700 font-bold mb-1">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map(opt => (
                  <button
                    type="button"
                    key={opt.label}
                    onClick={() => this.setPriority(opt.label)}
                    className={`flex-1 py-2 transition font-semibold rounded-2xl border-2 focus:outline-none text-base ${priority === opt.label
                      ? `${opt.color} border-2 shadow` : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'}`}
                    style={{ minWidth: 0 }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={this.handleChange}
              className="w-full p-2 md:p-3 mb-3 rounded-xl border border-purple-300 bg-white/80 text-purple-700 font-semibold placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={this.handleChange}
              className="w-full p-2 md:p-3 mb-3 rounded-xl border border-purple-300 bg-white/80 text-purple-700 font-semibold placeholder-purple-400 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {/* File Upload Section */}
            <div className="mb-3">
              <label className="block text-purple-700 font-bold mb-1">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-purple-400 rounded-2xl p-3 flex flex-col items-center">
                <p className="text-sm text-purple-700 mb-2">Attach images, videos, or documents. Max 50MB.</p>
                {fileError && <p className="text-red-600 text-sm mb-2">{fileError}</p>}
                <input
                  type="file"
                  ref={this.fileInputRef}
                  multiple
                  style={{ display: 'none' }}
                  accept={allowedTypes.join(',')}
                  onChange={this.onFileSelected}
                />
                <button
                  onClick={() => this.fileInputRef.current.click()}
                  className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl font-bold text-base hover:scale-105 transition-transform shadow-md"
                >
                  Upload Files
                </button>
              </div>
              {uploadedFilesInfo.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                  {uploadedFilesInfo.map((file, idx) => (
                    <div key={idx} className="relative flex flex-col items-center">
                      <span className="text-purple-700 mb-1">{this.getFileIcon(file.type)}</span>
                      {file.type.startsWith('image/') ? (
                        <img src={file.base64} alt={file.name} className="w-16 h-16 rounded-lg object-cover border border-purple-300" />
                      ) : file.type.startsWith('video/') ? (
                        <video src={file.base64} className="w-16 h-16 rounded-lg border border-purple-300" controls />
                      ) : (
                        <span className="text-xs text-purple-700 text-center">{file.name}</span>
                      )}
                      <button
                        onClick={() => this.handleDeleteMedia(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={this.submitComplaint}
              className="w-full py-2 md:py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-md hover:scale-105 transition-transform"
            >
              Submit Complaint
            </button>
          </div>
        </div>
        {/* Bottom Nav */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/95 border border-gray-200 shadow-xl flex items-center justify-between px-6 py-2 rounded-full
          w-full max-w-[355px] xs:max-w-[370px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[470px]
          xl:max-w-[500px] 2xl:max-w-[520px] z-50 transition shadow-lg">
          <a href="/dashboard" className="flex flex-col items-center text-gray-700 hover:text-blue-600 font-semibold transition-all" style={{ minWidth: 65 }}>
            <FaHome className="text-2xl mb-1" />
            <span className="text-xs">Dashboard</span>
          </a>
          <a href="/complaints" className="flex flex-col items-center text-blue-600 font-bold transition-all" style={{ minWidth: 65 }}>
            <FaPlusSquare className="text-2xl mb-1" />
            <span className="text-xs">Submit</span>
          </a>
          <a href="/mycomplaints" className="flex flex-col items-center text-gray-700 hover:text-blue-600 font-semibold transition-all relative" style={{ minWidth: 75 }}>
            <FaRegFileAlt className="text-2xl mb-1" />
            <span className="text-xs">My Complaints</span>
          </a>
          <a href="/profile" className="flex flex-col items-center text-gray-700 hover:text-pink-500 font-semibold transition-all" style={{ minWidth: 65 }}>
            <FaUser className="text-2xl mb-1" />
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </>
    );
  }
}

export default Complaints;
