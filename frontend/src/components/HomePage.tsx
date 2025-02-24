import React from 'react';
import TaskList from '../components/TaskList';
import {useLocation } from 'react-router-dom';
  
const HomePage: React.FC = () => {
    const location = useLocation();
    const { name,  id } = location.state as { name: string, id: number};
    console.log(name, id);
  
    return (
      <div>
        <h1>Welcome, {name}</h1>
        <TaskList userId={id} />
      </div>
    );
  };
  
  export default HomePage;
