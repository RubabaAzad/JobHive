<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CvController extends Controller
{
    public function generate(Request $request)
    {
      set_time_limit(300); // Extend timeout for long operations
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'skills' => 'required|string',
            'experience' => 'required|string',
            'education' => 'required|string',
            'prompt' => 'nullable|string',
        ]);
        $enhancedData = $this->generateWithOllama($request->prompt ?? '', $request->all());

        // Create professional CV HTML with AI enhancements
        $html = $this->createCvHtml([
            'name' => $request->name,
            'email' => $request->email,
            'skills' => $request->skills,
            'experience' => $request->experience,
            'education' => $request->education,
            'enhanced_data' => $enhancedData,
        ]);

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');
        
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="cv.pdf"',
        ]);
    }

    private function generateWithOllama($prompt, $userData)
    {
        try {
            $basePrompt = $prompt ?: "Enhance this CV by improving the descriptions, adding relevant keywords, and creating a professional summary. Make the content more impactful and ATS-friendly.";
            
            $systemPrompt = "You are a professional CV writer and career consultant. Your task is to enhance CV content to make it more professional, impactful, and ATS-friendly. Always provide structured HTML content that can be seamlessly integrated into a CV layout.";
            
            $userPrompt = "Here's the CV information to enhance:
            Name: {$userData['name']}
            Email: {$userData['email']}
            Skills: {$userData['skills']}
            Experience: {$userData['experience']}
            Education: {$userData['education']}
            
            Enhancement request: {$basePrompt}
            
            Please provide enhanced CV content in the following structure:
            1. A compelling professional summary (2-3 sentences)
            2. Enhanced skills section with categorization if applicable
            3. Improved experience descriptions with quantifiable achievements
            4. Enhanced education section
            5. Any additional relevant sections based on the request
            
            Format everything as clean HTML with proper headings (h2, h3) and paragraphs. Do not include <html>, <body>, or <head> tags.";

            Log::info('Sending request to Ollama API');

            $response = Http::timeout(300)->post('http://localhost:11434/api/generate', [
                'model' => 'llama3.2:3b',
                'prompt' => $systemPrompt . "\n\n" . $userPrompt,
                'stream' => false,
                'options' => [
                    'temperature' => 0.7,
                    'top_p' => 0.9,
                ]
            ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Ollama response received');
                return $result['response'] ?? '';
            } else {
                Log::error('Ollama API failed with status: ' . $response->status());
            }
        } catch (\Exception $e) {
            Log::error('Ollama API error: ' . $e->getMessage());
        }

        // Fallback enhancement if Ollama fails
        return $this->getFallbackEnhancement($userData);
    }

    private function getFallbackEnhancement($userData)
    {
        return "
        <h2>Professional Summary</h2>
        <p>Experienced professional with expertise in {$userData['skills']} and a strong background in delivering results. Proven track record of success with excellent communication and problem-solving abilities.</p>
        
        <h2>Key Strengths</h2>
        <ul>
            <li>Strong technical and analytical skills</li>
            <li>Excellent team collaboration and leadership</li>
            <li>Results-driven approach to problem-solving</li>
            <li>Continuous learning and professional development</li>
        </ul>";
    }

    private function createCvHtml($data)
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.5;
                    color: #333;
                    max-width: 210mm;
                    margin: 0 auto;
                    padding: 15mm;
                    background: #fff;
                    font-size: 11pt;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #2c3e50;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .name {
                    font-size: 24pt;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 0 0 8px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .email {
                    font-size: 12pt;
                    color: #7f8c8d;
                    margin: 0;
                }
                .section {
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }
                .section-title {
                    font-size: 14pt;
                    font-weight: bold;
                    color: #2c3e50;
                    border-left: 3px solid #3498db;
                    padding-left: 12px;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .section-content {
                    margin-left: 15px;
                    line-height: 1.6;
                }
                .enhanced-content {
                    margin-top: 15px;
                }
                .enhanced-content h2 {
                    font-size: 13pt;
                    font-weight: bold;
                    color: #2c3e50;
                    border-left: 3px solid #e74c3c;
                    padding-left: 12px;
                    margin: 15px 0 8px 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .enhanced-content h3 {
                    font-size: 12pt;
                    font-weight: bold;
                    color: #34495e;
                    margin: 12px 0 6px 0;
                }
                .enhanced-content p {
                    margin: 6px 0;
                    text-align: justify;
                }
                .enhanced-content ul {
                    margin: 6px 0;
                    padding-left: 20px;
                }
                .enhanced-content li {
                    margin: 3px 0;
                }
                .skills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 6px;
                    margin-top: 8px;
                }
                .skill-item {
                    background: #ecf0f1;
                    padding: 4px 8px;
                    border-radius: 3px;
                    font-size: 10pt;
                    text-align: center;
                }
                @page {
                    margin: 15mm;
                    size: A4;
                }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1 class='name'>{$data['name']}</h1>
                <p class='email'>{$data['email']}</p>
            </div>

            " . ($data['enhanced_data'] ? "
            <div class='enhanced-content'>
                {$data['enhanced_data']}
            </div>
            " : "") . "

            <div class='section'>
                <h2 class='section-title'>Technical Skills</h2>
                <div class='section-content'>
                    <div class='skills-grid'>
                        " . $this->formatSkills($data['skills']) . "
                    </div>
                </div>
            </div>

            <div class='section'>
                <h2 class='section-title'>Professional Experience</h2>
                <div class='section-content'>
                    " . nl2br(htmlspecialchars($data['experience'])) . "
                </div>
            </div>

            <div class='section'>
                <h2 class='section-title'>Education</h2>
                <div class='section-content'>
                    " . nl2br(htmlspecialchars($data['education'])) . "
                </div>
            </div>
        </body>
        </html>";
    }

    private function formatSkills($skills)
    {
        $skillsArray = array_map('trim', explode(',', $skills));
        $formatted = '';
        
        foreach ($skillsArray as $skill) {
            if (!empty($skill)) {
                $formatted .= "<div class='skill-item'>{$skill}</div>";
            }
        }
        
        return $formatted ?: "<div class='skill-item'>{$skills}</div>";
    }
}