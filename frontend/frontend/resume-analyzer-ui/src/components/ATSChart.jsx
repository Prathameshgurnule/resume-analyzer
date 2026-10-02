import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function ATSChart({ resumes }) {

    const data = {

        labels: resumes.map(
            (resume) => resume.fileName
        ),

        datasets: [
            {
                label: "ATS Score",
                data: resumes.map(
                    (resume) =>
                        resume.matchScore
                ),
                tension: 0.4
            }
        ]
    };

    return (
        <div className="card p-3 mt-4">

            <h4>
                ATS Score Analytics
            </h4>

            <Line data={data} />

        </div>
    );
}

export default ATSChart;