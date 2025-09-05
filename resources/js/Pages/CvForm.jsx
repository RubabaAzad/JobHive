import { useState } from "react";

export default function CvForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        skills: "",
        experience: "",
        education: "",
        prompt: "",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const simulateProgress = () => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 500);
        return interval;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);

        const progressInterval = simulateProgress();
        console.log("Submitting form:", form);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch("/api/generate-cv", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(form),
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (response.ok) {
                // Get the PDF as a blob
                const blob = await response.blob();

                // Create a download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${form.name.replace(/\s+/g, "_")}_CV.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Failed to generate CV:", errorData);
                alert(
                    "Failed to generate CV. Please check your input and try again."
                );
            }
        } catch (error) {
            clearInterval(progressInterval);
            console.error("Error:", error);
            alert(
                "An error occurred. Please make sure Ollama is running and try again."
            );
        } finally {
            setTimeout(() => {
                setIsGenerating(false);
                setProgress(0);
            }, 1000);
        }
    };

    const promptExamples = [
        "Add a professional summary and key achievements",
        "Include technical projects and GitHub portfolio",
        "Add certifications and professional development",
        "Include volunteer work and community involvement",
        "Add language skills and international experience",
        "Include leadership experience and team management",
    ];

    const isFormValid =
        form.name &&
        form.email &&
        form.skills &&
        form.experience &&
        form.education;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    AI-Powered CV Generator
                </h1>
                <p className="text-gray-600">
                    Create a professional CV enhanced by AI in seconds
                </p>
            </div>

            {/* Loading Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mb-4">
                                <svg
                                    className="animate-spin h-12 w-12 text-blue-500 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Generating Your CV
                            </h3>
                            <p className="text-gray-600 mb-4">
                                AI is enhancing your content...
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500">
                                {Math.round(progress)}% complete
                            </p>

                            <div className="mt-4 space-y-1 text-sm text-gray-500">
                                <p
                                    className={
                                        progress > 20 ? "text-green-500" : ""
                                    }
                                >
                                    ✓ Processing your information
                                </p>
                                <p
                                    className={
                                        progress > 50 ? "text-green-500" : ""
                                    }
                                >
                                    {progress > 50 ? "✓" : "○"} Enhancing
                                    content with AI
                                </p>
                                <p
                                    className={
                                        progress > 80 ? "text-green-500" : ""
                                    }
                                >
                                    {progress > 80 ? "✓" : "○"} Generating PDF
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="mr-2">📋</span>
                        Basic Information
                    </h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name *
                        </label>
                        <input
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Address *
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Skills *
                        </label>
                        <textarea
                            name="skills"
                            placeholder="JavaScript, React, Node.js, Python, SQL, Docker..."
                            value={form.skills}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate skills with commas
                        </p>
                    </div>
                </div>

                {/* Experience & Education */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="mr-2">💼</span>
                        Background
                    </h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Professional Experience *
                        </label>
                        <textarea
                            name="experience"
                            placeholder="Software Developer at XYZ Company (2020-2024)&#10;- Developed web applications using React and Node.js&#10;- Led a team of 3 developers&#10;- Increased application performance by 40%"
                            value={form.experience}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="5"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Education *
                        </label>
                        <textarea
                            name="education"
                            placeholder="Bachelor of Computer Science&#10;University of Technology (2016-2020)&#10;GPA: 3.8/4.0, Dean's List"
                            value={form.education}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* AI Enhancement Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">🤖</span>
                    AI Enhancement
                </h2>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Custom Enhancement Prompt (Optional)
                    </label>
                    <textarea
                        name="prompt"
                        placeholder="e.g., 'Focus on my leadership skills and add a projects section' or 'Emphasize my technical expertise and include certifications' or leave empty for general enhancement"
                        value={form.prompt}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        AI will always enhance your CV. Add specific
                        instructions here for customized improvements.
                    </p>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Quick prompts:</p>
                    <div className="flex flex-wrap gap-2">
                        {promptExamples.map((example, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() =>
                                    setForm({ ...form, prompt: example })
                                }
                                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={isGenerating || !isFormValid}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105 disabled:transform-none"
                >
                    {isGenerating ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Generating AI-Enhanced CV...
                        </span>
                    ) : (
                        "🚀 Generate AI-Enhanced CV"
                    )}
                </button>

                {!isFormValid && (
                    <p className="text-red-500 text-sm mt-2">
                        Please fill in all required fields
                    </p>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>✨ AI Enhancement:</strong> Your CV will always be
                    enhanced by AI to make it more professional, ATS-friendly,
                    and impactful. The process may take 30-60 seconds depending
                    on the complexity.
                </p>
            </div>
        </div>
    );
}
