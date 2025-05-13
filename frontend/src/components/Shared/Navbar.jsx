import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const NavContainer = styled.nav`
  background: linear-gradient(to right, #4cc9f0, #3a86ff);
  padding: 15px 20px;
  margin-bottom: 30px;
  border-bottom: 4px solid #ff9e00;
  border-radius: 0 0 8px 8px;
  
  @media (max-width: 576px) {
    padding: 10px;
    margin-bottom: 20px;
    border-bottom-width: 3px;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding-bottom: 60px; /* Increased for better spacing */
    gap: 8px;
  }
`;

const NavItem = styled.li`
  padding: 8px;
  background-color: white;
  border: 2px solid #ff9e00;
  box-shadow: 3px 3px 0 #ff527b;
  transition: all 0.1s;
  border-radius: 4px;

  &:hover {
    background-color: #f0f0f0;
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #ff527b;
  }

  a {
    text-decoration: none;
    color: #333333;
    font-size: 10px;
    
    @media (max-width: 576px) {
      font-size: 12px; /* Slightly larger on mobile for better touch targets */
    }
  }
  
  @media (max-width: 768px) {
    width: 80%; /* Make buttons wider on mobile */
    text-align: center;
  }
`;

const LogoutButton = styled.button`
  font-size: 10px;
  padding: 8px;
  background-color: #ff527b;
  border: 2px solid #ff527b;
  border-radius: 4px;
  box-shadow: 3px 3px 0 #ff9e00;
  color: white;
  cursor: pointer;
  transition: all 0.1s;
  position: absolute;
  right: 0;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #ff9e00;
  }
  
  @media (max-width: 768px) {
    bottom: 10px;
    right: 50%;
    transform: translateX(50%);
    width: 80%;
    font-size: 12px;
    padding: 10px;
    
    &:hover {
      transform: translateX(50%) translate(1px, 1px);
    }
  }
`;

const Icon = styled.span`
  display: inline-block;
  margin-right: 5px;
  color: ${props => props.color || '#ff9e00'};
`;

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <Link to="/"><Icon color="#ff9e00">♦</Icon> Home</Link>
        </NavItem>
        <NavItem>
          <Link to="/timeline"><Icon color="#ff527b">♥</Icon> Timeline</Link>
        </NavItem>
        <NavItem>
          <Link to="/watchlist"><Icon color="#3a86ff">◆</Icon> Watchlist</Link>
        </NavItem>
        <NavItem>
          <Link to="/wishlist"><Icon color="#ff527b">★</Icon> Wishlist</Link>
        </NavItem>
        <NavItem>
            <Link to="/notes"><Icon color="#ff527b">◩</Icon>Notes</Link>
        </NavItem>
        <LogoutButton onClick={logout}>Exit</LogoutButton>
      </NavList>
    </NavContainer>
  );
};

export default Navbar;