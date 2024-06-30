import { Box, Heading, Flex, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const EditTask = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { task } = location.state;

    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        duedate: task.duedate.split('T')[0], 
    });

    const handleValue = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://kanban-be-qz05.onrender.com/task/updateTask/${task._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            navigate("/home");
        } catch (err) {
            console.log('Task Error:', err);
        }
    };

    return (
        <Box>
            <Heading size="md" textAlign="center">Update Task</Heading>
            <form onSubmit={handleSubmit}>
                <Flex direction="column">
                    <label>Title</label>
                    <Input
                        type="text"
                        placeholder="Enter title"
                        value={formData.title}
                        name="title"
                        onChange={handleValue}
                        required
                    />
                    <label>Description</label>
                    <Input
                        type="text"
                        placeholder="Enter description"
                        value={formData.description}
                        name="description"
                        onChange={handleValue}
                        required
                    />
                    <label>Assignee</label>
                    <Input
                        type="text"
                        placeholder="Enter assignee name"
                        value={formData.assignee}
                        name="assignee"
                        onChange={handleValue}
                        required
                    />
                    <label>Due-Date</label>
                    <Input
                        type="date"
                        placeholder="Enter duedate"
                        value={formData.duedate}
                        name="duedate"
                        onChange={handleValue}
                        required
                    />
                </Flex>
                <Box>
                    <Flex justifyContent="space-around">
                        <Button type="submit">Update Task</Button>
                        <Button onClick={() => navigate("/home")}>Cancel</Button>
                    </Flex>
                </Box>
            </form>
        </Box>
    );
};
