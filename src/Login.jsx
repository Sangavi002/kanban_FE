import { Box, Heading, Button, Input, Flex} from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [formData, SetFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleValue = (e) => {
        SetFormData({...formData,[e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch ("https://kanban-be-qz05.onrender.com/user/login" ,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data)
            if(data.accessToken){
                localStorage.setItem("token",data.accessToken)
                localStorage.setItem("role",data.role)
                navigate("/home");
            }
        }catch(err){
            console.log('Login Error:', err); 
        }
    }

    return(
        <>
            <Box>
            <Flex justifyContent="end">
            <Button onClick={() => navigate("/")}>Register</Button>
            </Flex>
        </Box>
       <Box margin="50px 50px" p="25px" border="1px solid">
            <Heading size="md" textAlign="center">Login</Heading>
            <form onSubmit={handleSubmit}>
                <Flex direction={"column"}>
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
                <Button type="submit" p="10px">Login</Button>
                </Flex>
            </form>
       </Box> 
        </>
        
    )
}