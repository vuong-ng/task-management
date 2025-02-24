import React, { useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  name: string;
  description: string;
}

interface EditTaskModalProps {
  task: Task;
  userId: number;
  onSave: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, userId, onSave, onDelete, onClose }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://3000/api/${userId}/updatetask/${task.id}`, {
        name,
        description,
      });
      const updatedTask: Task = response.data;
      onSave(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/${userId}/deletetask/${task.id}`);
      onDelete(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={handleDelete}>Delete</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;