import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page.css';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to orders page by default
    navigate('/orders', { replace: true });
  }, [navigate]);

  return null;
}


