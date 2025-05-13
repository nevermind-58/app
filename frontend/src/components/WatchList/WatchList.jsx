import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px; // Increased from 1000px to 1200px
  margin: 0 auto;
  padding: 20px 15px; // Added horizontal padding of 15px (was just padding-top)
  letter-spacing: 0.01em;
`;

const Title = styled.h1`
  color: #ff527b;
  text-shadow: 2px 2px 0 #ffca3a;
  margin-bottom: 20px;
  text-align: center;
  font-size: 2.5rem;
  letter-spacing: 0.05em;
`;

// Search bar styling
const SearchContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px auto;
  font-family: inherit; 
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  padding-left: 45px;
  border: 3px solid #3a86ff;
  border-radius: 30px;
  font-family: inherit;
  font-size: 16px;
  box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.2);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8338ec;
    box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.2);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8338ec;
  font-size: 18px;
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #ff527b;
  font-size: 18px;
  opacity: 0.7;
  font-family: inherit; 
  
  &:hover {
    opacity: 1;
  }
`;

const AddButton = styled.button`
  background-color: #8338ec;
  border: 3px solid #6c11d8;
  box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
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
  
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
`;

const PlusIcon = styled.span`
  font-size: 18px;
  margin-right: 8px;
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const Card = styled.div`
  background: white;
  border: 3px solid #3a86ff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 6px 11px 0 rgba(255, 158, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    border-width: 2px;
    box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.3);
    
    &:hover {
      transform: none;
      box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.3);
    }
  }
`;

const ItemTitle = styled.h2`
  font-size: 19px;
  margin-bottom: 18px;
  color: #333;
  padding-right: 25px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 25px;
`;

const ItemType = styled.span`
  background-color: ${props => props.type === 'movie' ? '#ff527b' : '#4cc9f0'};
  color: white;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.03em;
  
  svg, span {
    margin-right: 4px;
  }
`;

const ItemGenre = styled.span`
  background-color: #ffca3a;
  color: #333;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.03em;
  
  svg, span {
    margin-right: 4px;
  }
`;

const NotesSection = styled.div`
  border-top: 1px solid #eee;
  padding-top: 16px;
  margin-top: 22px;
  position: relative;
`;

const NotesContainer = styled.div`
  margin-bottom: ${props => props.isLast ? '0' : '25px'};
`;

const NotesHeader = styled.h3`
  font-size: 13px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  color: #555;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const NotesAuthor = styled.span`
  font-size: 12px;
  background-color: ${props => props.color};
  color: white;
  padding: 3px 8px;
  border-radius: 30px;
  margin-right: 8px;
  font-weight: 600;
`;

const NotesArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 2px solid #3a86ff;
  border-radius: 4px;
  background-color: #f8f9fa;
  font-size: 13px;
  line-height: 1.4;
  resize: vertical;
  min-height: 50px;
  max-height: 120px;
`;

const NotesDisplay = styled.div`
  background-color: ${props => props.color || '#f8f9fa'};
  border-left: 4px solid ${props => props.borderColor || '#3a86ff'};
  padding: 14px;
  margin: 8px 0;
  border-radius: 6px;
  font-size: 13px;
  min-height: 35px;
  white-space: pre-wrap;
  color: #333;
  line-height: 1.6;
  letter-spacing: 0.01em;
`;

const SaveNotesButton = styled.button`
  background-color: #4cc9f0;
  border: 2px solid #3a86ff;
  color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 5px;
  font-weight: 600;
`;

const NoteTimestamp = styled.span`
  font-size: 10px;
  color: #999;
  font-style: italic;
  display: block;
  margin-top: 6px;
`;

const DeleteButton = styled.button`
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
  opacity: 0.7;
  transition: all 0.2s;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const EditButton = styled.button`
  background: none;
  border: 1px solid #3a86ff;
  border-radius: 30px;
  color: #3a86ff;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 8px;
  margin-left: auto;
  transition: all 0.2s;
  font-weight: 600;
  
  &:hover {
    background-color: #3a86ff;
    color: white;
  }
`;

const WatchStatusContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 22px;
  border-top: 1px solid #eee;
  padding-top: 16px;
  
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const WatchStatus = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  
  &:hover {
    color: #333;
  }
`;

const StyledCheckbox = styled.input`
  margin-right: 6px;
  cursor: pointer;
  transform: scale(1.1);
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
  
  @media (max-width: 576px) {
    padding: 15px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
  }
`;

