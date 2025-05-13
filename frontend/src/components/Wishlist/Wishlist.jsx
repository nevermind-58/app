import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 15px;
  letter-spacing: 0.01em;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const Title = styled.h1`
  color: #ff527b;
  text-shadow: 2px 2px 0 #ffca3a;
  margin-bottom: 20px;
  text-align: center;
  font-size: 2.5rem;
  letter-spacing: 0.05em;
  
  @media (max-width: 576px) {
    font-size: 2rem;
    text-shadow: 1px 1px 0 #ffca3a;
    margin-bottom: 15px;
  }
`;

const Subtitle = styled.h2`
  color: #8338ec;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 30px;
  font-weight: 600;
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
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
  font-size: 16px;
  box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.2);
  transition: all 0.2s;
  font-family: inherit;
  
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
  font-family: inherit; 
  opacity: 0.7;
  
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
  margin-bottom: 30px;
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

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 25px;
  
  @media (max-width: 576px) {
    gap: 15px;
  }
`;

const Card = styled.div`
  background: white;
  border: 3px solid ${props => props.completed ? '#4cc9f0' : '#ff527b'};
  border-radius: 12px;
  padding: 22px;
  box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 6px 11px 0 rgba(255, 158, 0, 0.3);
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    border-width: 2px;
    box-shadow: 4px 4px 0 rgba(255, 158, 0, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 4px 7px 0 rgba(255, 158, 0, 0.3);
    }
  }
`;


const WishHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-right: 20px; /* Make space for delete button */
`;

const WishTitle = styled.h3`
  font-size: 18px;
  color: #333;
  font-weight: 700;
  word-break: break-word;
  
  ${props => props.completed && `
    text-decoration: line-through;
    opacity: 0.7;
  `}
`;

const WishContent = styled.div`
  margin-top: 15px;
`;

const WishText = styled.p`
  color: #555;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 15px;
  white-space: pre-wrap;
`;

const WishMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const CreatorBadge = styled.span`
  background-color: ${props => props.creator === 'Deepak' ? '#ff527b' : '#3a86ff'};
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
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
  position: absolute;
  top: 15px;
  right: 45px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #8338ec;
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

const CompletedToggle = styled.button`
  position: absolute;
  top: 15px;
  right: 75px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${props => props.completed ? '#4cc9f0' : '#ccc'};
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
    color: ${props => props.completed ? '#3a86ff' : '#4cc9f0'};
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
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 576px) {
    padding: 15px;
    border-width: 3px;
    width: 95%;
  }
`;

const ModalTitle = styled.h2`
  color: #8338ec;
  text-shadow: 1px 1px 0 #ffca3a;
  margin-bottom: 20px;
  text-align: center;
  font-size: 2rem;
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #8338ec;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-family: inherit; 
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  margin-bottom: 10px;
  
  &:focus {
    border-color: #8338ec;
    outline: none;
  }
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
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit; 
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
  
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 5px;
  }
`;

// New Comment Styles
const CommentsSection = styled.div`
  margin-top: 20px;
  border-top: 1px dashed #ddd;
  padding-top: 15px;
  font-family: inherit; 
`;

const CommentHeader = styled.h4`
  font-size: 16px;
  font-family: inherit; 
  color: #333;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 576px) {
    font-size: 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const CommentsList = styled.div`
  margin-bottom: 15px;
`;

const Comment = styled.div`
  padding: 10px;
  font-family: inherit; 
  margin-bottom: 8px;
  background-color: ${props => props.creator === 'Deepak' ? 'rgba(255, 82, 123, 0.1)' : 'rgba(58, 134, 255, 0.1)'};
  border-radius: 8px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentAuthor = styled.div`
  font-weight: 700;
  font-size: 12px;
  font-family: inherit; 
  color: ${props => props.creator === 'Deepak' ? '#ff527b' : '#3a86ff'};
  margin-bottom: 4px;
`;

const CommentText = styled.div`
  font-size: 14px;
  color: #333;
  font-family: inherit; 
`;

const CommentDate = styled.div`
  font-size: 11px;
  font-family: inherit; 
  color: #888;
  margin-top: 5px;
  text-align: right;
`;

const ShowCommentsToggle = styled.button`
  background: none;
  border: none;
  color: #8338ec;
  cursor: pointer;
  font-family: inherit; 
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExpandIcon = styled.span`
  margin-left: 4px;
  font-size: 12px;
`;

const AddCommentButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 12px;
  font-family: inherit; 
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  
  &:hover {
    background-color: #e9ecef;
    border-color: #8338ec;
    color: #8338ec;
  }
`;

