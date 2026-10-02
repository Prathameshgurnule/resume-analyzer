import { useLocation } from "react-router-dom";

function Result() {

    const location = useLocation();
    const data = location.state;

    if (!data) {
        return (
            <div className="container mt-4">
                <h3>No Result Found</h3>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2>Resume Analysis Result</h2>

            <div className="card p-3">

                <h5>Match Score</h5>
                <p>{data.matchScore}%</p>

                <h5>Matched Keywords</h5>
                <p>{data.matchedKeywords}</p>

                <h5>Missing Keywords</h5>
                <p>{data.missingKeywords}</p>

                <h5>AI Suggestions</h5>
                <p>{data.aiSuggestions}</p>

            </div>

        </div>
    );
}

export default Result;