const ModalTitle = styled.h2`
  color: #8338ec;
  text-shadow: 1px 1px 0 #ffca3a;
  margin-bottom: 20px;
  text-align: center;
  font-size: 2rem;
  letter-spacing: 0.04em;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 700;
  color: #333;
  font-size: 14px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #8338ec;
  border-radius: 4px;
  font-size: 14px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #8338ec;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background-color: #8338ec;
  border: 2px solid #6c11d8;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #6c11d8;
  }
`;

const CancelButton = styled.button`
  background-color: #f8f9fa;
  border: 2px solid #ddd;
  color: #333;
  padding: 10px 15px;
  font-family: inherit; 
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  border: 3px dashed #ddd;
  border-radius: 8px;
  margin-top: 20px;
  
  p {
    color: #777;
    margin-bottom: 20px;
  }
`;

const NoResultsState = styled.div`
  text-align: center;
  padding: 40px;
  border: 3px dashed #ddd;
  border-radius: 8px;
  margin-top: 20px;
  font-family: inherit; 
  
  p {
    color: #777;
    margin-bottom: 20px;
  }
  
  button {
    margin-top: 10px;
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

// Pagination components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#8338ec' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#6c11d8' : '#ddd'};
  margin: 0 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  
  &:hover {
    background-color: ${props => props.active ? '#6c11d8' : '#f0f0f0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f0f0f0;
  }
`;

const PageIndicator = styled.div`
  margin: 0 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
`;

