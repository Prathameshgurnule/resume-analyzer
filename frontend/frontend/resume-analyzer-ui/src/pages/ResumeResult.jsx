
import { useLocation, useNavigate } from "react-router-dom";

function ResumeResult() {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="container mt-4">
                <h3>No Result Found</h3>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/upload")}
                >
                    Analyze Resume
                </button>
            </div>
        );
    }

    const aiSuggestions =
        state.aiSuggestions &&
        state.aiSuggestions.trim() !== ""
            ? state.aiSuggestions
            : "AI suggestions are currently unavailable. Please check the backend AI configuration.";

    return (
        <div className="container mt-4">

            <h2>Resume Analysis Result</h2>

            <div className="card p-4">

                <h4>
                    ATS Score :
                    <span className="text-success">
                        {" "}
                        {state.matchScore ?? 0}%
                    </span>
                </h4>

                <hr />

                <h5>Matched Keywords</h5>

                <p>
                    {state.matchedKeywords || "No matched keywords"}
                </p>

                <h5>Missing Keywords</h5>

                <p>
                    {state.missingKeywords || "No missing keywords"}
                </p>

                <h5>AI Suggestions</h5>

                <div style={{ whiteSpace: "pre-wrap" }}>
                    {aiSuggestions}
                </div>

                <hr />

                <h5>Job Description</h5>

                <p>
                    {state.jobDescription || "Not available"}
                </p>

                <h5>Resume Content</h5>

                <div
                    style={{
                        maxHeight: "300px",
                        overflowY: "auto"
                    }}
                >
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {state.resumeText || "Resume content unavailable"}
                    </pre>
                </div>

                <button
                    className="btn btn-primary mt-4"
                    onClick={() => navigate("/upload")}
                >
                    Analyze Another Resume
                </button>

            </div>

        </div>
    );
}

export default ResumeResult;

