import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import PersistLogin from "./components/PersistLogin";
import Main from "./components/Main";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PersistLogin />}>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />}>
              <Route path=":conversationId/*" element={<Main />} />
            </Route>
            <Route path="/new" element={<Home />} />
            <Route path="/new/group" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