const WatchList = () => {
  const [showModal, setShowModal] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    type: 'movie',
    deepakNotes: '',
    chaitanyaNotes: ''
  });
  
  // Search state
  const [search, setSearch] = useState('');
  
  // Add edit mode states
  const [deepakEditMode, setDeepakEditMode] = useState({});
  const [chaitanyaEditMode, setChaitanyaEditMode] = useState({});
  
  // Pagination states - fixed to 6 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { password } = useAuth();
  
  // Format timestamp function
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Fetch watchlist on component mount
  useEffect(() => {
    fetchWatchlist();
  }, []);
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.get(`${apiUrl}/api/watchlist`, {
        headers: {
          'x-auth-password': password
        }
      });
      
      // Sort with newest items first
      const sortedWatchlist = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setWatchlist(sortedWatchlist);
      setLoading(false);
    } catch (err) {
      setError('Error fetching watchlist: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const clearSearch = () => {
    setSearch('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(`${apiUrl}/api/watchlist`, formData, {
        headers: {
          'x-auth-password': password
        }
      });
      
      setWatchlist([response.data, ...watchlist]);
      closeModal();
      // Go to first page when adding a new item
      setCurrentPage(1);
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      setError('Error adding item to watchlist: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleWatchStatusChange = async (id, field, value) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.put(
        `${apiUrl}/api/watchlist/${id}`,
        { [field]: value },
        {
          headers: {
            'x-auth-password': password
          }
        }
      );
      
      setWatchlist(watchlist.map(item => 
        item._id === id ? response.data : item
      ));
    } catch (err) {
      setError('Error updating watch status');
      console.error(err);
    }
  };
  
  const handleNotesChange = async (id, field, value) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const updatedAt = new Date().toISOString();
      const response = await axios.put(
        `${apiUrl}/api/watchlist/${id}`,
        { 
          [field]: value,
          [`${field}UpdatedAt`]: updatedAt // Add timestamp
        },
        {
          headers: {
            'x-auth-password': password
          }
        }
      );
      
      setWatchlist(watchlist.map(item => 
        item._id === id ? response.data : item
      ));
      
      // Exit edit mode after saving
      if (field === 'deepakNotes') {
        setDeepakEditMode({...deepakEditMode, [id]: false});
      } else if (field === 'chaitanyaNotes') {
        setChaitanyaEditMode({...chaitanyaEditMode, [id]: false});
      }
    } catch (err) {
      setError('Error saving notes');
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        await axios.delete(`${apiUrl}/api/watchlist/${id}`, {
          headers: {
            'x-auth-password': password
          }
        });
        
        const newWatchlist = watchlist.filter(item => item._id !== id);
        setWatchlist(newWatchlist);
        
        // Adjust current page if we deleted the last item on the page
        const filteredList = filterWatchlist(newWatchlist);
        const totalPages = Math.ceil(filteredList.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      } catch (err) {
        setError('Error deleting item');
        console.error(err);
      }
    }
  };
  
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      genre: '',
      type: 'movie',
      deepakNotes: '',
      chaitanyaNotes: ''
    });
  };
  
  // Filter watchlist based on search term
  const filterWatchlist = (list = watchlist) => {
    if (!search.trim()) return list;
    
    const searchLower = search.toLowerCase().trim();
    return list.filter(item => {
      // Search in title
      if (item.title.toLowerCase().includes(searchLower)) return true;
      
      // Search in genre
      if (item.genre && item.genre.toLowerCase().includes(searchLower)) return true;
      
      // Search in notes
      if (item.deepakNotes && item.deepakNotes.toLowerCase().includes(searchLower)) return true;
      if (item.chaitanyaNotes && item.chaitanyaNotes.toLowerCase().includes(searchLower)) return true;
      
      return false;
    });
  };
  
  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    const filteredList = filterWatchlist();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  const renderPagination = (filteredItems) => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    if (totalPages <= 1) return null;
    
    return (
      <PaginationContainer>
        <PageButton 
          onClick={prevPage} 
          disabled={currentPage === 1}
        >
          &lt;
        </PageButton>
        
        {totalPages <= 5 ? (
          // If 5 or fewer pages, show all page numbers
          [...Array(totalPages)].map((_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))
        ) : (
          // If more than 5 pages, show a subset with ellipses
          <>
            <PageButton
              active={currentPage === 1}
              onClick={() => paginate(1)}
            >
              1
            </PageButton>
            
            {currentPage > 3 && <PageIndicator>...</PageIndicator>}
            
            {/* Show current page and one on each side when possible */}
            {currentPage > 2 && currentPage < totalPages - 1 && (
              <PageButton
                active={true}
                onClick={() => paginate(currentPage)}
              >
                {currentPage}
              </PageButton>
            )}
            
            {currentPage < totalPages - 2 && <PageIndicator>...</PageIndicator>}
            
            <PageButton
              active={currentPage === totalPages}
              onClick={() => paginate(totalPages)}
            >
              {totalPages}
            </PageButton>
          </>
        )}
        
        <PageButton 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
        >
          &gt;
        </PageButton>
      </PaginationContainer>
    );
  };
  
  const renderWatchlistItems = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (watchlist.length === 0 && !search.trim()) {
        return (
          <EmptyState>
            <p>No items in your watchlist yet</p>
          </EmptyState>
        );
      }
    
    // Filter the watchlist based on search term
    const filteredWatchlist = filterWatchlist();
    
    // If no search results
    if (filteredWatchlist.length === 0) {
      return (
        <NoResultsState>
          <p>No results found for "{search}"</p>
          <CancelButton onClick={clearSearch}>Clear Search</CancelButton>
        </NoResultsState>
      );
    }
    
    // Get current items based on pagination and filtered list
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWatchlist.slice(indexOfFirstItem, indexOfLastItem);
    
    return (
      <>
        <WatchlistGrid>
          {currentItems.map(item => (
            <Card key={item._id}>
              <DeleteButton onClick={() => handleDelete(item._id)}>×</DeleteButton>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemMeta>
                <ItemType type={item.type}>
                  {item.type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
                </ItemType>
                {item.genre && <ItemGenre>🏷️ {item.genre}</ItemGenre>}
              </ItemMeta>
              
              {/* Deepak's Notes */}
              <NotesContainer>
                <NotesSection>
                  <NotesHeader>
                    <NotesAuthor color="#ff527b">Deepak</NotesAuthor>
                    <EditButton 
                      onClick={() => setDeepakEditMode({
                        ...deepakEditMode, 
                        [item._id]: !deepakEditMode[item._id]
                      })}
                    >
                      {deepakEditMode[item._id] ? 'Cancel' : 'Edit'}
                    </EditButton>
                  </NotesHeader>
                  
                  {deepakEditMode[item._id] ? (
                    <>
                      <NotesArea 
                        placeholder="Deepak's notes..."
                        value={item.deepakNotes || ''}
                        onChange={(e) => {
                          const newWatchlist = [...watchlist];
                          const itemIndex = newWatchlist.findIndex(i => i._id === item._id);
                          newWatchlist[itemIndex].deepakNotes = e.target.value;
                          setWatchlist(newWatchlist);
                        }}
                      />
                      <SaveNotesButton onClick={() => handleNotesChange(item._id, 'deepakNotes', item.deepakNotes)}>
                        Save
                      </SaveNotesButton>
                    </>
                  ) : (
                    <>
                      {item.deepakNotes ? (
                        <NotesDisplay borderColor="#ff527b" color="#fff0f3">
                          {item.deepakNotes}
                          {item.deepakNotesUpdatedAt && (
                            <NoteTimestamp>Last updated: {formatDate(item.deepakNotesUpdatedAt)}</NoteTimestamp>
                          )}
                        </NotesDisplay>
                      ) : (
                        <NotesDisplay borderColor="#ff527b" color="#fff0f3">
                          <i>No notes yet</i>
                        </NotesDisplay>
                      )}
                    </>
                  )}
                </NotesSection>
              </NotesContainer>
              
              {/* Chaitanya's Notes */}
              <NotesContainer isLast>
                <NotesSection>
                  <NotesHeader>
                    <NotesAuthor color="#3a86ff">Chaitanya</NotesAuthor>
                    <EditButton 
                      onClick={() => setChaitanyaEditMode({
                        ...chaitanyaEditMode, 
                        [item._id]: !chaitanyaEditMode[item._id]
                      })}
                    >
                      {chaitanyaEditMode[item._id] ? 'Cancel' : 'Edit'}
                    </EditButton>
                  </NotesHeader>
                  
                  {chaitanyaEditMode[item._id] ? (
                    <>
                      <NotesArea 
                        placeholder="Chaitanya's notes..."
                        value={item.chaitanyaNotes || ''}
                        onChange={(e) => {
                          const newWatchlist = [...watchlist];
                          const itemIndex = newWatchlist.findIndex(i => i._id === item._id);
                          newWatchlist[itemIndex].chaitanyaNotes = e.target.value;
                          setWatchlist(newWatchlist);
                        }}
                      />
                      <SaveNotesButton onClick={() => handleNotesChange(item._id, 'chaitanyaNotes', item.chaitanyaNotes)}>
                        Save
                      </SaveNotesButton>
                    </>
                  ) : (
                    <>
                      {item.chaitanyaNotes ? (
                        <NotesDisplay borderColor="#3a86ff" color="#f0f7ff">
                          {item.chaitanyaNotes}
                          {item.chaitanyaNotesUpdatedAt && (
                            <NoteTimestamp>Last updated: {formatDate(item.chaitanyaNotesUpdatedAt)}</NoteTimestamp>
                          )}
                        </NotesDisplay>
                      ) : (
                        <NotesDisplay borderColor="#3a86ff" color="#f0f7ff">
                          <i>No notes yet</i>
                        </NotesDisplay>
                      )}
                    </>
                  )}
                </NotesSection>
              </NotesContainer>
              
              <WatchStatusContainer>
                <WatchStatus>
                  <CheckboxLabel>
                    <StyledCheckbox 
                      type="checkbox" 
                      checked={item.deepakWatched}
                      onChange={(e) => handleWatchStatusChange(item._id, 'deepakWatched', e.target.checked)}
                    />
                    Deepak watched
                  </CheckboxLabel>
                </WatchStatus>
                <WatchStatus>
                  <CheckboxLabel>
                    <StyledCheckbox 
                      type="checkbox" 
                      checked={item.chaitanyaWatched}
                      onChange={(e) => handleWatchStatusChange(item._id, 'chaitanyaWatched', e.target.checked)}
                    />
                    Chaitanya watched
                  </CheckboxLabel>
                </WatchStatus>
              </WatchStatusContainer>
            </Card>
          ))}
        </WatchlistGrid>
        
        {renderPagination(filteredWatchlist)}
      </>
    );
  };
  
  return (
    <>
      <Container>
        <Title>Our Watchlist</Title>
        
        {/* Search Bar */}
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <ClearSearchButton onClick={clearSearch}>×</ClearSearchButton>
          )}
        </SearchContainer>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <AddButton onClick={openModal}>
            <PlusIcon>+</PlusIcon>
            Add to Watchlist
          </AddButton>
        </div>
        
        {error && <div style={{ color: '#ff527b', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
        
        {renderWatchlistItems()}
        
        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>Add to Watchlist</ModalTitle>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel>Title</FormLabel>
                  <FormInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Genre</FormLabel>
                  <FormInput
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Type</FormLabel>
                  <FormSelect
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="movie">Movie</option>
                    <option value="show">TV Show</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Deepak's Notes (Optional)</FormLabel>
                  <NotesArea
                    name="deepakNotes"
                    value={formData.deepakNotes}
                    onChange={handleInputChange}
                    placeholder="Deepak's thoughts on this recommendation..."
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Chaitanya's Notes (Optional)</FormLabel>
                  <NotesArea
                    name="chaitanyaNotes"
                    value={formData.chaitanyaNotes}
                    onChange={handleInputChange}
                    placeholder="Chaitanya's thoughts on this recommendation..."
                  />
                </FormGroup>
                <ButtonContainer>
                  <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
                  <SubmitButton type="submit">Add to Watchlist</SubmitButton>
                </ButtonContainer>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
};

export default WatchList;