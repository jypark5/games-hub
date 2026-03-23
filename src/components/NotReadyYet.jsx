import { Link } from 'react-router-dom';
import './NotReadyYet.css';

export function NotReadyYet() {
  return (
    <div className="not-ready-page">
      <h1 className="not-ready-title">Page is not ready yet.</h1>
      <p className="not-ready-text">
        Try out Wordle while Snake and 2048 are being built.
      </p>

      <div className="not-ready-actions">
        <Link className="not-ready-link" to="/wordle">
          Go to Wordle
        </Link>
      </div>
    </div>
  );
}

