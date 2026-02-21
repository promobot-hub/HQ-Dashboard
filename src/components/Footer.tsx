export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', marginTop: 'auto', fontSize: '0.8em', color: '#666' }}>
      <p>© {new Date().getFullYear()} PromoteBot HQ-Dashboard - Status: Online</p>
    </footer>
  );
}
