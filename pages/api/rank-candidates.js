export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { jobDescription, filters, candidates } = req.body;

        if (!jobDescription || !candidates || !Array.isArray(candidates)) {
            return res.status(400).json({ message: 'Invalid input. Missing JD or Candidates array.' });
        }

        // --- 1. Parsing & Extraction ---
        const requiredSkills = jobDescription.requiredSkills || [];
        const preferredSkills = jobDescription.preferredSkills || [];
        const minExperience = jobDescription.minExperience || 0;

        // --- 2. Filtering ---
        // --- 2. Filtering ---
        const filteredCandidates = candidates.filter(candidate => {
            // Hard Filter: Min Experience
            // Use Filter value if set (primary), otherwise fall back to JD requirement
            const effectiveMinExp = (filters?.minExperience !== undefined && filters?.minExperience !== null)
                ? filters.minExperience
                : minExperience;

            if ((candidate.experience || 0) < effectiveMinExp) return false;

            // Hard Filter: Location
            // Use Filter value if set
            const requiredLoc = filters?.location || (jobDescription.location !== 'Any' ? jobDescription.location : '');

            if (requiredLoc && candidate.location) {
                if (!candidate.location.toLowerCase().includes(requiredLoc.toLowerCase())) {
                    return false;
                }
            }

            // Hard Filter: Salary
            // Ensure both are treated as numbers
            if (filters?.salaryMax && candidate.salaryExpectation) {
                const budget = Number(filters.salaryMax);
                const expectation = Number(candidate.salaryExpectation);
                // If candidate expects MORE than budget, exclude them.
                if (!isNaN(budget) && !isNaN(expectation) && expectation > budget) {
                    return false;
                }
            }

            // Required Skills Hard Filter (if requested via filters "Skills" input specifically)
            // Note: The main JD skills are used for SCORING, not hard filtering usually, 
            // unless added to the "Recruiter Filters" list.
            if (filters?.skills && filters.skills.length > 0) {
                const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
                const hasAllFilteredSkills = filters.skills.every(skill => candidateSkills.includes(skill.toLowerCase()));
                if (!hasAllFilteredSkills) return false;
            }

            return true;
        });

        // --- 3. Scoring ---
        const scoredCandidates = filteredCandidates.map(candidate => {
            let score = 0;
            const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());

            // A. Required Skills (High Weight: 25 points per skill) (Was 10)
            // Boosting this ensures that matching skills > > years of experience.
            let matchedRequired = 0;
            requiredSkills.forEach(skill => {
                if (candidateSkills.includes(skill.toLowerCase())) {
                    score += 25;
                    matchedRequired++;
                }
            });

            // B. Preferred Skills (Medium Weight: 10 points per skill) (Was 5)
            let matchedPreferred = 0;
            preferredSkills.forEach(skill => {
                if (candidateSkills.includes(skill.toLowerCase())) {
                    score += 10;
                    matchedPreferred++;
                }
            });

            // C. Experience Match (Weight: 3 points per year) (Was 2)
            // But let's cap the experience bonus so 20 years doesn't beat 1 skill.
            // Max bonus for experience = 30 points (10 years).
            const rawExpScore = (candidate.experience || 0) * 3;
            score += Math.min(rawExpScore, 30);

            return {
                ...candidate,
                rawScore: score,
                matchDetails: {
                    matchedRequired,
                    totalRequired: requiredSkills.length,
                    matchedPreferred,
                    totalPreferred: preferredSkills.length,
                    experience: candidate.experience
                }
            };
        });

        // --- 4. Ranking & Normalization ---
        const highestScore = Math.max(...scoredCandidates.map(c => c.rawScore), 1);

        const ranked = scoredCandidates.map(c => ({
            ...c,
            score: parseFloat((c.rawScore / highestScore).toFixed(2))
        })).sort((a, b) => b.score - a.score);

        return res.status(200).json({
            candidates: ranked,
            meta: {
                totalProcessed: candidates.length,
                filteredCount: filteredCandidates.length
            }
        });

    } catch (error) {
        console.error('Ranking Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
