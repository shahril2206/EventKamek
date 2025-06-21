import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaTiktok, FaGlobe } from 'react-icons/fa';

import EditProfileModal from '../Components/Modal/EditProfileModal';

import useStickyHeaderEffect from '../hooks/useStickyHeaderEffect';

const MyProfile = () => {
  useStickyHeaderEffect();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null); // default to null so we can show "loading..."

  // ✅ Fetch profile from backend
  useEffect(() => {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (!email) return;

    const fetchProfile = async () => {
      if (role === 'organizer') {
        try {
          const res = await fetch(`http://localhost:3000/api/organizer/myprofile?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (res.ok) {
            setProfile({
              name: data.organizationname,
              email: data.organizeremail,
              contactnum: data.contactnum,
              profilePic: `http://localhost:3000/uploads/organizerPFP/${data.profilepic || 'dummyProfilePic.png'}`,
              facebooklink: data.facebooklink || '-',
              instagramlink: data.instagramlink || '-',
              tiktoklink: data.tiktoklink || '-',
              websitelink: data.websitelink || '-',
              aboutus: data.aboutus || 'No description available.',
            });
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      } else if (role === 'vendor') {
        try {
          const res = await fetch(`http://localhost:3000/api/vendor/myprofile?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (res.ok) {
            setProfile({
              name: data.vendorname,
              email: data.vendoremail,
              contactnum: data.contactnum,
              profilePic: `http://localhost:3000/uploads/vendorPFP/${data.profilepic || 'dummyProfilePic.png'}`,
              facebooklink: data.facebooklink || '-',
              instagramlink: data.instagramlink || '-',
              tiktoklink: data.tiktoklink || '-',
              websitelink: data.websitelink || '-',
              aboutus: data.aboutus || 'No description available.',
            });
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      }
    };

    fetchProfile();
  }, []);

  // ✅ Sync updated data from modal back to profile state
  const handleSave = (updatedData) => {
    setProfile({
      name: updatedData.name,
      email: updatedData.email,
      contactnum: updatedData.contactnum,
      profilePic: `http://localhost:3000/uploads/vendorPFP/${updatedData.profilepic || 'dummyProfilePic.png'}`,
      facebooklink: updatedData.facebooklink || '-',
      instagramlink: updatedData.instagramlink || '-',
      tiktoklink: updatedData.tiktoklink || '-',
      websitelink: updatedData.websitelink || '-',
      aboutus: updatedData.aboutus || 'No description available.',
    });
  };

  // Optional: Show loading state while profile is being fetched
  if (!profile) return <main><p className="text-center mt-12">Loading profile...</p></main>;

  return (
    <main>
      <div id="sentinel" className="h-[1px]"></div>
      <div className="heading-container">
        <h1>My Profile</h1>
      </div>

      <div className="content-container">
        {/* Profile Details */}
          <div className="profile-details">
            <img src={profile.profilePic} alt="Profile" className="profile-picture" />

            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p>
                <FaEnvelope /> &nbsp; Email:&nbsp;
                <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  {profile.email}
                </a>
              </p>
              <p><FaPhone /> &nbsp; Contact: {profile.contactnum}</p>
              <p>
                <FaFacebook /> &nbsp; Facebook:&nbsp;
                {profile.facebooklink && profile.facebooklink !== '-' ? (
                <a href={profile.facebooklink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  {profile.facebooklink}
                </a>
                ) : ( '-' )}
              </p>
              <p>
                <FaInstagram /> &nbsp; Instagram:&nbsp;
                {profile.instagramlink && profile.instagramlink !== '-' ? (
                <a href={profile.instagramlink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  {profile.instagramlink}
                </a>
                ) : ( '-' )}
              </p>
              <p>
                <FaTiktok /> &nbsp; Tiktok:&nbsp;
                {profile.tiktoklink && profile.tiktoklink !== '-' ? (
                <a href={profile.tiktoklink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  {profile.tiktoklink}
                </a>
                ) : ( '-' )}
              </p>
              <p>
                <FaGlobe /> &nbsp; Website:&nbsp;
                {profile.websitelink && profile.websitelink !== '-' ? (
                <a href={profile.websitelink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  {profile.websitelink}
                </a>
                ) : ( '-' )}
              </p>
            </div>

            <div className="profile-button-container">
              <button className="edit-profile-btn" onClick={() => setIsModalOpen(true)}>Edit Profile</button>
              <button className="change-password-btn">Change Password</button>
            </div>
          </div>

          {/* About Us Section */}
        <div className="profile-aboutus">
          <h2>About Us</h2>
          <p>{profile.aboutus}</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentData={profile}
        onSave={handleSave}
      />
    </main>
  );
};

export default MyProfile;
