import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaTiktok, FaGlobe } from 'react-icons/fa';

const Profile = () => {
  const { email, role } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://eventkamek-production.up.railway.app/api/profile/public?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
        const data = await res.json();
        if (res.ok) {
          setProfile({
            name: data.name,
            email: data.email,
            contactnum: data.contactnum,
            role: data.role,
            profilePic: `https://eventkamek-production.up.railway.app/uploads/${data.role === 'organizer' ? 'organizerPFP' : 'vendorPFP'}/${data.profilepic || 'dummyProfilePic.png'}`,
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
        console.error('Failed to fetch public profile:', err);
      }
    };

    fetchProfile();
  }, [email, role]);

  if (!profile) return <main><p className="text-center mt-12">Loading profile...</p></main>;

  return (
    <main>
      <div className="heading-container">
        <h1>{profile.role === 'organizer' ? 'Organizer' : 'Vendor'} Profile</h1>
      </div>
      <div className="content-container">
        <div className="profile-details">
          <img src={profile.profilePic} alt="Profile" className="profile-picture" />
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p><FaEnvelope /> Email: {profile.email}</p>
            <p><FaPhone /> Contact: {profile.contactnum}</p>
            <p><FaFacebook /> Facebook: {profile.facebooklink}</p>
            <p><FaInstagram /> Instagram: {profile.instagramlink}</p>
            <p><FaTiktok /> Tiktok: {profile.tiktoklink}</p>
            <p><FaGlobe /> Website: {profile.websitelink}</p>
          </div>
        </div>
        <div className="profile-aboutus">
          <h2>About Us</h2>
          <p>{profile.aboutus}</p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
