import React, { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #ccc',
      margin: '20px 0',
    },
    th: {
      backgroundColor: '#f2f2f2',
      border: '1px solid #ccc',
      padding: '8px',
      textAlign: 'left',
    },
    tr: {
      border: '1px solid #ccc',
    },
    td: {
      padding: '8px',
      textAlign: 'left',
    },
  };
  
  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await fetch('http://localhost:3001/leaderboard'); // Use fetch
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLeaderboardData(data);
        } else {
          console.error('Failed to fetch leaderboard data');
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchLeaderboardData();
  }, []); // Empty dependency array

  return (
    <div>
      <h1>Leaderboard</h1>
      <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Name</th>
      <th style={styles.th}>Value</th>
    </tr>
  </thead>
  <tbody>
    {leaderboardData.map((entry, index) => (
      <tr key={index} style={styles.tr}>
        <td style={styles.td}>{entry.name}</td>
        <td style={styles.td}>{entry.value}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default Leaderboard;
