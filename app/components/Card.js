export default function Card({ children, title, className = '' }) {
    return (
        <div className={`card ${className} animate-fade-in`}>
            {title && <h2 style={{ marginBottom: '1rem', color: 'var(--primary)', fontWeight: '600' }}>{title}</h2>}
            {children}
        </div>
    );
}
