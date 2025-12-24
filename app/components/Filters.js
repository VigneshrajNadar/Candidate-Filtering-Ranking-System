export default function Filters({ filters, setFilters }) {

    const addSkill = (e) => {
        if (e.key === 'Enter' && e.target.value) {
            setFilters({
                ...filters,
                skills: [...(filters.skills || []), e.target.value.trim()]
            });
            e.target.value = '';
        }
    };

    const removeSkill = (index) => {
        const newSkills = [...(filters.skills || [])];
        newSkills.splice(index, 1);
        setFilters({ ...filters, skills: newSkills });
    };

    return (
        <div className="filters-container animate-fade-in">
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--primary-light)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                Refine & Rank
            </h3>

            {/* Preferred Skills - Prominent & Mandatory */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600', color: '#60a5fa' }}>
                    ★ Preferred Skills <span style={{ color: '#ef4444', marginLeft: '0.5rem', fontSize: '0.8em' }}>(Required)</span>
                </label>

                {/* Re-using the same 'skills' array in filters for now as 'Preferred' because the API uses filters.skills as a HARD filter or we need to separate them? 
                    Wait, the API uses `filters.skills` as "Required Skills Hard Filter". 
                    But the user wants "Preferred Skills". 
                    Structure in `page.js` state: 
                    `filters` has `skills`. 
                    `jobDescription` has `preferredSkills`.
                    
                    The user wants to add Preferred Skills *after* fetching.
                    So we should map this input to `setFilters` but maybe a new field or reuse?
                    
                    If I use `filters.skills`, the API currently treats it as "Required Skills Hard Filter".
                    If I want them to be "Preferred", I should probably pass them as `preferredSkills` in the filter object 
                    and have the API or Frontend treat them as such.
                    
                    Actually, let's look at `rank-candidates.js`.
                    `jobRequirements.preferredSkills` are used for SCORING (+10).
                    `filters.skills` are used for HARD FILTERING (must have).
                    
                    The user said "Preferred Skill Not Optional".
                    Usually "Preferred" means "Nice to have" (Scoring).
                    "Required" means "Must have".
                    
                    If the user wants to ADD Preferred Skills after fetching, we should update the `jobRequirements.preferredSkills` 
                    OR send them as a separate list.
                    
                    Let's ensure `Filters` can update `preferredSkills`.
                    But `Filters` component takes `filters` state. 
                    I should add `preferredSkills` to the `filters` state in `page.js`.
                    And in `page.js` when calling API, I should merge `filters.preferredSkills` into `jobDescription.preferredSkills` 
                    OR separate them.
                    
                    Let's assume `filters` object now holds `preferredSkills`.
                 */}
                <input
                    type="text"
                    className="input"
                    style={{ marginTop: '0.5rem', borderColor: 'rgba(96, 165, 250, 0.3)', width: '100%' }}
                    placeholder="e.g. Docker, AWS (comma separated) - Press Enter to Add"
                    // We need to handle "Enter" to add to a LIST if user wants chips, 
                    // OR just use comma separated string. User said "AFTER ENTERS IT SHOULD VISIBLE BELOW ROW".
                    // So they expect chip behavior for Preferred Skills too.
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                            // Add to preferredSkills string as comma separated? 
                            // Or better, change preferredSkills to Array in state?
                            // Current state `preferredSkills` is STRING in page.js.
                            // Let's parse/join or just allow text. 
                            // User wants chips. So let's implement chips for preferredSkills.
                            // But page.js expects a comma-separated string or handle array?
                            // page.js: `filters.preferredSkills` is string.
                            // Let's treat it as a string but visualize as chips?
                            // Easier: Append to string with comma.
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val) {
                                const current = filters.preferredSkills ? filters.preferredSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
                                if (!current.includes(val)) {
                                    const newVal = [...current, val].join(', ');
                                    setFilters({ ...filters, preferredSkills: newVal });
                                }
                                e.target.value = '';
                            }
                        }
                    }}
                />
                {/* Visualizing Chips for Preferred Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', width: '100%' }}>
                    {filters.preferredSkills && filters.preferredSkills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                        <span key={i} style={{
                            background: 'rgba(96, 165, 250, 0.1)',
                            color: '#60a5fa',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px', // More modern pill shape
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '1px solid rgba(96, 165, 250, 0.2)',
                            boxShadow: '0 2px 10px rgba(96, 165, 250, 0.1)',
                            backdropFilter: 'blur(5px)'
                        }}>
                            {skill}
                            <button
                                onClick={() => {
                                    const current = filters.preferredSkills.split(',').map(s => s.trim()).filter(Boolean);
                                    current.splice(i, 1);
                                    setFilters({ ...filters, preferredSkills: current.join(', ') });
                                }}
                                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}
                            >
                                <span style={{ position: 'relative', top: '-1px' }}>&times;</span>
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Recruiter Filters</h4>

            <div style={{ marginBottom: '1rem' }}>
                <label>Minimum Experience (Years)</label>
                <input
                    type="number"
                    className="input"
                    value={filters.minExperience || ''}
                    onChange={(e) => setFilters({ ...filters, minExperience: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 2"
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>Location (Required)</label>
                <input
                    type="text"
                    className="input"
                    value={filters.location || ''}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="e.g. New York or Remote"
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>Max Salary Budget</label>
                <input
                    type="number"
                    className="input"
                    value={filters.salaryMax || ''}
                    onChange={(e) => setFilters({ ...filters, salaryMax: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 150000"
                />
            </div>

            {/* Removed the old "Required Skills (Hard Filter)" input from here to avoid confusion, 
                or rename it to "Mandatory Filter". 
                Let's keep it but rename it. matches `filters.skills`
            */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f87171' }}>Exclusion Filter (Must Have)</label>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Strictly exclude candidates missing these.
                </div>
                <input
                    type="text"
                    className="input"
                    placeholder="Type skill & Press Enter"
                    onKeyDown={addSkill}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {filters.skills?.map((skill, i) => (
                        <span key={i} style={{
                            background: 'rgba(248, 113, 113, 0.1)',
                            color: '#f87171',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '1px solid rgba(248, 113, 113, 0.2)'
                        }}>
                            {skill}
                            <button
                                onClick={() => removeSkill(i)}
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem', padding: 0, lineHeight: 0.5 }}
                            >&times;</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
