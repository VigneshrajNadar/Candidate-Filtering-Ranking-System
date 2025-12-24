'use client';
import { useState, useEffect } from 'react';
import Card from './components/Card';
import JobDescriptionInput from './components/JobDescriptionInput';
import Filters from './components/Filters';
import CandidateList from './components/CandidateList';
import { MOCK_CANDIDATES } from './data/candidates';

export default function Home() {
  const [jobDescription, setJobDescription] = useState(null);
  const [filters, setFilters] = useState({
    minExperience: 0,
    location: '',
    skills: [],
    salaryMax: 0,
    preferredSkills: '' // Added for separate input in Filters
  });

  const [candidates, setCandidates] = useState(MOCK_CANDIDATES); // Start with mock data
  const [rankedResults, setRankedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleJDParsed = (extractedData) => {
    setJobDescription(extractedData);
    // Be helpful: suggested filters based on JD
    if (extractedData.minExperience && filters.minExperience === 0) {
      setFilters(prev => ({ ...prev, minExperience: extractedData.minExperience }));
    }
    // Now automatically Trigger Fetch since the button was "Fetch Candidates" in the component
    // We need to wait for state update? `jobDescription` won't be set yet in this closure.
    // So we pass extractedData directly.
    triggerFetch(extractedData);
  };

  const triggerFetch = async (jd) => {
    setLoading(true);
    setHasSearched(false);
    try {
      // Initial Fetch: Just basic requirements, no filters yet
      const payload = {
        jobDescription: jd,
        filters: {}, // Empty filters for initial fetch
        candidates: candidates
      };

      const res = await fetch('/api/rank-candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        setRankedResults(data.candidates);
        setHasSearched(true);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };



  // Step 1: Fetch Candidates based on JD
  const fetchCandidates = async () => {
    if (!jobDescription) {
      alert("Please enter Job Description first.");
      return;
    }
    setLoading(true);
    setHasSearched(false); // Reset to ensure we show loading or clear old results

    // In a real app, we would fetch from DB here based on JD.
    // For now, we simulate "Fetching" by just setting the mock candidates as the pool.
    // We can just proceed to rank them with "Basic" requirements.
    await processRanking(true); // isInitialFetch = true
  };

  // Step 2: Refine / Filter / Rank
  const processRanking = async (isInitialFetch = false) => {
    if (!jobDescription) return;

    setLoading(true);
    try {
      // Merge "Preferred Skills" from Filters into the Job Description for the API
      // The API expects `jobDescription.preferredSkills` (array)
      let finalPreferred = jobDescription.preferredSkills || [];

      // If NOT initial fetch (i.e. we are Refining), add the ones from Filter input
      if (!isInitialFetch && filters.preferredSkills) {
        const userPreferred = filters.preferredSkills.split(',').map(s => s.trim()).filter(Boolean);
        // Combine carefully (avoid duplicates if needed, or just append)
        // Actually, since we removed it from Initial Input, `jobDescription.preferredSkills` might be empty now.
        finalPreferred = userPreferred;
      }

      const payload = {
        jobDescription: {
          ...jobDescription,
          preferredSkills: finalPreferred
        },
        filters: filters,
        candidates: candidates
      };

      const res = await fetch('/api/rank-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setRankedResults(data.candidates);
        setHasSearched(true);
      } else {
        alert("Error ranking candidates: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to trigger visual feedback on high match
  useEffect(() => {
    if (rankedResults.length > 0 && rankedResults[0].score > 0.9) {
      // Placeholder for success effect
    }
  }, [rankedResults]);

  return (
    <div className="container">
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="animate-float-1" style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div className="animate-float-2" style={{ position: 'absolute', top: '40%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div className="animate-float-3" style={{ position: 'absolute', bottom: '10%', left: '30%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
      </div>

      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem 0',
        position: 'relative',
        zIndex: 2,
        background: 'radial-gradient(circle at center, rgba(123, 44, 191, 0.15) 0%, transparent 70%)'
      }}>
        <h1 className="animate-gradient-text" style={{
          fontSize: '3.5rem',
          background: 'linear-gradient(to right, #fff, #a78bfa, #2dd4bf, #fff)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 1rem 0',
          fontWeight: '800',
          letterSpacing: '-1px',
          filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.3))'
        }}>
          RecruitAI
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Intelligent Candidate Filtering & Ranking System
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

        {/* Left Column: Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <Card title="Job Description & Filters">
            <JobDescriptionInput onJDParsed={handleJDParsed} />

            {/* Show Criteria Summary if parsed */}
            {jobDescription && (
              <div style={{ marginTop: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,255,0,0.05)', borderRadius: '8px', border: '1px solid rgba(0,255,0,0.2)' }}>
                <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '0.5rem' }}>✓ Criteria Set:</div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <li>Skills: {jobDescription.requiredSkills.join(', ') || 'None'}</li>
                  <li>Min Exp: {jobDescription.minExperience} years</li>
                  <li>Location: {jobDescription.location || 'Any'}</li>
                </ul>
              </div>
            )}

            {/* Separator */}
            <div style={{ margin: '1.5rem 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }}></div>

            {/* Merged Filters Section */}
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-light)', marginBottom: '1rem' }}>Refine Results</h3>
            <Filters filters={filters} setFilters={setFilters} />

            <button
              className="btn"
              style={{
                padding: '1rem',
                fontSize: '1.2rem',
                width: '100%',
                marginTop: '1.5rem',
                background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                boxShadow: '0 0 20px rgba(96, 165, 250, 0.4)',
                opacity: hasSearched ? 1 : 0.8,
                cursor: 'pointer'
              }}
              onClick={() => processRanking(false)}
              disabled={loading} // Allow clicking even before initial fetch if user wants to set filters first?
            >
              {loading ? 'Updating...' : 'Filter & Re-Rank ⚡'}
            </button>
          </Card>

          {/* Initial Fetch Button (Only process current JD) - Hidden if scraped? No, logic says "Fetch Candidates" from JD input uses onJDParsed 
              Wait, JobDescriptionInput calls `onJDParsed`. 
              We should probably trigger the fetch automatically or provide a button?
              The `JobDescriptionInput` has a button "Fetch Candidates".
              It calls `handleSubmit` -> `onJDParsed`.
          */}
          {/* We modify handleJDParsed check. */}
        </div>

        {/* Right Column: Results */}
        <div>
          {hasSearched ? (
            <>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Top Matches</span>
                <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                  {rankedResults.length} candidates found
                </span>
              </h2>
              <CandidateList candidates={rankedResults} loading={loading} jobRequirements={{
                ...jobDescription,
                // Ensure visualizer sees the NEW preferred skills
                preferredSkills: filters.preferredSkills ? filters.preferredSkills.split(',').map(s => s.trim()).filter(Boolean) : []
              }} />
            </>
          ) : (
            <div style={{
              height: '100%',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius)',
              padding: '4rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>📋</div>
              <h3>Ready to Rank</h3>
              <p>Fill in the job details and define filters to find the best candidates from the database.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
