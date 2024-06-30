import { Box, Button, Flex, Table, Tbody, Tr, Th, Td, Card, CardHeader, CardBody, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const Home = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [todoTasks, setTodoTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 3;

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
        fetchTask();
    }, []);

    const fetchTask = async () => {
        const response = await fetch("https://kanban-be-qz05.onrender.com/task/allTask", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
        const data = await response.json();
        setTasks(data);
        organizeTasks(data);
    };

    const organizeTasks = (tasks) => {
        const todo = [];
        const inProgress = [];
        const done = [];

        tasks.forEach(task => {
            if (task.status === 'to-do') {
                todo.push(task);
            } else if (task.status === 'in-progress') {
                inProgress.push(task);
            } else if (task.status === 'done') {
                done.push(task);
            }
        });

        setTodoTasks(todo);
        setInProgressTasks(inProgress);
        setDoneTasks(done);
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`https://kanban-be-qz05.onrender.com/task/deleteTask/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });
            if (response.status === 200) {
                fetchTask();
            } else {
                const data = await response.json();
                console.error(data.msg);
            }
        } catch (error) {
            console.error('Delete Task Error:', error);
        }
    };

    const handleEditClick = (task) => {
        navigate("/editTask", { state: { task } });
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const updatedTasks = [...tasks];
        const taskToMove = updatedTasks.find(task => task._id === draggableId);
        if (taskToMove) {
            taskToMove.status = destination.droppableId;
            updateTaskStatus(draggableId, destination.droppableId);
        }

        setTasks(updatedTasks);
        organizeTasks(updatedTasks);
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            await fetch(`https://kanban-be-qz05.onrender.com/task/updateTask/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ status })
            });
        } catch (error) {
            console.error('Update Task Status Error:', error);
        }
    };

    const paginateTasks = (tasks) => {
        const startIndex = (currentPage - 1) * tasksPerPage;
        return tasks.slice(startIndex, startIndex + tasksPerPage);
    };

    return (
        <>
            <Box>
                <Flex justifyContent="space-between">
                    {userRole === 'admin' && <Button onClick={() => navigate("/createTask")}>Create Task</Button>}
                    <Button onClick={() => navigate("/login")}>Logout</Button>
                </Flex>
            </Box>
            <DragDropContext onDragEnd={onDragEnd}>
                <Flex justifyContent="space-between">
                    
                    <TaskColumn
                        title="To-Do"
                        tasks={paginateTasks(todoTasks)}
                        handleEditClick={handleEditClick}
                        handleDelete={handleDelete}
                        userRole={userRole}
                    />
                    {/* In-Progress Column */}
                    <TaskColumn
                        title="In-Progress"
                        tasks={paginateTasks(inProgressTasks)}
                        handleEditClick={handleEditClick}
                        handleDelete={handleDelete}
                        userRole={userRole}
                    />
                    {/* Done Column */}
                    <TaskColumn
                        title="Done"
                        tasks={paginateTasks(doneTasks)}
                        handleEditClick={handleEditClick}
                        handleDelete={handleDelete}
                        userRole={userRole}
                    />
                </Flex>
            </DragDropContext>
            <Flex justifyContent="center" mt={4}>
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Text mx={4}>Page {currentPage}</Text>
                <Button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={(currentPage * tasksPerPage) >= tasks.length}
                >
                    Next
                </Button>
            </Flex>
        </>
    );
};

const TaskColumn = ({ title, tasks, handleEditClick, handleDelete, userRole }) => (
    <Droppable droppableId={title.toLowerCase().replace(' ', '-')}>
        {(provided) => (
            <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                <Table>
                    <thead>
                        <Tr>
                            <Th>{title}</Th>
                        </Tr>
                    </thead>
                    <Tbody>
                        {tasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided) => (
                                    <Tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Td>
                                            <Card border="1px solid">
                                                <CardHeader>
                                                    <Text fontSize='18px' m="0" pl="10px"><strong>{task.title}</strong></Text>
                                                </CardHeader>
                                                <CardBody>
                                                    <Text pt='2' fontSize='15px' m="10px">
                                                        <strong>Description:</strong> {task.description}
                                                    </Text>
                                                    <Text pt='2' fontSize='15px' m="10px">
                                                        <strong>Assignee:</strong> {task.assignee}
                                                    </Text>
                                                    <Text pt='2' fontSize='15px' m="10px">
                                                        <strong>Created-Date:</strong> {new Date(task.createdAt).toLocaleDateString()}
                                                    </Text>
                                                    <Text pt='2' fontSize='15px' m="10px">
                                                        <strong>Due-Date:</strong> {new Date(task.duedate).toLocaleDateString()}
                                                    </Text>
                                                    {userRole === 'admin' &&
                                                        <Box pb="10px">
                                                            <Flex justifyContent="space-around">
                                                                <Button onClick={() => handleEditClick(task)}>Edit</Button>
                                                                <Button onClick={() => handleDelete(task._id)}>Delete</Button>
                                                            </Flex>
                                                        </Box>}
                                                </CardBody>
                                            </Card>
                                        </Td>
                                    </Tr>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Tbody>
                </Table>
            </Box>
        )}
    </Droppable>
);


