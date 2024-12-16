import React, { useState, useEffect } from 'react';
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

// Updated color palette - more eye-pleasing colors
const COLORS = ['#60a5fa', '#34d399', '#f472b6', '#a78bfa'];

const AdminDashboard = () => {
  const [flockList, setFlockList] = useState([]);
  const [selectedFlock, setSelectedFlock] = useState('');
  const [flockDetails, setFlockDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken');

  // Fetch flock list
  useEffect(() => {
    const fetchFlockList = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8800/flock/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFlockList(data);
        if (data.length > 0) {
          setSelectedFlock(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching flock list:', error);
        setError('Failed to fetch flock list');
      } finally {
        setLoading(false);
      }
    };

    fetchFlockList();
  }, []);

  // Fetch flock details
  useEffect(() => {
    const fetchFlockDetails = async () => {
      if (!selectedFlock) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8800/flock-details/getanalysis/${selectedFlock}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFlockDetails(data);
      } catch (error) {
        console.error('Error fetching flock details:', error);
        setError('Failed to fetch flock details');
        setFlockDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlockDetails();
  }, [selectedFlock]);

  const prepareChartData = (analysisData) => {
    if (!analysisData) return [];

    // Create a map of existing data points
    const dataMap = new Map(analysisData.map((item) => [item.age_days, item]));

    // Generate data for all weeks, filling in zeros for missing data
    return Array.from({ length: 8 }, (_, index) => {
      const weekNum = index + 1;
      const ageInDays = weekNum * 7;
      const existingData = dataMap.get(ageInDays) || {};

      return {
        name: `Week ${weekNum}`,
        fcr: existingData.generated_fcr || 0,
        weight: existingData.avg_weight || 0,
        feed: existingData.total_feed_consumption || 0,
      };
    });
  };

  const prepareFlockAnalysisData = (analysisData, mortalityData) => {
    if (!analysisData || !mortalityData) return [];

    const { total_birds, total_deceased } = mortalityData;

    return Array.from({ length: 8 }, (_, index) => {
      const weekNum = index + 1;
      const weekRatio = (weekNum * 7) / 56;
      const deceased = Math.round(total_deceased * weekRatio);

      return {
        name: `Week ${weekNum}`,
        healthy: total_birds - deceased,
        deceased: deceased,
      };
    });
  };

  const filteredFlockList = flockList.filter((flock) =>
    flock.flock_id.toUpperCase().includes(searchTerm.toUpperCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="max-w-xl">
            <input
              type="text"
              placeholder="Search Flock ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={selectedFlock}
              onChange={(e) => setSelectedFlock(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {filteredFlockList.map((flock) => (
                <option key={flock.id} value={flock.id}>
                  {flock.flock_id.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {flockDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flock Analysis Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h5 className="text-lg font-semibold">Flock Analysis</h5>
              </div>
              <div className="p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prepareFlockAnalysisData(
                        flockDetails.analysis,
                        flockDetails.mortality
                      )}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="healthy"
                        stackId="1"
                        stroke={COLORS[0]}
                        fill={COLORS[0]}
                        name="Healthy Birds"
                      />
                      <Area
                        type="monotone"
                        dataKey="deceased"
                        stackId="1"
                        stroke={COLORS[2]}
                        fill={COLORS[2]}
                        name="Deceased Birds"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Feed Consumption Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h5 className="text-lg font-semibold">Feed Consumption</h5>
              </div>
              <div className="p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData(flockDetails.analysis)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="feed"
                        fill={COLORS[1]}
                        name="Feed Consumption"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Weight Analysis Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h5 className="text-lg font-semibold">Weight Progression</h5>
              </div>
              <div className="p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData(flockDetails.analysis)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke={COLORS[2]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                        name="Average Weight"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* FCR Analysis Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h5 className="text-lg font-semibold">FCR Analysis</h5>
              </div>
              <div className="p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareChartData(flockDetails.analysis)}
                        dataKey="fcr"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {prepareChartData(flockDetails.analysis).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
