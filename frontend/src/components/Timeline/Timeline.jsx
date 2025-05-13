import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../../context/AuthContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(10);
    opacity: 0;
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const Title = styled.h1`
  color: #ff527b;
  text-shadow: 2px 2px 0 #ffca3a;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  
  @media (max-width: 576px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.h2`
  color: #3a86ff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const TabButton = styled.button`
  background-color: ${props => props.active ? '#ff527b' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 3px solid ${props => props.active ? '#ff527b' : '#ddd'};
  padding: 10px 20px;
  border-radius: 30px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.active ? '4px 4px 0 rgba(255, 158, 0, 0.5)' : 'none'};
  
  &:hover {
    background-color: ${props => props.active ? '#ff527b' : '#f0f0f0'};
    transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
  }
  
  @media (max-width: 576px) {
    margin: 0;
    width: 100%;
  }
`;

const AddButton = styled.button`
  background-color: #8338ec;
  border: 3px solid #6c11d8;
  box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.5);
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  margin: 20px auto 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: 600;
  font-family: inherit;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 rgba(255, 158, 0, 0.5);
  }
  
  @media (max-width: 576px) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const PlusIcon = styled.span`
  font-size: 20px;
  margin-right: 8px;
`;

// Timeline specific styles
const TimelineContainer = styled.div`
  position: relative;
  padding: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    background: linear-gradient(to bottom, #ff527b, #3a86ff);
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    z-index: 1; /* Changed to ensure line is visible but behind cards */
    
    @media (max-width: 768px) {
      left: 30px;
      transform: none;
    }
  }
  
  @media (max-width: 768px) {
    padding-left: 50px;
    padding-bottom: 30px;
  }
  
  @media (max-width: 576px) {
    padding-left: 40px;
  }
`;

const CurvyLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: visible;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: ${props => props.color || '#ff527b'};
  border: 4px solid white;
  border-radius: 50%;
  z-index: 3; /* Increased to ensure dots appear on top */
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${props => props.color || '#ff527b'};
    border-radius: 50%;
    z-index: -1;
    animation: ${ripple} 1.5s infinite;
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    left: 30px;
    transform: none;
  }
`;

const TimelineCard = styled.div`
  position: relative;
  width: 45%;
  margin: 40px 0;
  background: white;
  border: 3px solid ${props => props.color || '#ff527b'};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
  transform-origin: center;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: visible; /* Changed from hidden to prevent text cutoff */
  
  ${props => props.position === 'left' ? 'margin-right: auto;' : 'margin-left: auto;'}
  
  &:hover {
    box-shadow: 8px 8px 0 rgba(255, 158, 0, 0.4);
    transform: translateY(-3px);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-top: 3px solid ${props => props.color || '#ff527b'};
    border-right: 3px solid ${props => props.color || '#ff527b'};
    top: 50%;
    transform: translateY(-50%) rotate(${props => props.position === 'left' ? '45deg' : '-135deg'});
    ${props => props.position === 'left' ? 'right: -12px;' : 'left: -12px;'}
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 30px;
    
    &::after {
      left: -12px;
      transform: translateY(-50%) rotate(-135deg);
    }
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    margin-bottom: 25px;
  }
`;

const CardDate = styled.div`
  position: absolute;
  top: -15px;
  ${props => props.position === 'left' ? 'right: 10px;' : 'left: 10px;'}
  background-color: #4cc9f0;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap; /* Prevent date from wrapping */
  
  @media (max-width: 768px) {
    left: 10px;
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const CardTitle = styled.h3`
  color: #333;
  margin-top: 10px;
  font-size: 18px;
  margin-bottom: 10px;
  
  @media (max-width: 576px) {
    font-size: 16px;
  }
`;

const CardContent = styled.div`
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 5px;
  overflow: visible; /* Ensure text isn't cut off */
  word-break: break-word; /* Handle long words */
  
  @media (max-width: 576px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

const ImagePreview = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  position: relative;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    max-height: 300px; /* Increased from 200px for larger images */
    object-fit: contain; /* Changed from cover to maintain aspect ratio */
    border-radius: 8px;
    border: 2px solid #ddd;
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.03);
    }
  }
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  border: 4px solid #8338ec;
  box-shadow: 8px 8px 0 rgba(255, 158, 0, 0.3);
  width: 90%;
  max-width: 600px;
  animation: ${fadeIn} 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  @media (max-width: 576px) {
    padding: 15px;
    width: 95%;
  }
`;

const ModalTitle = styled.h2`
  color: #8338ec;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.8rem;
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #ff527b;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    border-color: #8338ec;
    outline: none;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    border-color: #8338ec;
    outline: none;
  }
`;

const ImageUploadLabel = styled.label`
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin-top: 5px;
  
  &:hover {
    background-color: #e9ecef;
    border-color: #8338ec;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  background-color: #8338ec;
  border: 2px solid #6c11d8;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit;
  
  &:hover {
    background-color: #6c11d8;
  }
  
  @media (max-width: 576px) {
    order: -1;
  }
`;

const CancelButton = styled.button`
  background-color: #f8f9fa;
  border: 2px solid #ddd;
  color: #333;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const FullImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  
  img {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
  }
`;

const NoItemsMessage = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: white;
  border: 3px dashed #ddd;
  border-radius: 8px;
  margin: 20px 0;
  
  h3 {
    color: #8338ec;
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 158, 0, 0.3);
  border-top: 4px solid #8338ec;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 30px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff527b;
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #ff527b;
  border-radius: 4px;
`;

// Memorable Moments Grid
const MomentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const MomentCard = styled.div`
  background: white;
  border: 3px solid ${props => props.color || '#4cc9f0'};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 8px 8px 0 rgba(255, 158, 0, 0.4);
  }
  
  @media (max-width: 576px) {
    padding: 15px;
  }
