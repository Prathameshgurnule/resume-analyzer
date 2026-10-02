import { useState } from "react";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

function Login() {

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await loginUser(loginData);

            const data = response.data;

            if (data.token) {

                // Browser close => auto logout
                sessionStorage.setItem(
                    "token",
                    data.token
                );

                navigate("/dashboard");

                return;
            }

            alert("Invalid Response");

        } catch (error) {

            console.error(error);

            setError("Invalid Email or Password");

        }
    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2 className="text-center mb-4">
                    AI Resume Analyzer Login
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}

                    <button
                        type="submit"
                        className="btn btn-success w-100"
                    >
                        Login
                    </button>

                    <div className="text-center mt-3">

                        <p>
                            Don't have an account?
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Register Here
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default Login;