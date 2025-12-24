const FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];
const ROLES = ["Frontend Engineer", "Backend Engineer", "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Product Designer", "Mobile Developer", "QA Engineer", "System Architect", "Cloud Engineer"];
const SKILLS_POOL = [
    "React", "Node.js", "Python", "Java", "Docker", "Kubernetes", "AWS", "TypeScript", "Next.js", "GraphQL",
    "MongoDB", "PostgreSQL", "Redis", "Terraform", "Go", "Rust", "C++", "C#", "Figma", "UI/UX",
    "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "R", "Swift", "Kotlin", "Flutter",
    "Jenkins", "CircleCI", "Git", "Linux", "Bash", "Ansible", "Vue.js", "Angular", "Svelte"
];
const LOCATIONS = ["New York, NY", "San Francisco, CA", "Remote", "Austin, TX", "London, UK", "Berlin, DE", "Toronto, CA", "Bangalore, IN", "Sydney, AU", "Seattle, WA", "Chicago, IL", "Los Angeles, CA"];

function generateCandidates(count) {
    const candidates = [];
    for (let i = 0; i < count; i++) {
        // Random Selection Helpers
        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Generate Skills (3 to 8 random skills)
        const numSkills = randInt(3, 8);
        const shuffledSkills = [...SKILLS_POOL].sort(() => 0.5 - Math.random());
        const candidateSkills = shuffledSkills.slice(0, numSkills);

        candidates.push({
            id: 1000 + i,
            name: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
            role: rand(ROLES),
            skills: candidateSkills,
            experience: randInt(1, 15),
            location: rand(LOCATIONS),
            salaryExpectation: randInt(60, 200) * 1000,
            avatar: `https://i.pravatar.cc/150?u=${1000 + i}`
        });
    }
    return candidates;
}

// Generate 1200 candidates
export const MOCK_CANDIDATES = generateCandidates(1200);
