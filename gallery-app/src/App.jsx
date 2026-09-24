import { useEffect, useState } from 'react';
import DomeGallery from './components/DomeGallery/DomeGallery';
import './App.css';

// Edit this to whatever you told Pingu.
const GALLERY_PIN = '150899';

function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('gallery-unlocked') === 'true');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!unlocked) return;
    const base = import.meta.env.BASE_URL;
    fetch(`${base}manifest.json`)
      .then((r) => r.json())
      .then((files) => setImages(files.map((f) => ({ src: `${base}photos/${f}`, alt: 'Pingu' }))))
      .catch(() => setImages([]));
  }, [unlocked]);

  const submitPin = (e) => {
    e.preventDefault();
    if (pin.trim().toLowerCase() === GALLERY_PIN.toLowerCase()) {
      sessionStorage.setItem('gallery-unlocked', 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="pin-screen">
        <form className="pin-card" onSubmit={submitPin}>
          <h1>Pingu's Gallery ✨</h1>
          <p>Munnu says you need the password to peek in.</p>
          <input
            type="text"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="pin-error">Not quite — try again.</p>}
          <button type="submit">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Pingu, in {images.length || ''} pictures {'\u{1F49B}'}</h1>
        <p>Drag to spin · tap a photo to open it</p>
      </div>
      <div className="gallery-stage">
        {images.length > 0 && (
          <DomeGallery
            images={images}
            fit={0.8}
            minRadius={600}
            maxVerticalRotationDeg={3}
            segments={34}
            dragDampening={2}
            grayscale={false}
            overlayBlurColor="#1a1424"
            openedImageWidth="min(420px, 80vw)"
            openedImageHeight="min(420px, 80vw)"
          />
        )}
      </div>
    </div>
  );
}

export default App;
