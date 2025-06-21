import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfileModal = ({ isOpen, onClose, currentData, onSave }) => {
  const [formData, setFormData] = useState(currentData);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setFormData(currentData);
    setPreviewURL(null);
    setNewProfilePic(null);
  }, [currentData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleRemovePicture = () => {
    setNewProfilePic(null);
    setPreviewURL(null);
    setFormData(prev => ({
      ...prev,
      profilePic: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    try {
      const res = await fetch(`https://eventkamek-production.up.railway.app/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          email,
          name: formData.name,
          contactnum: formData.contactnum,
          facebooklink: formData.facebooklink === '-' ? '' : formData.facebooklink,
          instagramlink: formData.instagramlink === '-' ? '' : formData.instagramlink,
          tiktoklink: formData.tiktoklink === '-' ? '' : formData.tiktoklink,
          websitelink: formData.websitelink === '-' ? '' : formData.websitelink,
          aboutus: formData.aboutus,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Profile successfully updated!');
        onSave(formData);
        onClose();          // ✅ Close modal
      } else {
        console.error('Update failed:', result.error);
        window.alert(result.error || 'Failed to update profile.');
        onclose(); // ✅ Close modal
      }
    } catch (err) {
      console.error('❌ Error during profile update:', err);
      window.alert('An error occurred while updating your profile. Please try again.');
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="edit-profile-modal-box">
        <div className="flex">
          <h2>Edit My Profile</h2>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="edit-profile-left">
            <label>Profile Picture:</label>
            {previewURL ? (
              <div>
                <img src={previewURL} alt="Preview" className="preview-image" />
                <button type="button" onClick={handleRemovePicture}>Remove Picture</button>
              </div>
            ) : formData.profilePic ? (
              <div>
                <img src={formData.profilePic} alt="Current Profile" className="preview-image" />
                <button type="button" onClick={handleRemovePicture}>Remove Picture</button>
              </div>
            ) : (
              <p>No profile picture uploaded.</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <label>Organization Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            <label>About Us:</label>
            <textarea name="aboutus" value={formData.aboutus} onChange={handleChange} rows="4" />
          </div>

          <div className="edit-profile-right">
            <label>Email:</label>
            <input name="email" value={formData.email} disabled />

            <label>Contact:</label>
            <input name="contactnum" value={formData.contactnum} onChange={handleChange} />

            <label>Facebook Link:</label>
            <input name="facebooklink" value={formData.facebooklink} onChange={handleChange} />

            <label>Instagram Link:</label>
            <input name="instagramlink" value={formData.instagramlink} onChange={handleChange} />

            <label>Tiktok Link:</label>
            <input name="tiktoklink" value={formData.tiktoklink} onChange={handleChange} />

            <label>Website Link:</label>
            <input name="websitelink" value={formData.websitelink} onChange={handleChange} />
          </div>

          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" className="cancel-form" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileModal;
