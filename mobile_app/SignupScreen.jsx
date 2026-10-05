import React, { useState } from 'react';
import axios from 'axios';

const SignupScreen = () => {
  const [formData, setFormData] = useState({ username: '', display_name: '', pin: '' });
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://de4th-ai.onrender.com/auth/register', formData);
      setMessage('Registration Successful! Ab aap login kar sakte hain.');
    } catch (error) {
      setMessage('Signup fail ho gaya. Shayad username pehle se exist karta hai.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', height: '100vh' }}>
      <h2>Join Jarvis Ecosystem</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Username (unique)" 
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          placeholder="Display Name (Jarvis aapko is naam se bulayega)" 
          onChange={(e) => setFormData({...formData, display_name: e.target.value})}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="password" 
          placeholder="Set 4-Digit PIN" 
          maxLength="4"
          onChange={(e) => setFormData({...formData, pin: e.target.value})}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Register Account
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', color: '#fbbf24' }}>{message}</p>}
      
      <div style={{ marginTop: '30px', fontSize: '14px' }}>
        <p>Already have an account? <a href="/login" style={{ color: '#38bdf8' }}>Login here</a></p>
        <hr style={{ borderColor: '#334155' }} />
        <p style={{ color: '#94a3b8' }}>
          <strong>Forgot PIN?</strong><br />
          Jarvis safety rules ke mutabiq, aap apna PIN recover karne ke liye Admin mode ya "Jarvis Reset Key" ka upyog karein.
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;