const Wishlist = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Comments state
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [addingComment, setAddingComment] = useState({});
  
  const [formData, setFormData] = useState({
    wish: '',
    completed: false,
    notes: '',
    creator: ''
  });
  
  const { password } = useAuth();
  
  // Fetch wishlist on component mount with proper dependency handling
  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.get(`${apiUrl}/api/wishlist`, {
        headers: {
          'x-auth-password': password
        }
      });
      
      // Sort by createdAt date (newest first)
      const sortedWishlist = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setWishlist(sortedWishlist);
      
      // Fetch comments for all wishes
      fetchAllComments(sortedWishlist.map(item => item._id));
      
      setLoading(false);
    } catch (err) {
      setError('Error fetching wishlist: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      console.error(err);
    }
  }, [password]);
  
  // Fetch comments for all wishes
  const fetchAllComments = async (wishIds) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const allComments = {};
      
      // For each wish, fetch its comments
      for (const wishId of wishIds) {
        const response = await axios.get(`${apiUrl}/api/comments/${wishId}`, {
          headers: {
            'x-auth-password': password
          }
        });
        
        allComments[wishId] = response.data;
      }
      
      setComments(allComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };
  
  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const clearSearch = () => {
    setSearch('');
  };
  
  const handleNewCommentChange = (wishId, value) => {
    setNewComment({
      ...newComment,
      [wishId]: value
    });
  };
  
  const toggleComments = (wishId) => {
    setExpandedComments({
      ...expandedComments,
      [wishId]: !expandedComments[wishId]
    });
  };
  
  const toggleAddComment = (wishId) => {
    setAddingComment({
      ...addingComment,
      [wishId]: !addingComment[wishId]
    });
  };
  
  const handleAddComment = async (wishId) => {
    if (!newComment[wishId] || !newComment[wishId].trim()) return;
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Determine which creator is commenting based on radio button choice
      const commentCreator = document.querySelector('input[name="commentCreator"]:checked')?.value || '';
      
      const commentData = {
        text: newComment[wishId],
        creator: commentCreator,
        wishId: wishId
      };
      
      const response = await axios.post(`${apiUrl}/api/comments`, commentData, {
        headers: {
          'x-auth-password': password
        }
      });
      
      // Update comments state with new comment
      setComments({
        ...comments,
        [wishId]: [...(comments[wishId] || []), response.data]
      });
      
      // Clear comment input
      setNewComment({
        ...newComment,
        [wishId]: ''
      });
      
      // Ensure comments are expanded to see the new comment
      setExpandedComments({
        ...expandedComments,
        [wishId]: true
      });
      
      // Hide the add comment form
      setAddingComment({
        ...addingComment,
        [wishId]: false
      });
      
    } catch (err) {
      setError('Error adding comment: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(`${apiUrl}/api/wishlist/${formData._id}`, formData, {
          headers: {
            'x-auth-password': password
          }
        });
        
        setWishlist(wishlist.map(item => 
          item._id === formData._id ? response.data : item
        ));
      } else {
        const newWish = {
          ...formData
        };
        
        response = await axios.post(`${apiUrl}/api/wishlist`, newWish, {
          headers: {
            'x-auth-password': password
          }
        });
        
        // Update the wishlist with the new item correctly (add to beginning since sorting by newest)
        setWishlist([response.data, ...wishlist]);
        
        // Set current page to the first page to see the new item
        setCurrentPage(1);
      }
      
      closeModal();
    } catch (err) {
      setError('Error saving wish: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wish?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        await axios.delete(`${apiUrl}/api/wishlist/${id}`, {
          headers: {
            'x-auth-password': password
          }
        });
        
        const newWishlist = wishlist.filter(item => item._id !== id);
        setWishlist(newWishlist);
        
        // Adjust current page if we deleted the last item on the page
        const filteredList = filterWishlist(newWishlist);
        const totalPages = Math.ceil(filteredList.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      } catch (err) {
        setError('Error deleting wish');
        console.error(err);
      }
    }
  };
  
  const handleEdit = (item) => {
    setFormData({
      _id: item._id,
      wish: item.wish,
      notes: item.notes || '',
      completed: item.completed || false,
      creator: item.creator || ''
    });
    setIsEditMode(true);
    setShowModal(true);
  };
  
  const handleToggleCompleted = async (id, currentStatus) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.put(`${apiUrl}/api/wishlist/${id}`, 
        { completed: !currentStatus },
        {
          headers: {
            'x-auth-password': password
          }
        }
      );
      
      setWishlist(wishlist.map(item => 
        item._id === id ? response.data : item
      ));
    } catch (err) {
      setError('Error updating completion status');
      console.error(err);
    }
  };
  
  const openModal = () => {
    setFormData({
      wish: '',
      notes: '',
      completed: false,
      creator: ''
    });
    setIsEditMode(false);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
  };
  
  // Filter wishlist based on search term
  const filterWishlist = (list = wishlist) => {
    if (!search.trim()) return list;
    
    const searchLower = search.toLowerCase().trim();
    return list.filter(item => {
      // Search in wish text
      if (item.wish && item.wish.toLowerCase().includes(searchLower)) return true;
      
      // Search in notes
      if (item.notes && item.notes.toLowerCase().includes(searchLower)) return true;
      
      // Search in comments
      if (comments[item._id] && comments[item._id].some(
        comment => comment.text.toLowerCase().includes(searchLower)
      )) return true;
      
      return false;
    });
  };
  
  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    const filteredList = filterWishlist();
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
  
  // Format date for comments
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  const renderWishlist = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (wishlist.length === 0) {
      return (
        <EmptyState>
          <p>No wishes in your wishlist yet</p>
        </EmptyState>
      );
    }
    
    // Filter the wishlist based on search term
    const filteredWishlist = filterWishlist();
    
    // If no search results
    if (filteredWishlist.length === 0) {
      return (
        <NoResultsState>
          <p>No results found for "{search}"</p>
          <CancelButton onClick={clearSearch}>Clear Search</CancelButton>
        </NoResultsState>
      );
    }
    
    // Get current items based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWishlist.slice(indexOfFirstItem, indexOfLastItem);
    
    return (
      <>
        <WishlistGrid>
          {currentItems.map(item => (
            <Card key={item._id} completed={item.completed}>
              <DeleteButton onClick={() => handleDelete(item._id)}>×</DeleteButton>
              <EditButton onClick={() => handleEdit(item)}>✎</EditButton>
              <CompletedToggle 
                completed={item.completed} 
                onClick={() => handleToggleCompleted(item._id, item.completed)}
              >
                {item.completed ? '✓' : '○'}
              </CompletedToggle>
              
              <WishHeader>
                <WishTitle completed={item.completed}>{item.wish}</WishTitle>
              </WishHeader>
              
              {item.notes && (
                <WishContent>
                  <WishText>{item.notes}</WishText>
                </WishContent>
              )}
              
              <WishMeta>
                {item.creator && (
                  <CreatorBadge creator={item.creator}>
                    {item.creator}
                  </CreatorBadge>
                )}
                {item.createdAt && (
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
              </WishMeta>
              
              {/* Comments Section */}
              <CommentsSection>
                <CommentHeader>
                  <ShowCommentsToggle onClick={() => toggleComments(item._id)}>
                    {comments[item._id]?.length ? 
                      `${comments[item._id].length} ${comments[item._id].length === 1 ? 'Comment' : 'Comments'}` : 
                      'Comments'}
                    <ExpandIcon>
                      {expandedComments[item._id] ? '▲' : '▼'}
                    </ExpandIcon>
                  </ShowCommentsToggle>
                  
                  {!addingComment[item._id] && (
                    <AddCommentButton onClick={() => toggleAddComment(item._id)}>
                      Add Comment
                    </AddCommentButton>
                  )}
                </CommentHeader>
                
                {/* Add Comment Form */}
                {addingComment[item._id] && (
                  <div style={{ marginBottom: '15px' }}>
                    <CommentTextarea 
                      placeholder="Write a comment..."
                      value={newComment[item._id] || ''}
                      onChange={(e) => handleNewCommentChange(item._id, e.target.value)}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <RadioGroup>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="commentCreator"
                            value="Deepak"
                            defaultChecked
                          />
                          Deepak
                        </RadioLabel>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="commentCreator"
                            value="Chaitanya"
                          />
                          Chaitanya
                        </RadioLabel>
                      </RadioGroup>
                      
                      <div>
                        <CancelButton 
                          type="button" 
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                          onClick={() => toggleAddComment(item._id)}
                        >
                          Cancel
                        </CancelButton>
                        <SubmitButton 
                          type="button"
                          style={{ padding: '6px 12px', fontSize: '13px', marginLeft: '8px' }}
                          onClick={() => handleAddComment(item._id)}
                        >
                          Add
                        </SubmitButton>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Comments List */}
                {expandedComments[item._id] && comments[item._id]?.length > 0 && (
                  <CommentsList>
                    {comments[item._id]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map(comment => (
                        <Comment key={comment._id} creator={comment.creator}>
                          <CommentAuthor creator={comment.creator}>
                            {comment.creator}
                          </CommentAuthor>
                          <CommentText>{comment.text}</CommentText>
                          <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                        </Comment>
                      ))}
                  </CommentsList>
                )}
              </CommentsSection>
            </Card>
          ))}
        </WishlistGrid>
        
        {renderPagination(filteredWishlist)}
      </>
    );
  };
  
  return (
    <>
      <Container>
        <Title>Our Wishlist</Title>
        <Subtitle>baby hii i love u sm (:</Subtitle>
        
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
            Add Wish
          </AddButton>
        </div>
        
        {error && <div style={{ color: '#ff527b', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
        
        {renderWishlist()}
        
        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>{isEditMode ? 'Edit Wish' : 'Add New Wish'}</ModalTitle>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel>Wish</FormLabel>
                  <FormTextarea
                    name="wish"
                    value={formData.wish}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your wish"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Comments (optional)</FormLabel>
                  <FormTextarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional comments or notes"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Who added this?</FormLabel>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="creator"
                        value="Deepak"
                        checked={formData.creator === 'Deepak'}
                        onChange={handleInputChange}
                      />
                      Deepak
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="creator"
                        value="Chaitanya"
                        checked={formData.creator === 'Chaitanya'}
                        onChange={handleInputChange}
                      />
                      Chaitanya
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      name="completed"
                      checked={formData.completed}
                      onChange={handleInputChange}
                    />
                    Mark as completed
                  </RadioLabel>
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
    </>
  );
};

export default Wishlist;