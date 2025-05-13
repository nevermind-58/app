import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(var(--rotation)); }
  50% { transform: translateY(-5px) rotate(var(--rotation)); }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
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

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
`;

const StickyNote = styled.div`
  position: relative;
  padding: 20px;
  min-height: 200px;
  background-color: ${props => props.color};
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.2s, box-shadow 0.2s;
  --rotation: ${props => props.rotation}deg;
  transform: rotate(var(--rotation));
  
  // Creates the folded corner effect
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    border-width: 0 30px 30px 0;
    border-style: solid;
    border-color: ${props => props.foldColor} transparent;
    box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.1);
  }
  
  &:hover {
    transform: translateY(-5px) rotate(var(--rotation));
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    min-height: 180px;
  }
`;

const NoteContent = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 30px;
  word-break: break-word;
  font-family: inherit;
`;

const NoteAuthor = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.color || '#333'};
`;

const NoteDate = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-size: 12px;
  color: #555;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
  
  ${StickyNote}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  padding: 2px;
  
  &:hover {
    color: rgba(0, 0, 0, 0.9);
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
  margin: 0 auto;
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

// Modal Components
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
  max-width: 500px;
  animation: ${fadeIn} 0.3s ease-out;
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    border-color: #8338ec;
    outline: none;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    gap: 10px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  
  input {
    margin-right: 5px;
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

const ErrorMessage = styled.div`
  color: #ff527b;
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #ff527b;
  border-radius: 4px;
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

const NoNotesMessage = styled.div`
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

const ColorPreview = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 8px;
  border: 1px solid rgba(0,0,0,0.1);
`;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const [formData, setFormData] = useState({
    content: '',
    author: 'Deepak',
    color: '#fff8b8' // Default yellow color
  });
  
  const { password } = useAuth();
  
  // Available colors for sticky notes
  const noteColors = [
    { color: '#fff8b8', name: 'Yellow', foldColor: '#f5e577' },   // Yellow
    { color: '#d1f0a1', name: 'Green', foldColor: '#b6e06a' },    // Green
    { color: '#ffcccb', name: 'Pink', foldColor: '#ff9e9d' },     // Pink
    { color: '#c6e6ff', name: 'Blue', foldColor: '#93c9f5' },     // Blue
    { color: '#e2c6ff', name: 'Purple', foldColor: '#c193f5' },   // Purple
    { color: '#ffe0b5', name: 'Orange', foldColor: '#ffbb7f' }    // Orange
  ];
  
  // Fetch notes from backend
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.get(`${apiUrl}/api/notes`, {
        headers: {
          'x-auth-password': password
        }
      });
      
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching notes: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      console.error(err);
    }
  }, [password]);
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Open add note modal
  const openAddModal = () => {
    setFormData({
      content: '',
      author: 'Deepak',
      color: '#fff8b8'
    });
    setIsEditMode(false);
    setShowModal(true);
  };
  
  // Open edit modal
  const openEditModal = (note) => {
    setFormData({
      content: note.content,
      author: note.author,
      color: note.color
    });
    setSelectedNote(note);
    setIsEditMode(true);
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedNote(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      if (isEditMode) {
        const response = await axios.put(
          `${apiUrl}/api/notes/${selectedNote._id}`, 
          formData, 
          {
            headers: {
              'x-auth-password': password
            }
          }
        );
        
        setNotes(notes.map(note => 
          note._id === selectedNote._id ? response.data : note
        ));
      } else {
        const response = await axios.post(
          `${apiUrl}/api/notes`, 
          formData,
          {
            headers: {
              'x-auth-password': password
            }
          }
        );
        
        setNotes([...notes, response.data]);
      }
      
      closeModal();
    } catch (err) {
      setError('Error saving note: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        await axios.delete(`${apiUrl}/api/notes/${id}`, {
          headers: {
            'x-auth-password': password
          }
        });
        
        setNotes(notes.filter(note => note._id !== id));
      } catch (err) {
        setError('Error deleting note: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Find fold color based on note color
  const getFoldColor = (noteColor) => {
    const colorObj = noteColors.find(c => c.color === noteColor);
    return colorObj ? colorObj.foldColor : '#f5e577'; // default fold color
  };
  
  // Generate random slight rotation for notes
  const getRandomRotation = () => {
    return Math.floor(Math.random() * 7) - 3; // Random number between -3 and 3
  };
  
  return (
    <Container>
      <Title>Sticky Notes</Title>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <AddButton onClick={openAddModal}>
          <PlusIcon>+</PlusIcon>
          Add New Note
        </AddButton>
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : notes.length === 0 ? (
        <NoNotesMessage>
          <h3>No Notes Yet</h3>
          <p>Add a sticky note to leave a message</p>
        </NoNotesMessage>
      ) : (
        <NotesGrid>
          {notes.map(note => {
            // Generate a random rotation between -3 and 3 degrees for natural look
            const rotation = getRandomRotation();
            const foldColor = getFoldColor(note.color);
            
            return (
              <StickyNote 
                key={note._id} 
                color={note.color}
                foldColor={foldColor}
                rotation={rotation}
              >
                <ActionButtons>
                  <ActionButton onClick={() => openEditModal(note)}>
                    ✎
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(note._id)}>
                    ×
                  </ActionButton>
                </ActionButtons>
                
                <NoteContent>{note.content}</NoteContent>
                <NoteDate>{formatDate(note.createdAt)}</NoteDate>
                <NoteAuthor color={note.author === 'Deepak' ? '#3a86ff' : '#ff527b'}>
                  ~ {note.author}
                </NoteAuthor>
              </StickyNote>
            );
          })}
        </NotesGrid>
      )}
      
      {/* Add/Edit Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              {isEditMode ? 'Edit Note' : 'Add New Note'}
            </ModalTitle>
            <CloseButton onClick={closeModal}>×</CloseButton>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Message</FormLabel>
                <FormTextarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your note here..."
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>From</FormLabel>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="author"
                      value="Deepak"
                      checked={formData.author === 'Deepak'}
                      onChange={handleInputChange}
                    />
                    Deepak
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="author"
                      value="Chaitanya"
                      checked={formData.author === 'Chaitanya'}
                      onChange={handleInputChange}
                    />
                    Chaitanya
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Note Color</FormLabel>
                <RadioGroup>
                  {noteColors.map(noteColor => (
                    <RadioLabel key={noteColor.name}>
                      <input
                        type="radio"
                        name="color"
                        value={noteColor.color}
                        checked={formData.color === noteColor.color}
                        onChange={handleInputChange}
                      />
                      <ColorPreview color={noteColor.color} />
                      {noteColor.name}
                    </RadioLabel>
                  ))}
                </RadioGroup>
              </FormGroup>
              
              <ButtonContainer>
                <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
                <SubmitButton type="submit">{isEditMode ? 'Update' : 'Add'}</SubmitButton>
              </ButtonContainer>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Notes;