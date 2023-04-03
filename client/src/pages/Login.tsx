import { Link } from "react-router-dom";

const Login = ({}) => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <form className="bg-white w-96 p-6 rounded-lg grid shadow-md">
        <h1 className="text-2xl text-center font-bold p-2 text-blue-600">Log in</h1>
        <div className="grid gap-1">
          <label htmlFor="username" className="text-lg font-semibold text-blue-600">Username</label>
          <input type="text" id="username" className="border border-gray-300 px-3 py-2 rounded-lg" />
        </div>
        <br />
        <div className="grid gap-1">
          <label htmlFor="password" className="text-lg font-semibold text-blue-600">Password</label>
          <input type="text" id="password" className="border border-gray-300 px-3 py-2 rounded-lg" />
        </div>
        <br />
        <button className="bg-blue-600 p-2 rounded-lg text-white">Log In</button>
        <p className="text-center mt-2">Need an account? <Link to={"/signup"} className="text-blue-600">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;
