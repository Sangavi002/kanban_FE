import { Box, Heading, Flex, Input, Select , Button} from "@chakra-ui/react";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const CreateTask = () => {
    const [formData, SetFormData] = useState({
        title: "",
        description: "",
        assignee: "",
        status: "",
        duedate: "",
    })
    const navigate = useNavigate();

    const handleValue = (e) => {
        SetFormData({...formData,[e.target.name]: e.target.value})
    }

    const handleStatus = (e) => {
        SetFormData({...formData,status: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch ("https://kanban-be-qz05.onrender.com/task/createTask" ,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data)
            navigate("/home");
        }catch(err){
            console.log('Task Error:', err); 
        }
    }

    return(
        <Box>
            <Heading size="md" textAlign="center">Register</Heading>
            <form onSubmit={handleSubmit}>
                <Flex direction="column">
                <Input type="text"
                        placeholder="Enter title"
                        value={formData.title}
                        name="title"
                        onChange={handleValue} required/>
                <Input type="text"
                        placeholder="Enter description"
                        value={formData.description}
                        name="description"
                        onChange={handleValue} required/>
                <Input type="text"
                        placeholder="Enter assignee name"
                        value={formData.assignee}
                        name="assignee"
                        onChange={handleValue} required/>
                <Select placeholder="Status" size='md'
                        value = {formData.status} 
                        mb = "15px" 
                        onChange={handleStatus}>
                    <option value='to-do'>To-Do</option>
                    <option value='in-progress'>In-Progress</option>
                    <option value='done'>Done</option>
                </Select>
                <Input type="date"
                        placeholder="Enter duedate"
                        value={formData.duedate}
                        name="duedate"
                        onChange={handleValue} required/>
                </Flex>
                <Button type="submit">Create a Task</Button>
            </form>
        </Box>
    )
}