`;

const MomentTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
  font-size: 18px;
  
  @media (max-width: 576px) {
    font-size: 16px;
  }
`;

const MomentDescription = styled.p`
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  word-break: break-word;
  
  @media (max-width: 576px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

const MomentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || '#8338ec'};
  cursor: pointer;
  font-size: 18px;
  opacity: 0.7;
  transition: all 0.2s;
  font-family: inherit;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const Timeline = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [timelineItems, setTimelineItems] = useState([]);
  const [memorableItems, setMemorableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    imageUrl: '',
    imageFile: null
  });

  const { password } = useAuth();
  const containerRef = useRef(null);
  
  // Fetch timeline and memorable items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Fetch timeline items
      const timelineResponse = await axios.get(`${apiUrl}/api/timeline`, {
        headers: {
          'x-auth-password': password
        }
      });
      
      // Sort by date ascending
      const sortedTimeline = timelineResponse.data.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      setTimelineItems(sortedTimeline);
      
      // Fetch memorable items
      const memorableResponse = await axios.get(`${apiUrl}/api/memorable`, {
        headers: {
          'x-auth-password': password
        }
      });
      
      setMemorableItems(memorableResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Error fetching items: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      console.error(err);
    }
  }, [password]);
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
        imageUrl: URL.createObjectURL(files[0])  // Create a preview URL
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = activeTab === 'timeline' ? 'timeline' : 'memorable';
      
      // Create form data for image upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('date', formData.date);
      data.append('description', formData.description);
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      }
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(`${apiUrl}/api/${endpoint}/${selectedItem._id}`, data, {
          headers: {
            'x-auth-password': password,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (activeTab === 'timeline') {
          setTimelineItems(timelineItems.map(item => 
            item._id === selectedItem._id ? response.data : item
          ));
        } else {
          setMemorableItems(memorableItems.map(item => 
            item._id === selectedItem._id ? response.data : item
          ));
        }
      } else {
        response = await axios.post(`${apiUrl}/api/${endpoint}`, data, {
          headers: {
            'x-auth-password': password,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (activeTab === 'timeline') {
          const updatedTimeline = [...timelineItems, response.data].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
          );
          setTimelineItems(updatedTimeline);
        } else {
          setMemorableItems([...memorableItems, response.data]);
        }
      }
      
      closeModal();
    } catch (err) {
      setError('Error saving item: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };
  
  // Open modal for adding new item
  const openAddModal = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],  // Today's date
      description: '',
      imageUrl: '',
      imageFile: null
    });
    setIsEditMode(false);
    setShowModal(true);
  };
  
  // Open modal for editing an item
  const openEditModal = (item) => {
    setFormData({
      title: item.title,
      date: new Date(item.date).toISOString().split('T')[0],
      description: item.description,
      imageUrl: item.imageUrl,
      imageFile: null
    });
    setSelectedItem(item);
    setIsEditMode(true);
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  
  // Open full-size image
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };
  
  // Close full-size image
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const endpoint = activeTab === 'timeline' ? 'timeline' : 'memorable';
        
        await axios.delete(`${apiUrl}/api/${endpoint}/${id}`, {
          headers: {
            'x-auth-password': password
          }
        });
        
        if (activeTab === 'timeline') {
          setTimelineItems(timelineItems.filter(item => item._id !== id));
        } else {
          setMemorableItems(memorableItems.filter(item => item._id !== id));
        }
      } catch (err) {
        setError('Error deleting item: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const renderTimelineSection = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (timelineItems.length === 0) {
      return (
        <NoItemsMessage>
          <h3>Your Timeline is Empty</h3>
          <p>Start adding!!</p>
          <AddButton onClick={openAddModal}>
            <PlusIcon>+</PlusIcon>
            Add First Memory
          </AddButton>
        </NoItemsMessage>
      );
    }
    
    return (
      <TimelineContainer ref={containerRef}>
        {/* SVG path for the curvy line connecting events */}
        <CurvyLine>
          <path 
            d="M50% 0 Q 60% 25% 50% 50% Q 40% 75% 50% 100%" 
            stroke="#ddd" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="5,5"
          />
        </CurvyLine>
        
        {timelineItems.map((item, index) => {
          const position = index % 2 === 0 ? 'left' : 'right';
          const color = index % 3 === 0 ? '#ff527b' : index % 3 === 1 ? '#4cc9f0' : '#ffca3a';
          
          return (
            <div key={item._id} style={{ position: 'relative' }}>
              <TimelineDot 
                color={color} 
                style={{ top: `${140 + index * (window.innerWidth <= 768 ? 200 : 250)}px` }} 
              />
              
              <TimelineCard 
                position={position} 
                color={color}
                className="timeline-card"
                data-id={item._id}
              >
                <CardDate position={position}>{formatDate(item.date)}</CardDate>
                <CardTitle>{item.title}</CardTitle>
                <CardContent>{item.description}</CardContent>
                
                {item.imageUrl && (
                  <ImagePreview onClick={() => openImageModal(item.imageUrl)}>
                    <img src={item.imageUrl} alt={item.title} />
                  </ImagePreview>
                )}
                
                <MomentActions>
                  <ActionButton color="#8338ec" onClick={() => openEditModal(item)}>
                    ✎
                  </ActionButton>
                  <ActionButton color="#ff527b" onClick={() => handleDelete(item._id)}>
                    ×
                  </ActionButton>
                </MomentActions>
              </TimelineCard>
            </div>
          );
        })}
      </TimelineContainer>
    );
  };
  
  const renderMemorableMomentsSection = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (memorableItems.length === 0) {
      return (
        <NoItemsMessage>
          <h3>No Memorable Moments Yet</h3>
          <p>Add special moments!!</p>
          <AddButton onClick={openAddModal}>
            <PlusIcon>+</PlusIcon>
            Add First Moment
          </AddButton>
        </NoItemsMessage>
      );
    }
    
    return (
      <MomentsGrid>
        {memorableItems.map((item, index) => {
          const colors = ['#ff527b', '#4cc9f0', '#ffca3a', '#8338ec'];
          const color = colors[index % colors.length];
          
          return (
            <MomentCard key={item._id} color={color}>
              <MomentTitle>{item.title}</MomentTitle>
              <CardDate position="left" style={{ position: 'static', display: 'inline-block', marginBottom: '10px' }}>
                {formatDate(item.date)}
              </CardDate>
              <MomentDescription>{item.description}</MomentDescription>
              
              {item.imageUrl && (
                <ImagePreview onClick={() => openImageModal(item.imageUrl)}>
                  <img src={item.imageUrl} alt={item.title} />
                </ImagePreview>
              )}
              
              <MomentActions>
                <ActionButton color="#8338ec" onClick={() => openEditModal(item)}>
                  ✎
                </ActionButton>
                <ActionButton color="#ff527b" onClick={() => handleDelete(item._id)}>
                  ×
                </ActionButton>
              </MomentActions>
            </MomentCard>
          );
        })}
      </MomentsGrid>
    );
  };
  
  return (
    <Container>
      <Title>Our Story</Title>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'timeline'} 
          onClick={() => setActiveTab('timeline')}
        >
          Our Timeline
        </TabButton>
        <TabButton 
          active={activeTab === 'memorable'} 
          onClick={() => setActiveTab('memorable')}
        >
          Memorable Moments
        </TabButton>
      </TabContainer>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <AddButton onClick={openAddModal}>
          <PlusIcon>+</PlusIcon>
          Add {activeTab === 'timeline' ? 'Timeline Event' : 'Memorable Moment'}
        </AddButton>
      </div>
      
      {activeTab === 'timeline' ? renderTimelineSection() : renderMemorableMomentsSection()}
      
      {/* Add/Edit Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              {isEditMode ? 'Edit' : 'Add'} {activeTab === 'timeline' ? 'Timeline Event' : 'Memorable Moment'}
            </ModalTitle>
            <CloseButton onClick={closeModal}>×</CloseButton>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Title</FormLabel>
                <FormInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Date</FormLabel>
                <FormInput
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Image</FormLabel>
                <ImageUploadLabel>
                  {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    name="imageFile"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </ImageUploadLabel>
                
                {formData.imageUrl && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '4px' 
                      }} 
                    />
                  </div>
                )}
              </FormGroup>
              
              <ButtonContainer>
                <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
                <SubmitButton type="submit">{isEditMode ? 'Update' : 'Add'}</SubmitButton>
              </ButtonContainer>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Full Image Modal */}
      {showImageModal && (
        <FullImageModal onClick={closeImageModal}>
          <img src={selectedImage} alt="Full Size" />
        </FullImageModal>
      )}
    </Container>
  );
};

export default Timeline;