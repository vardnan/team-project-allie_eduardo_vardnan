import React, { useEffect } from 'react';
import ActivityFeed from './ActivityFeed';

function Home() {
  useEffect(() => {
    document.title = 'Pennstagram';
  }, []);

  return (
    <div className="home-container" data-testid="home-container" style={{ marginLeft: '160px' }}>
      <ActivityFeed data-testid="activity-feed" />
    </div>
  );
}

export default Home;
