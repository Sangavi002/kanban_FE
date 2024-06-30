import { useState } from "react";
import { Box, Input, Select, Heading, Button, Flex, } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


export const Register = () => {
    const [formData,SetFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    });
    const navigate = useNavigate();

    const handleValue = (e) => {
        SetFormData({...formData,[e.target.name]: e.target.value})
    }

    const handleRole = (e) => {
        SetFormData({...formData,role: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch ("https://kanban-be-qz05.onrender.com/user/register" ,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data)
            navigate("/login");
        }catch(err){
            console.log('Registration Error:', err); 
        }
    }
    return(
        <>
        <Box>
            <Flex justifyContent="end">
            <Button onClick={() => navigate("/login")}>Login</Button>
            </Flex>
        </Box>
        <Box margin="130px 450px" p="25px" border="1px solid">
            <Heading size="md" textAlign="center">Register</Heading>
            
            <form onSubmit={handleSubmit}>
                <Flex direction={"column"}>
                <Input type="text"
                        name="username" 
                        placeholder="Enter username.." 
                        value = {formData.username}
                        mb = "15px" p="10px"
                        onChange={handleValue} required/>
                <Input type="text"
                        name="email" 
                        placeholder="Enter email address..." 
                        value = {formData.email}
                        mb = "15px" p="10px"
                        onChange={handleValue} required/>
                <Input type="text"
                        name="password" 
                        placeholder="Enter password..." 
                        value = {formData.password} 
                        mb = "15px" p="10px"
                        onChange={handleValue} required/>
                <Select placeholder="Select role option" size='md'
                        value = {formData.role} 
                        mb = "15px" 
                        onChange={handleRole}>
                    <option value='admin'>Admin</option>
                    <option value='regular'>Regular</option>
                </Select>
                <Button type="submit" p="10px">Register</Button>
                </Flex>
            </form>
        </Box>
        </>
        
    )
       
    
}