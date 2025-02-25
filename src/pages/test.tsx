import React from 'react';

const BadIBPractice: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#000033', 
      color: 'white',
      fontFamily: 'Comic Sans MS',
      padding: '10px',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      {/* Poorly aligned header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px',
        backgroundColor: '#000055',
        borderRadius: '3px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: 'blue',
            width: '30px',
            height: '30px',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px'
          }}>
            x³
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>IB Practise</span> {/* Intentional misspelling */}
        </div>

        {/* Misaligned navigation */}
        <nav style={{ display: 'flex', gap: '15px' }}>
          <a href="#" style={{ color: 'lightblue', textDecoration: 'none' }}>Features</a>
          <a href="#" style={{ color: 'lightblue', textDecoration: 'none' }}>How It Work</a> {/* Grammatical error */}
          <a href="#" style={{ color: 'lightblue', textDecoration: 'none' }}>Subects</a> {/* Misspelling */}
          <a href="#" style={{ color: 'lightblue', textDecoration: 'none' }}>Pricing</a>
        </nav>

        {/* Poorly styled buttons */}
        <div>
          <button style={{ 
            backgroundColor: 'darkblue', 
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            marginRight: '10px',
            cursor: 'pointer'
          }}>
            Teacher Portal
          </button>
          <button style={{ 
            backgroundColor: 'blue', 
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer'
          }}>
            Start Free
          </button>
        </div>
      </header>

      {/* Main content area with poor spacing */}
      <main>
        {/* Logo - off-center */}
        <div style={{ 
          backgroundColor: 'blue',
          width: '80px',
          height: '80px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 30px auto',
          color: 'white',
          fontSize: '30px'
        }}>
          x³
        </div>

        {/* Headline with poor layout */}
        <h1 style={{ fontSize: '40px', margin: '10px 0' }}>
          Never Run Out of <span style={{ color: 'lightblue' }}>IB Practise</span> {/* Intentional misspelling */}
        </h1>

        {/* Subheading with poor alignment */}
        <p style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto 30px auto', lineHeight: '1.3' }}>
          Tired of recycling the same past papers? Our Al-powered platform {/* Intentional "AI" misspelling */}
          generates unlimited lB-aligned questions with instnat feedback and {/* More intentional errors */}
          detailed solutions.
        </p>

        {/* Buttons with inconsistent styling */}
        <div style={{ marginBottom: '40px' }}>
          <button style={{ 
            backgroundColor: 'lightblue', 
            color: 'black',
            border: 'none',
            padding: '10px 20px',
            marginRight: '15px',
            cursor: 'pointer',
            borderRadius: '3px'
          }}>
            Start Free Trail → {/* Intentional "Trial" misspelling */}
          </button>
          <button style={{ 
            backgroundColor: 'transparent', 
            color: 'white',
            border: '1px solid gray',
            padding: '10px 15px',
            cursor: 'pointer',
            borderRadius: '3px'
          }}>
            Wach Demo {/* Intentional "Watch" misspelling */}
          </button>
        </div>

        {/* Feature highlights with poor layout */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            backgroundColor: '#000055',
            padding: '10px',
            borderRadius: '20px',
            minWidth: '150px'
          }}>
            ✓ Unlimited Qestions {/* Intentional misspelling */}
          </div>
          <div style={{ 
            backgroundColor: '#000055',
            padding: '10px',
            borderRadius: '20px',
            minWidth: '150px'
          }}>
            👥 10,000+ Studens {/* Intentional misspelling */}
          </div>
          <div style={{ 
            backgroundColor: '#000055',
            padding: '10px',
            borderRadius: '20px',
            minWidth: '150px'
          }}>
            ⭐ Step-by Step Solutions {/* Intentional hyphen error */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BadIBPractice;