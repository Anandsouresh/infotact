import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to InfoTact</h1>
          <p className="hero-subtitle">Your Gateway to Quality Education</p>
          <div className="hero-buttons">
            <Link to="/register" className="cta-button primary">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose InfoTact?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="quality">🎓</span>
            <h3>Quality Education</h3>
            <p>Access high-quality courses from expert instructors</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="flexible">⏰</span>
            <h3>Flexible Learning</h3>
            <p>Learn at your own pace, anytime, anywhere</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="interactive">💡</span>
            <h3>Interactive Content</h3>
            <p>Engage with video lectures, quizzes, and assignments</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="progress">📊</span>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="categories-section">
        <h2>Popular Course Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <span role="img" aria-label="programming">💻</span>
            <h3>Programming</h3>
            <p>Learn coding and software development</p>
          </div>
          <div className="category-card">
            <span role="img" aria-label="design">🎨</span>
            <h3>Design</h3>
            <p>Master UI/UX and graphic design</p>
          </div>
          <div className="category-card">
            <span role="img" aria-label="business">💼</span>
            <h3>Business</h3>
            <p>Develop business and management skills</p>
          </div>
          <div className="category-card">
            <span role="img" aria-label="marketing">📱</span>
            <h3>Marketing</h3>
            <p>Learn digital marketing strategies</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up for free and create your profile</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse Courses</h3>
            <p>Explore our wide range of courses</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Enroll & Learn</h3>
            <p>Start learning at your own pace</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Students Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"The courses are well-structured and the instructors are very knowledgeable. I've learned so much!"</p>
            <div className="testimonial-author">
              <span role="img" aria-label="student">👤</span>
              <div>
                <h4>John Doe</h4>
                <p>Web Development Student</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"The platform is user-friendly and the content is top-notch. Highly recommended!"</p>
            <div className="testimonial-author">
              <span role="img" aria-label="student">👤</span>
              <div>
                <h4>Jane Smith</h4>
                <p>UI/UX Design Student</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"I love the flexibility of learning at my own pace. The support team is also very helpful."</p>
            <div className="testimonial-author">
              <span role="img" aria-label="student">👤</span>
              <div>
                <h4>Mike Johnson</h4>
                <p>Digital Marketing Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students who are already learning with InfoTact</p>
          <Link to="/register" className="cta-button primary">Get Started Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About InfoTact</h3>
            <p>Your trusted platform for quality online education</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@infotact.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="Instagram">📸</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 InfoTact. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 