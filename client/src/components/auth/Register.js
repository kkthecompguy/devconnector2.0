import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { createMessage } from '../../actions/messages';
import { signup } from '../../actions/auth';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

const  Register = ({ createMessage, signup, loading, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== password2) return createMessage({ passwordNotMatch: 'Passwords do not match' });

    signup({name, email, password});
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard"/ >
  }
  
  return (
    <div className="form-container my-3">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form onSubmit={e => handleSubmit(e)} className="form">
        <div className="form-group">
          <input
          type="text"
          name="name"
          value={name} 
          placeholder="Name" 
          onChange={e => handleChange(e)} 
            />
        </div>
        <div className="form-group">
          <input
          type="email" 
          placeholder="someone@example.com" 
          name="email"
          value={email}
          onChange={e => handleChange(e)}
            />
          <small className="form-text">This site uses Gravatar so if you want a profile image, use a
          Gravatar email</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password" 
            value={password}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2" 
            value={password2}
            onChange={e => handleChange(e)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{ loading ? <Loader type="Oval" color="#424242" height={25} width={25} />: "Submit" }</button>
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}

Register.propTypes = {
  createMessage: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { createMessage, signup })(Register);