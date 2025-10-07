// pages/games/create.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

interface CreateGameForm {
  name: string;
  description: string;
  maxPlayers: number;
  startingBalance: number;
  endsAt: string; // Date string
}

export default function CreateGame() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateGameForm>({
    name: '',
    description: '',
    maxPlayers: 4,
    startingBalance: 100000,
    endsAt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ownerId: 1, // Default user ID for now
          endsAt: new Date(formData.endsAt).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create game');
      }

      const newGame = await response.json();
      console.log('Game created:', newGame);

      // Redirect to the games list or to the new game
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'maxPlayers' || name === 'startingBalance'
          ? parseInt(value) || 0
          : value,
    }));
  };

  // Set default end date to 7 days from now
  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Game
            </h1>
            <p className="text-gray-600">Set up a new trading competition</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Game Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tech Stock Challenge 2024"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the trading competition..."
              />
            </div>

            {/* Max Players */}
            <div>
              <label
                htmlFor="maxPlayers"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maximum Players *
              </label>
              <input
                type="number"
                id="maxPlayers"
                name="maxPlayers"
                required
                min="2"
                max="20"
                value={formData.maxPlayers}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Between 2 and 20 players
              </p>
            </div>

            {/* Starting Balance */}
            <div>
              <label
                htmlFor="startingBalance"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Starting Balance ($) *
              </label>
              <input
                type="number"
                id="startingBalance"
                name="startingBalance"
                required
                min="1000"
                step="1000"
                value={formData.startingBalance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Each player starts with this amount
              </p>
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endsAt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Game End Date *
              </label>
              <input
                type="date"
                id="endsAt"
                name="endsAt"
                required
                value={formData.endsAt || getDefaultEndDate()}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                When the trading competition ends
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
