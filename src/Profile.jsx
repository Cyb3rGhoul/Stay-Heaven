import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from './utils/axios';
import { setUser } from './app/reducers/userSlice';
import useHandleErr from './utils/useHandleErr';
import { Pencil, Check, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [userdetail, setUserdetail] = useState(useSelector((state) => state.user.userData));
  const [selectedImage, setSelectedImage] = useState(userdetail.avatar);
  const [name, setName] = useState(userdetail.fullName);
  const [email, setEmail] = useState(userdetail.email);
  const [phone, setPhone] = useState(userdetail.phoneNumber);
  const [username, setUsername] = useState(userdetail.username);
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useHandleErr();

  const handleUpdateProfile = async () => {
    if (!username || !email || !selectedImage || !name || !phone) {
      toast.error('All fields are required');
      return;
    }

    if (phone.length !== 10) {
      toast.error('Invalid phone number');
      return;
    }

    setLoading(true);
    let url;

    if (file != null) {
      try {
        const formdata = new FormData();
        formdata.append('file', file);
        formdata.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formdata.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formdata
        );
        url = response.data.secure_url;
      } catch (error) {
        handleError(error);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        '/user/update-account-details',
        {
          username,
          email,
          fullName: name,
          phoneNumber: phone,
          avatar: url ? url : selectedImage,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(setUser(response.data.data));
      setEditMode(false);
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden mt-32">
        <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-emerald-600">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <img
                src={selectedImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full cursor-pointer shadow-lg hover:bg-teal-600 transition-colors duration-200">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors duration-200"
              >
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;