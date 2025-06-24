import React from 'react';

function UploadPanel({ setRoomImage, setTileImage }) {
  const handleUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  return (
    <div className="upload-panel">
      <div>
        <label>Upload Room Image</label>
        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, setRoomImage)} />
      </div>
      <div>
        <label>Upload Tile Image</label>
        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, setTileImage)} />
      </div>
    </div>
  );
}

export default UploadPanel;
