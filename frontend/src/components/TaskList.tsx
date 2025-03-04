import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  Checkbox
} from '@mui/material';


const TaskList: React.FC<{ userId: number }> = ({ userId }) => {
  
  // state for tasks list
  const [tasks, setTasks] = useState<{ id: number; name: string; description:string, complete:boolean}[]>([]);
  const [selectedTask, setSelectedTask] = useState<{ id: number; name: string; description: string, complete:boolean } | null>(null);
  
  // state  for the all modal
  const [openModal, setOpenModal] = useState<boolean>(false);

  // state for the updated task
  const [updatedTaskName, setUpdatedTaskName] = useState<string>("");
  const [updatedDescription, setUpdatedDescription] = useState<string>("");
  const [updatedComplete, setUpdatedComplete] = useState<boolean>(false);


  console.log(userId);
  const accessToken = localStorage.getItem('token');
  const navigate = useNavigate();

  // for adding task
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskComplete, setNewTaskComplete] = useState(false);

  const handleOpenModal = (task: { id: number, name: string, description: string, complete:boolean }) => {
    setSelectedTask(task);
    setUpdatedTaskName(task.name);
    setUpdatedDescription(task.description);
    setUpdatedComplete(task.complete);
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  }

  const handleDeleteTask = async () => {
    if (selectedTask) {
      setTasks(tasks.filter(task => task.id != selectedTask.id))

      // request delete the selected task
      try {
        const response = await axios.delete(`http://localhost:3000/api/${userId}/deletetask/${selectedTask.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log("delete task: ", response.data);
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
    return;
  }

  const handleSignOut = () => {
      localStorage.removeItem('token');
      navigate('/login');
  }

  const handleSaveTask = async () => {
    if (selectedTask) {
      setTasks(tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, name: updatedTaskName, description: updatedDescription, complete:updatedComplete }
          : task
      ));
      // update the selected task
      try {
        const response = await axios.post(`http://localhost:3000/api/${userId}/updatetask/${selectedTask.id}`, {
          name:updatedTaskName,
          description: updatedDescription,
          complete: updatedComplete
        },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error updating task:", error);
      }
      handleCloseModal();
    }
  }

  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        
        console.log(accessToken);
        const response = await axios.get(`http://localhost:3000/api/${userId}/gettasks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        });
        const data = response.data;
        setTasks(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId, accessToken]);

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  }

  const handleCloseAddModal = () => {
    setNewTaskName('');
    setNewTaskDescription('');
    // setUpdatedComplete(false);
    setOpenAddModal(false);
  }

  const handleToggleComplete = async (updatedTask: {id: number, name: string, description: string, complete: boolean} ) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/${userId}/updatetask/${updatedTask.id}`,
        {
          name: updatedTask.name,
          id:updatedTask.id,
          description: updatedTask.description,
          complete: updatedTask.complete,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>               // iterate to find the right task id, else change nothing
          task.id === updatedTask.id
            ? { ...task, complete: !updatedTask.complete }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };


  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      alert("Task name is required!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/${userId}/addtask`,
        {
          name: newTaskName,
          description: newTaskDescription,
          user_id: userId,
          complete: newTaskComplete,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        }
      );
      const data = {
        id: response.data.id,
        name: newTaskName,
        description: newTaskDescription,
        complete: newTaskComplete
      };
      
      // Update tasks state with the new task
      setTasks(prevTasks => [...prevTasks, data]);
      setTasks([...tasks, data]);
      console.log(data);
      handleCloseAddModal();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>

      <Button
        onClick={handleOpenAddModal}
        variant='contained'
        color='primary'
      >
        Add Task
      </Button>

      <Button
        onClick={handleSignOut}
        variant='contained'
        color='secondary'
        sx={{ ml: 2 }}
      >
        Sign Out
      </Button>
      
      <List sx={{ width: '100%' }}>
        {tasks.map((task: { id: number; name: string; description:string, complete: boolean}) => (
          <ListItem key={task.id} sx={{ mb: 2, width:400}}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                width: '100%',
                '&:hover': { boxShadow: 3 }
              }}
            >
              <Typography variant="h6">{task.name}</Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                {task.description}
              </Typography>
              <Typography
                variant="body2"
                color={task.complete ? "green" : "red"}
                sx={{ mb: 2 }}
              >
                {task.complete ? "Complete" : "Incomplete"}
              </Typography>
              <Checkbox
                checked={task.complete}
                onChange={() => {
                  task.complete = !task.complete;
                  handleToggleComplete(task);
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => handleOpenModal(task)}
              >
                Edit
              </Button>
            </Paper>
          </ListItem>
        ))}
      </List>

      

      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              required
              autoFocus
              margin="dense"
              id="name"
              label="Task Name"
              type="text"
              fullWidth
              variant="outlined"
              value={updatedTaskName}
              onChange={(e) => setUpdatedTaskName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={updatedComplete}
                onChange={(e) => {
                  setUpdatedComplete(!updatedComplete);
                }}
              />
              <Typography>Mark as Complete</Typography>
            </Box>
            <TextField
              margin="dense"
              id="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Box>
            <Button 
              onClick={handleCloseModal} 
              color="inherit" 
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteTask} 
              color="error" 
              variant="contained"
            >
              Delete
            </Button>
          </Box>
          <Button 
            onClick={handleSaveTask} 
            color="primary" 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

            <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              required
              autoFocus
              margin="dense"
              id="newTaskName"
              label="Task Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="newTaskDescription"
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseAddModal}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTask}
            color="primary"
            variant="contained"
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
