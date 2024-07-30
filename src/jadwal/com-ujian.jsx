import React from 'react';
import { Card } from 'react-bootstrap';
import './ujian.css'; // Import file CSS

function Ujian() {
  return (
    <div>
      <Card className="custom-card">
        <Card.Body>
          <Card.Title className="card-title">Jadwal Ujian</Card.Title>
          <Card.Text className="card-text">
            <strong>Tanggal:</strong> 15 Maret 2024
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Waktu:</strong> 10:00 WIB - 12:00 WIB
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Lokasi:</strong> Ruang Ujian A
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Instruksi:</strong> Harap datang 30 menit sebelum ujian dimulai. Bawa identitas diri yang valid dan
            perlengkapan ujian yang diperlukan.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Ujian;
