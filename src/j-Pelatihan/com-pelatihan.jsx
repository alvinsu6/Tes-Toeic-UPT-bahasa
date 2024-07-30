import React from 'react';
import { Card } from 'react-bootstrap';
import './pelatihan.css'; // Import the CSS file
import { useEffect } from 'react';
function Pelatihan() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'kminchelle',
            password: '0lelplR',
            // expiresInMins: 60, // optional
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Card className="custom-card">
        <Card.Body>
          <Card.Title className="card-title">Training Registration</Card.Title>
          <Card.Text className="card-text">
            <strong>Date:</strong> January 31, 2024
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Location:</strong> Virtual
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Pelatihan;
