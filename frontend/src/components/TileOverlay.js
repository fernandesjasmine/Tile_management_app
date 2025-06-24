import React from 'react';

function TileOverlay({ roomImage, tileImage }) {
  if (!roomImage) {
    return <p style={{ textAlign: 'center', color: '#666' }}>Please upload a room image to get started.</p>;
  }

  return (
    <div className="preview-container">
      <img src={roomImage} alt="Room" />
      {tileImage && <img src={tileImage} alt="Tile Overlay" className="overlay-tile" />}
    </div>
  );
}

export default TileOverlay;
