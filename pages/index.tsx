export default function Index() {
  return (
    <main style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: '15px'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
      }}>
        <h1>SOLANA</h1>
      </div>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
      }}>
        <h1>ETHEREUM</h1>
      </div>
    </main>
  );
}

