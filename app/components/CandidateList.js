export default function CandidateList({ candidates, jobRequirements, loading }) {
    if (loading) {
        return (
            <div className="results-list">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="card animate-shimmer" style={{
                        marginBottom: '1rem',
                        height: '200px',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ width: '40%', height: '20px', background: 'rgba(255,255,255,0.1)', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
                                <div style={{ width: '30%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}></div>
                            <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}></div>
                            <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    if (!candidates || candidates.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p>No candidates found matching the criteria.</p>
            </div>
        );
    }

    return (
        <div className="results-list">
            {candidates.map((candidate, index) => {
                // Calculate missing skills on the fly for display
                const candidateSkillsLower = (candidate.skills || []).map(s => s.toLowerCase());

                // We need the original Requirement list to find what's missing.
                // Passed via props or we infer from matchDetails? matchDetails only gives counts.
                // Let's rely on what we can derive or pass `jobRequirements` prop.
                // For now, let's look at `candidate.matchDetails` if we updated the API to return missing.
                // Or better, let's just color code the skills we HAVE.

                // Actually, the user explicitly asked for "Matched and missing skill".
                // To do this well, we should probably pass the 'requiredSkills' content to this component.

                const requiredSkills = jobRequirements?.requiredSkills || [];
                const preferredSkills = jobRequirements?.preferredSkills || [];

                const matchedSkills = requiredSkills.filter(req => candidateSkillsLower.includes(req.toLowerCase()));
                const missingSkills = requiredSkills.filter(req => !candidateSkillsLower.includes(req.toLowerCase()));
                const matchedPreferred = preferredSkills.filter(pref => candidateSkillsLower.includes(pref.toLowerCase()));

                return (
                    <div
                        key={candidate.id}
                        className={`card candidate-card stagger-${(index % 10) + 1} animate-slide-up`}
                        style={{
                            marginBottom: '1rem',
                            animationDelay: `${index * 0.05}s`
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: index === 0 ? '#ffd700' : 'var(--text-muted)',
                                    background: 'rgba(255,255,255,0.05)',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {index + 1}
                                </div>

                                {candidate.avatar ?
                                    <img src={candidate.avatar} alt={candidate.name} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
                                    :
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #334155, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                        👤
                                    </div>
                                }

                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.5px' }}>{candidate.name}</h3>
                                    <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {candidate.role} • {candidate.experience}y Exp • {candidate.location}
                                    </p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div className={candidate.score > 0.8 ? 'animate-shimmer' : ''} style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--secondary)',
                                    textShadow: '0 0 20px rgba(45, 212, 191, 0.5)',
                                    position: 'relative',
                                    display: 'inline-block',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '8px'
                                }}>
                                    {Math.round(candidate.score * 100)}%
                                </div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--text-muted)' }}>Match Score</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {/* Skill Match Visualization */}
                            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Skills Analysis:
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>

                                {/* Matched */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: '0.3rem', fontWeight: '600' }}>✓ MATCHED</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {matchedSkills.length > 0 ? matchedSkills.map(skill => (
                                            <span key={skill} style={{
                                                background: 'rgba(74, 222, 128, 0.15)',
                                                color: '#4ade80',
                                                border: '1px solid rgba(74, 222, 128, 0.2)',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}>
                                                {skill}
                                            </span>
                                        )) : <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>None</span>}
                                    </div>
                                </div>

                                {/* Missing */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '0.3rem', fontWeight: '600' }}>✕ MISSING REQUIRED</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {missingSkills.length > 0 ? missingSkills.map(skill => (
                                            <span key={skill} style={{
                                                background: 'rgba(248, 113, 113, 0.1)',
                                                color: '#f87171',
                                                border: '1px solid rgba(248, 113, 113, 0.2)',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}>
                                                {skill}
                                            </span>
                                        )) : <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>None</span>}
                                    </div>
                                </div>

                                {/* Preferred */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.3rem', fontWeight: '600' }}>★ PREFERRED BONUS</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {matchedPreferred.length > 0 ? matchedPreferred.map(skill => (
                                            <span key={skill} style={{
                                                background: 'rgba(96, 165, 250, 0.15)',
                                                color: '#60a5fa',
                                                border: '1px solid rgba(96, 165, 250, 0.2)',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}>
                                                {skill}
                                            </span>
                                        )) : <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>None</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
