import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CourseForm.css';

const CourseForm = ({ course = null, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    thumbnail: course?.thumbnail || '',
    duration: course?.duration || '',
    level: course?.level || 'Beginner',
    price: course?.price || '',
    category: course?.category || '',
    topics: course?.topics?.join(', ') || '',
    tags: course?.tags?.join(', ') || '',
    modules: course?.modules || [{ 
      title: '', 
      description: '', 
      videoUrl: '', 
      duration: '',
      resources: []
    }]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { 
        title: '', 
        description: '', 
        videoUrl: '', 
        duration: '',
        resources: []
      }]
    }));
  };

  const removeModule = (index) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const addResource = (moduleIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].resources.push({
      title: '',
      url: '',
      type: 'pdf'
    });
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const handleResourceChange = (moduleIndex, resourceIndex, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].resources[resourceIndex] = {
      ...updatedModules[moduleIndex].resources[resourceIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const removeResource = (moduleIndex, resourceIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].resources.splice(resourceIndex, 1);
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.thumbnail) errors.thumbnail = 'Thumbnail URL is required';
    if (!formData.duration) errors.duration = 'Duration is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.category) errors.category = 'Category is required';

    formData.modules.forEach((module, index) => {
      if (!module.title) errors[`module${index}Title`] = 'Module title is required';
      if (!module.videoUrl) errors[`module${index}VideoUrl`] = 'Video URL is required';
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const processedData = {
        ...formData,
        topics: formData.topics.split(',').map(topic => topic.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        price: parseFloat(formData.price)
      };

      const response = await axios.post('http://localhost:5000/api/courses', processedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Error creating course. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{course ? 'Edit Course' : 'Create New Course'}</h2>
      </div>

      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-group">
          <label htmlFor="title">Course Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail URL*</label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className={errors.thumbnail ? 'error' : ''}
            />
            {errors.thumbnail && <span className="error-message">{errors.thumbnail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration*</label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="e.g., 10 weeks"
              value={formData.duration}
              onChange={handleChange}
              className={errors.duration ? 'error' : ''}
            />
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">Level*</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="topics">Topics (comma-separated)</label>
            <input
              type="text"
              id="topics"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="e.g., React, JavaScript, Web Development"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., programming, web, frontend"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>Course Modules</h3>
          <button type="button" className="btn-secondary" onClick={addModule}>
            Add Module
          </button>
        </div>

        {formData.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="module-card">
            <div className="module-header">
              <h4>Module {moduleIndex + 1}</h4>
              {moduleIndex > 0 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeModule(moduleIndex)}
                >
                  Remove Module
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`module-${moduleIndex}-title`}>Module Title*</label>
              <input
                type="text"
                id={`module-${moduleIndex}-title`}
                value={module.title}
                onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                className={errors[`module${moduleIndex}Title`] ? 'error' : ''}
              />
              {errors[`module${moduleIndex}Title`] && (
                <span className="error-message">{errors[`module${moduleIndex}Title`]}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`module-${moduleIndex}-description`}>Description</label>
              <textarea
                id={`module-${moduleIndex}-description`}
                value={module.description}
                onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`module-${moduleIndex}-video`}>Video URL*</label>
                <input
                  type="url"
                  id={`module-${moduleIndex}-video`}
                  value={module.videoUrl}
                  onChange={(e) => handleModuleChange(moduleIndex, 'videoUrl', e.target.value)}
                  className={errors[`module${moduleIndex}VideoUrl`] ? 'error' : ''}
                />
                {errors[`module${moduleIndex}VideoUrl`] && (
                  <span className="error-message">{errors[`module${moduleIndex}VideoUrl`]}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`module-${moduleIndex}-duration`}>Duration</label>
                <input
                  type="text"
                  id={`module-${moduleIndex}-duration`}
                  value={module.duration}
                  onChange={(e) => handleModuleChange(moduleIndex, 'duration', e.target.value)}
                  placeholder="e.g., 45 minutes"
                />
              </div>
            </div>

            <div className="resources-section">
              <div className="section-header">
                <h5>Resources</h5>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => addResource(moduleIndex)}
                >
                  Add Resource
                </button>
              </div>

              {module.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="resource-item">
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Resource Title"
                        value={resource.title}
                        onChange={(e) => handleResourceChange(moduleIndex, resourceIndex, 'title', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="url"
                        placeholder="Resource URL"
                        value={resource.url}
                        onChange={(e) => handleResourceChange(moduleIndex, resourceIndex, 'url', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={resource.type}
                        onChange={(e) => handleResourceChange(moduleIndex, resourceIndex, 'type', e.target.value)}
                      >
                        <option value="pdf">PDF</option>
                        <option value="doc">Document</option>
                        <option value="video">Video</option>
                        <option value="link">Link</option>
                      </select>
                    </div>

                    <button
                      type="
                      button"
                      className="btn-danger"
                      onClick={() => removeResource(moduleIndex, resourceIndex)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {errors.submit && (
        <div className="error-message submit-error">{errors.submit}</div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm; 