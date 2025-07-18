import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/axios";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", points: "" });
  const [loading, setLoading] = useState(false);
  const [claimingUserId, setClaimingUserId] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/all");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.points) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.points <= 0) {
      toast.error("Points must be a positive number");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/users/add", {
        name: formData.name.trim(),
        points: parseInt(formData.points),
      });

      if (response.data.success) {
        setFormData({ name: "", points: "" });
        fetchUsers(); // Refresh the leaderboard
        toast.success("User added successfully!");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
    setLoading(false);
  };

  const handleClaimPoints = async (userId) => {
    setClaimingUserId(userId);
    try {
      const response = await api.post(`/claims/claim-points?to=${userId}`);

      if (response.data.success) {
        fetchUsers(); // Refresh the leaderboard to show updated points
        toast.success(
          `Points claimed successfully! Awarded ${response.data.data.pointsClaimed} points!`
        );
      }
    } catch (error) {
      console.error("Error claiming points:", error);
      toast.error("Failed to claim points");
    }
    setClaimingUserId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Leaderboard Dashboard
          </h1>

          {/* Add User Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Add New User
            </h2>
            <form onSubmit={handleAddUser} className="flex gap-4 items-end">
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user name"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="points"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Initial Points
                </label>
                <input
                  type="number"
                  id="points"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter points"
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Leaderboard
            </h2>
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No users added yet. Add your first user to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          {user.points}
                        </span>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                      <button
                        onClick={() => handleClaimPoints(user._id)}
                        disabled={claimingUserId === user._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {claimingUserId === user._id ? "Claiming..." : "Claim"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
