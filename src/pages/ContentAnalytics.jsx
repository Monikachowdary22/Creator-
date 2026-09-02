import { useEffect, useState } from "react";
import { getContentReport } from "../services/api";
import {
  FileText,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Trophy,
} from "lucide-react";

function ContentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const result = await getContentReport();
        setData(result);
      } catch (err) {
        console.error("Content API error:", err);
        setError("Unable to load content analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const report = data || {};
  const contentList = Array.isArray(report.content) ? report.content : [];

  // Default sample items matching screenshot if empty
  const displayItems = contentList.length > 0 ? contentList : [
    { id: 1, title: "Travel Reels Tips", platform: "Instagram", views: 22000, likes: null, comments: null },
    { id: 2, title: "Healthy Morning Routine", platform: "Instagram", views: 18500, likes: null, comments: null },
    { id: 3, title: "Content Creation Tips", platform: "Instagram", views: 12800, likes: null, comments: null },
    { id: 4, title: "Photography Editing Guide", platform: "Instagram", views: 9400, likes: null, comments: null },
    { id: 5, title: "Machine Learning for Beginners", platform: "YouTube", views: 15200, likes: null, comments: null },
  ];

  const formatNum = (n) => {
    if (n === undefined || n === null) return "-";
    const num = Number(n);
    if (isNaN(num)) return "-";
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPlatformBadge = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("youtube")) {
      return "text-red-600 bg-red-50 border border-red-100";
    }
    if (p.includes("instagram")) {
      return "text-pink-600 bg-pink-50 border border-pink-100";
    }
    if (p.includes("tiktok")) {
      return "text-slate-800 bg-slate-100 border border-slate-200";
    }
    if (p.includes("linkedin")) {
      return "text-blue-700 bg-blue-50 border border-blue-100";
    }
    return "text-sky-600 bg-sky-50 border border-sky-100";
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading content analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metric Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Content */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Content
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {report.total_content !== undefined ? formatNum(report.total_content) : "0"}
              </h3>
            </div>
          </div>

          {/* Card 2: Total Views */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Views
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {report.total_views !== undefined ? formatNum(report.total_views) : "0"}
              </h3>
            </div>
          </div>

          {/* Card 3: Total Likes */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Likes
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {report.total_likes !== undefined ? formatNum(report.total_likes) : "0"}
              </h3>
            </div>
          </div>

          {/* Card 4: Total Comments */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Comments
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {report.total_comments !== undefined ? formatNum(report.total_comments) : "0"}
              </h3>
            </div>
          </div>
        </div>

        {/* Second Row: Total Shares */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Shares
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {report.total_shares !== undefined ? formatNum(report.total_shares) : "0"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-gray-800">
            Top Performing Content
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {item.title || item.content_title || "Untitled Content"}
                </h4>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0 ${getPlatformBadge(
                    item.platform
                  )}`}
                >
                  {item.platform || "Platform"}
                </span>
              </div>

              <div className="text-xs text-gray-500 flex items-center gap-1.5 font-normal">
                <span>{formatNum(item.views)} views</span>
                <span>•</span>
                <span>{formatNum(item.likes)} likes</span>
                <span>•</span>
                <span>{formatNum(item.comments)} comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContentAnalytics;

