import { useState, useEffect } from 'react';

export default function JobDescriptionInput({ onJDParsed }) {
    // Use structured state instead of single text block
    const [formData, setFormData] = useState({
        skills: '', // Parsing generic text still useful for pasting? User said "SEPERATE ROW TO WRITE DETAILS".
        // I will provide specific inputs.
        experience: '',
        location: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Process the structured input
        const requiredSkills = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const minExperience = parseInt(formData.experience) || 0;

        // Construct the "parsed" object expected by parent
        const extracted = {
            requiredSkills,
            minExperience,
            location: formData.location.trim(),
            salaryMax: 0, // Not exposing salary input in JD as mostly recruiter filter
            rawText: `Structured Input`
        };

        onJDParsed(extracted);
    };

    return (
        <div className="input-group animate-slide-in-left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-light)' }}>Required Skills <span style={{ opacity: 0.6 }}>(Comma separated)</span></label>
                    <textarea
                        name="skills"
                        className="input"
                        rows="2"
                        placeholder="e.g. React, Node.js, AWS"
                        value={formData.skills}
                        onChange={handleChange}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Min Experience (Years)</label>
                        <input
                            name="experience"
                            type="number"
                            className="input"
                            placeholder="e.g. 3"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                        <input
                            name="location"
                            type="text"
                            className="input"
                            placeholder="e.g. Remote"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>



                <button
                    className="btn pulse-on-hover"
                    style={{ marginTop: '0.5rem', width: '100%' }}
                    onClick={handleSubmit}
                >
                    Fetch Candidates
                </button>
            </div>
        </div>
    );
}
