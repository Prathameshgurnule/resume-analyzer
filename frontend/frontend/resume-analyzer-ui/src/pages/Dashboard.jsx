
import { useEffect, useState } from "react";
import axios from "axios";
import ATSChart from "../components/ATSChart";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    useEffect(() => {

        if (!token) {
            navigate("/");
            return;
        }

        loadResumes();

        const handleBackButton = () => {

            sessionStorage.removeItem("token");

            navigate("/");
        };

        window.addEventListener(
            "popstate",
            handleBackButton
        );

        return () => {

            window.removeEventListener(
                "popstate",
                handleBackButton
            );
        };

    }, []);

    const loadResumes = async () => {

        try {

            const res = await axios.get(
                "http://localhost:8081/api/resume/all",
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            setResumes(res.data);

        } catch (err) {

            console.log("Failed to load resumes:", err);

            if (err.response?.status === 401) {

                sessionStorage.removeItem("token");

                navigate("/");

            }

        } finally {

            setLoading(false);

        }
    };

    const deleteResume = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resume analysis?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                "http://localhost:8081/api/resume/" + id,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            setResumes((prevResumes) =>
                prevResumes.filter(
                    (r) => r.id !== id
                )
            );

        } catch (err) {

            console.log(
                "Failed to delete resume:",
                err
            );

            alert("Failed to delete resume.");

        }
    };

    const viewResult = (resume) => {

        navigate("/result", {
            state: resume
        });

    };

    const handleLogout = () => {

        sessionStorage.removeItem("token");

        navigate("/");

    };

    const totalResumes = resumes.length;

    const avgScore =
        totalResumes > 0
            ? Math.round(
                  resumes.reduce(
                      (total, resume) =>
                          total +
                          Number(resume.matchScore || 0),
                      0
                  ) / totalResumes
              )
            : 0;

    const bestScore =
        totalResumes > 0
            ? Math.max(
                  ...resumes.map(
                      (resume) =>
                          Number(resume.matchScore || 0)
                  )
              )
            : 0;

    const latestScore =
        totalResumes > 0
            ? Number(
                  resumes[resumes.length - 1]
                      ?.matchScore || 0
              )
            : 0;

    return (

        <div className="container mt-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center">

                <div>

                    <h2>
                        AI Resume Analyzer Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Track and analyze your resume performance
                    </p>

                </div>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </div>


            {/* Upload Button */}

            <button
                className="btn btn-primary mt-3"
                onClick={() =>
                    navigate("/upload")
                }
            >
                📄 Upload New Resume
            </button>


            {/* Statistics */}

            <div className="row mt-4">

                <div className="col-md-3 mb-3">

                    <div className="card p-3 text-center">

                        <h5>
                            Total Resumes
                        </h5>

                        <h2>
                            {totalResumes}
                        </h2>

                    </div>

                </div>


                <div className="col-md-3 mb-3">

                    <div className="card p-3 text-center">

                        <h5>
                            Average ATS
                        </h5>

                        <h2>
                            {avgScore}%
                        </h2>

                    </div>

                </div>


                <div className="col-md-3 mb-3">

                    <div className="card p-3 text-center">

                        <h5>
                            Best ATS
                        </h5>

                        <h2>
                            {bestScore}%
                        </h2>

                    </div>

                </div>


                <div className="col-md-3 mb-3">

                    <div className="card p-3 text-center">

                        <h5>
                            Latest ATS
                        </h5>

                        <h2>
                            {latestScore}%
                        </h2>

                    </div>

                </div>

            </div>


            {/* Chart */}

            <div className="mt-4">

                <ATSChart
                    resumes={resumes}
                />

            </div>


            {/* Resume History */}

            <div className="mt-4">

                <div className="d-flex justify-content-between align-items-center">

                    <h4>
                        Resume Analysis History
                    </h4>

                    <span className="text-muted">
                        {totalResumes} analysis
                        {totalResumes !== 1 ? "es" : ""}
                    </span>

                </div>


                {loading ? (

                    <div className="text-center mt-4">

                        <div
                            className="spinner-border"
                            role="status"
                        >
                        </div>

                        <p className="mt-2">
                            Loading resumes...
                        </p>

                    </div>

                ) : totalResumes === 0 ? (

                    <div className="card p-4 text-center mt-3">

                        <h5>
                            No resumes analyzed yet
                        </h5>

                        <p className="text-muted">
                            Upload your first resume to see
                            your ATS analysis here.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/upload")
                            }
                        >
                            Upload Resume
                        </button>

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover mt-3">

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        File Name
                                    </th>

                                    <th>
                                        ATS Score
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {resumes.map((resume) => (

                                    <tr key={resume.id}>

                                        <td>
                                            {resume.id}
                                        </td>

                                        <td>
                                            {resume.fileName}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${
                                                    Number(resume.matchScore) >= 80
                                                        ? "bg-success"
                                                        : Number(resume.matchScore) >= 50
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                                }`}
                                            >
                                                {resume.matchScore}%
                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() =>
                                                    viewResult(resume)
                                                }
                                            >
                                                View Result
                                            </button>


                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deleteResume(
                                                        resume.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}

export default Dashboard;

