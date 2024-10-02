import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockData = {
  farm1: {
    flockAnalysis: [
      { name: 'Week 1', healthy: 95, sick: 3, deceased: 2 },
      { name: 'Week 2', healthy: 93, sick: 5, deceased: 2 },
      { name: 'Week 3', healthy: 90, sick: 7, deceased: 3 },
      { name: 'Week 4', healthy: 88, sick: 8, deceased: 4 },
    ],
    consumptionAnalysis: [
      { name: 'Week 1', water: 100, feed: 50 },
      { name: 'Week 2', water: 120, feed: 70 },
      { name: 'Week 3', water: 140, feed: 90 },
      { name: 'Week 4', water: 160, feed: 110 },
    ],
    weightAnalysis: [
      { name: 'Week 1', weight: 0.2 },
      { name: 'Week 2', weight: 0.5 },
      { name: 'Week 3', weight: 0.9 },
      { name: 'Week 4', weight: 1.4 },
    ],
    fcrAnalysis: [
      { name: 'Week 1', fcr: 1.1 },
      { name: 'Week 2', fcr: 1.3 },
      { name: 'Week 3', fcr: 1.5 },
      { name: 'Week 4', fcr: 1.7 },
    ],
  },
  farm2: {
    flockAnalysis: [
      { name: 'Week 1', healthy: 97, sick: 2, deceased: 1 },
      { name: 'Week 2', healthy: 95, sick: 3, deceased: 2 },
      { name: 'Week 3', healthy: 92, sick: 5, deceased: 3 },
      { name: 'Week 4', healthy: 90, sick: 7, deceased: 3 },
    ],
    consumptionAnalysis: [
      { name: 'Week 1', water: 110, feed: 55 },
      { name: 'Week 2', water: 130, feed: 75 },
      { name: 'Week 3', water: 150, feed: 95 },
      { name: 'Week 4', water: 170, feed: 115 },
    ],
    weightAnalysis: [
      { name: 'Week 1', weight: 0.22 },
      { name: 'Week 2', weight: 0.55 },
      { name: 'Week 3', weight: 0.95 },
      { name: 'Week 4', weight: 1.5 },
    ],
    fcrAnalysis: [
      { name: 'Week 1', fcr: 1.0 },
      { name: 'Week 2', fcr: 1.2 },
      { name: 'Week 3', fcr: 1.4 },
      { name: 'Week 4', fcr: 1.6 },
    ],
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [selectedFarm, setSelectedFarm] = useState('farm1');

  const data = mockData[selectedFarm];

  return (
    <Container fluid className="p-4 sm:p-0">
      <Form.Group className="mb-4">
        <Form.Select
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="farm1">Farm 1</option>
          <option value="farm2">Farm 2</option>
        </Form.Select>
      </Form.Group>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title>Flock Analysis</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.flockAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="healthy"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="sick"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="deceased"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title>Consumption Analysis</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.consumptionAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="water" fill="#8884d8" />
                  <Bar dataKey="feed" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title>Weight Analysis</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.weightAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <Card.Title>FCR Analysis</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.fcrAnalysis}
                    dataKey="fcr"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {data.fcrAnalysis.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
