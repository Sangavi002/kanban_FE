import { Route,Routes } from "react-router-dom";
import {Register} from "./Register";
import {Login} from "./Login";
import {Home} from "./Home";
import { CreateTask } from "./CreateTask";
import { EditTask } from "./EditTask";

function App() {
  return(
    <>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/createTask" element={<CreateTask />} />
      <Route path="/editTask" element={<EditTask />} />
    </Routes>
    </>
  )
}

export default App
