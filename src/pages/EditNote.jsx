import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getNote, updateNote } from '../services/api';
import { summarizeNote, improveWriting, generateTitle } from '../services/groq';

export default function EditNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiLoading, setAiLoading] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await getNote(id);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setFetching(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateNote(id, { title, content });
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!content) return alert('Add some content first');
    setAiLoading('summarize');
    try {
      const result = await summarizeNote(content);
      setContent(result);
    } catch (err) {
      alert('AI request failed');
    } finally {
      setAiLoading('');
    }
  };

  const handleImprove = async () => {
    if (!content) return alert('Add some content first');
    setAiLoading('improve');
    try {
      const result = await improveWriting(content);
      setContent(result);
    } catch (err) {
      alert('AI request failed');
    } finally {
      setAiLoading('');
    }
  };

  const handleGenerateTitle = async () => {
    if (!content) return alert('Add some content first');
    setAiLoading('title');
    try {
      const result = await generateTitle(content);
      setTitle(result);
    } catch (err) {
      alert('AI request failed');
    } finally {
      setAiLoading('');
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading note...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Edit Note</h1>
        <Link to="/notes" className="text-sm text-gray-600 hover:text-blue-600 transition">
          ← Back to Notes
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={handleSummarize}
              disabled={!!aiLoading}
              className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition disabled:opacity-50"
            >
              {aiLoading === 'summarize' ? 'Summarizing...' : '✨ Summarize'}
            </button>
            <button
              onClick={handleImprove}
              disabled={!!aiLoading}
              className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition disabled:opacity-50"
            >
              {aiLoading === 'improve' ? 'Improving...' : '✍️ Improve Writing'}
            </button>
            <button
              onClick={handleGenerateTitle}
              disabled={!!aiLoading}
              className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition disabled:opacity-50"
            >
              {aiLoading === 'title' ? 'Generating...' : '💡 Generate Title'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !!aiLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}