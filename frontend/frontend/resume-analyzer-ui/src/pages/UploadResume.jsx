import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadResume() {

    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const uploadResume = async () => {

        try {

            if (!file) {
                alert("Please Select Resume PDF");
                return;
            }

            if (!jobDescription.trim()) {
                alert("Please Enter Job Description");
                return;
            }

            setLoading(true);

            // Login.jsx stores token in sessionStorage
            const token = sessionStorage.getItem("token");

            console.log("=================================");
            console.log("UPLOAD RESUME");
            console.log("TOKEN EXISTS =", !!token);
            console.log("FILE =", file.name);
            console.log("=================================");

            if (!token) {
                alert("Session expired. Please login again.");
                navigate("/");
                return;
            }

            const formData = new FormData();

            formData.append("file", file);
            formData.append("jobDescription", jobDescription);

            const response = await axios.post(
                "http://localhost:8081/api/resume/analyze",
                formData,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            console.log("=================================");
            console.log("UPLOAD SUCCESS");
            console.log("STATUS =", response.status);
            console.log("RESPONSE =", response.data);
            console.log("=================================");

            navigate("/result", {
                state: response.data
            });

        } catch (error) {

            console.error("=================================");
            console.error("UPLOAD ERROR");
            console.error(error);
            console.error("=================================");

            if (error.response) {

                console.error(
                    "STATUS =",
                    error.response.status
                );

                console.error(
                    "BACKEND RESPONSE =",
                    error.response.data
                );

                alert(
                    "Error " +
                    error.response.status +
                    "\n" +
                    JSON.stringify(
                        error.response.data,
                        null,
                        2
                    )
                );

            } else if (error.request) {

                console.error(
                    "REQUEST SENT BUT NO RESPONSE FROM SERVER"
                );

                alert(
                    "Backend server did not respond."
                );

            } else {

                console.error(
                    "ERROR BEFORE REQUEST =",
                    error.message
                );

                alert(
                    "Unable to send request to Backend Server."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2 className="text-center mb-4">
                    AI Resume Analyzer
                </h2>

                <div className="mb-3">

                    <label className="form-label">
                        Upload Resume (PDF)
                    </label>

                    <input
                        type="file"
                        accept=".pdf"
                        className="form-control"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Job Description
                    </label>

                    <textarea
                        className="form-control"
                        rows="8"
                        placeholder="Paste Job Description Here..."
                        value={jobDescription}
                        onChange={(e) => {
                            setJobDescription(e.target.value);
                        }}
                    />

                </div>

                <button
                    className="btn btn-primary"
                    onClick={uploadResume}
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing Resume..."
                        : "Analyze Resume"
                    }
                </button>

            </div>

        </div>
    );
}

export default UploadResume;
