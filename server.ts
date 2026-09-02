import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for CreatorIQ
let userProfile = {
  id: 1,
  full_name: "Monika Chowdary",
  email: "monika@example.com",
  role: "Content Creator & Influencer"
};

let contents = [
  {
    id: 1,
    creator_id: 1,
    platform: "YouTube",
    external_content_id: "yt_001",
    content_title: "10 React Best Practices You Must Know in 2025",
    views: 145200,
    likes: 12400,
    comments: 890,
    shares: 2150,
    saves: 3400,
    watch_time: 842000,
    reach: 198000,
    published_date: "2025-05-12"
  },
  {
    id: 2,
    creator_id: 1,
    platform: "Instagram",
    external_content_id: "ig_002",
    content_title: "Desk Setup Tour & Productivity Hacks (Reel)",
    views: 320500,
    likes: 28900,
    comments: 1420,
    shares: 6800,
    saves: 9500,
    watch_time: 320000,
    reach: 410000,
    published_date: "2025-05-18"
  },
  {
    id: 3,
    creator_id: 1,
    platform: "TikTok",
    external_content_id: "tt_003",
    content_title: "Day in the Life of an AI Software Engineer",
    views: 540000,
    likes: 64200,
    comments: 2950,
    shares: 11400,
    saves: 14200,
    watch_time: 490000,
    reach: 680000,
    published_date: "2025-05-24"
  },
  {
    id: 4,
    creator_id: 1,
    platform: "LinkedIn",
    external_content_id: "li_004",
    content_title: "How I Scaled My Developer Community to 50k Members",
    views: 89400,
    likes: 4800,
    comments: 620,
    shares: 1100,
    saves: 2100,
    watch_time: 120000,
    reach: 115000,
    published_date: "2025-05-30"
  },
  {
    id: 5,
    creator_id: 1,
    platform: "Twitter",
    external_content_id: "tw_005",
    content_title: "Top 7 AI Developer Tools That Save 20+ Hours A Week",
    views: 210000,
    likes: 18500,
    comments: 940,
    shares: 4300,
    saves: 6200,
    watch_time: 180000,
    reach: 290000,
    published_date: "2025-06-05"
  }
];

let audienceData = [
  { id: 1, country: "United States", percentage: 38.5, age_group: "25-34", gender_male: 58, gender_female: 42, active_time_peak: "18:00 - 21:00 UTC" },
  { id: 2, country: "India", percentage: 24.2, age_group: "18-24", gender_male: 65, gender_female: 35, active_time_peak: "14:00 - 17:00 UTC" },
  { id: 3, country: "United Kingdom", percentage: 12.8, age_group: "25-34", gender_male: 52, gender_female: 48, active_time_peak: "17:00 - 20:00 UTC" },
  { id: 4, country: "Germany", percentage: 8.5, age_group: "25-34", gender_male: 60, gender_female: 40, active_time_peak: "16:00 - 19:00 UTC" },
  { id: 5, country: "Canada", percentage: 7.2, age_group: "35-44", gender_male: 50, gender_female: 50, active_time_peak: "19:00 - 22:00 UTC" },
  { id: 6, country: "Others", percentage: 8.8, age_group: "18-44", gender_male: 56, gender_female: 44, active_time_peak: "Various" }
];

let growthData = [
  { id: 1, date: "2025-01-01", followers: 42500, net_growth: 3200, engagement_score: 8.2 },
  { id: 2, date: "2025-02-01", followers: 48900, net_growth: 6400, engagement_score: 8.7 },
  { id: 3, date: "2025-03-01", followers: 57200, net_growth: 8300, engagement_score: 9.1 },
  { id: 4, date: "2025-04-01", followers: 69400, net_growth: 12200, engagement_score: 9.6 },
  { id: 5, date: "2025-05-01", followers: 85100, net_growth: 15700, engagement_score: 10.4 },
  { id: 6, date: "2025-06-01", followers: 104200, net_growth: 19100, engagement_score: 11.2 }
];

let revenueData = [
  { id: 1, amount: 48000, revenue_date: "2025-05-05", source: "YouTube AdSense", description: "Monthly video revenue" },
  { id: 2, amount: 125000, revenue_date: "2025-05-15", source: "Brand Sponsorship", description: "TechBrand Q2 Campaign video integration" },
  { id: 3, amount: 32000, revenue_date: "2025-05-22", source: "Affiliate Marketing", description: "Dev tool referrers and hardware affiliate commissions" },
  { id: 4, amount: 65000, revenue_date: "2025-05-28", source: "Digital Products / Courses", description: "Full-Stack System Design eBook & Template sales" },
  { id: 5, amount: 18000, revenue_date: "2025-06-02", source: "Memberships & Tips", description: "Channel memberships and supporter donations" }
];

let sponsorshipData = [
  {
    id: 1,
    creator_id: 1,
    brand_name: "DevCloud Systems",
    campaign: "Summer Cloud Migration Suite Launch",
    contract_value: 150000,
    start_date: "2025-05-01",
    end_date: "2025-06-30",
    status: "Active",
    payment_status: "Paid"
  },
  {
    id: 2,
    creator_id: 1,
    brand_name: "CodeCraft AI",
    campaign: "Next-Gen AI Code Assistant Review",
    contract_value: 85000,
    start_date: "2025-06-01",
    end_date: "2025-07-15",
    status: "In Progress",
    payment_status: "Pending"
  },
  {
    id: 3,
    creator_id: 1,
    brand_name: "ErgoDesk Gear",
    campaign: "Modern Workspace Setup Showcase",
    contract_value: 45000,
    start_date: "2025-04-10",
    end_date: "2025-05-10",
    status: "Completed",
    payment_status: "Paid"
  }
];

let notifications = [
  {
    id: 1,
    creator_id: 1,
    title: "Viral Milestone Reached",
    message: "Your TikTok video 'Day in the Life of an AI Software Engineer' crossed 500,000 views!",
    notification_type: "Milestone",
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    creator_id: 1,
    title: "Sponsorship Payment Received",
    message: "Payment of ₹150,000 from DevCloud Systems has been settled successfully.",
    notification_type: "Payment",
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    creator_id: 1,
    title: "Engagement Spike Alert",
    message: "YouTube comments increased by +42% over the last 24 hours.",
    notification_type: "Performance",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper calculations
function getPlatformComparisonData() {
  const platformsMap: Record<string, {
    content_count: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_reach: number;
    total_engagement: number;
  }> = {};

  for (const item of contents) {
    if (!platformsMap[item.platform]) {
      platformsMap[item.platform] = {
        content_count: 0,
        total_views: 0,
        total_likes: 0,
        total_comments: 0,
        total_shares: 0,
        total_reach: 0,
        total_engagement: 0,
      };
    }
    const p = platformsMap[item.platform];
    p.content_count += 1;
    p.total_views += item.views;
    p.total_likes += item.likes;
    p.total_comments += item.comments;
    p.total_shares += item.shares;
    p.total_reach += item.reach;
    p.total_engagement += (item.likes + item.comments + item.shares + (item.saves || 0));
  }

  const results = Object.keys(platformsMap).map((platform) => {
    const data = platformsMap[platform];
    const engagement_rate = data.total_reach > 0 ? (data.total_engagement / data.total_reach) * 100 : 0;
    return {
      platform,
      content_count: data.content_count,
      total_views: data.total_views,
      total_likes: data.total_likes,
      total_comments: data.total_comments,
      total_shares: data.total_shares,
      total_reach: data.total_reach,
      total_engagement: data.total_engagement,
      engagement_rate: Math.round(engagement_rate * 100) / 100,
    };
  });

  results.sort((a, b) => b.engagement_rate - a.engagement_rate);
  return results;
}

function getContentPerformanceSummary() {
  const total_views = contents.reduce((acc, c) => acc + c.views, 0);
  const total_likes = contents.reduce((acc, c) => acc + c.likes, 0);
  const total_comments = contents.reduce((acc, c) => acc + c.comments, 0);
  const total_shares = contents.reduce((acc, c) => acc + c.shares, 0);
  const total_reach = contents.reduce((acc, c) => acc + c.reach, 0);

  return {
    total_content: contents.length,
    total_views,
    total_likes,
    total_comments,
    total_shares,
    total_reach,
    content: contents.map((c) => ({
      id: c.id,
      title: c.content_title,
      platform: c.platform,
      views: c.views,
      likes: c.likes,
      comments: c.comments,
      shares: c.shares,
      saves: c.saves,
      reach: c.reach,
      published_date: c.published_date,
    })),
  };
}

function getFullReport() {
  const content_performance = getContentPerformanceSummary();
  const platform_comparison = getPlatformComparisonData();
  const total_revenue = revenueData.reduce((acc, r) => acc + r.amount, 0);
  const total_contract_value = sponsorshipData.reduce((acc, s) => acc + s.contract_value, 0);

  return {
    creator_id: userProfile.id,
    content_performance,
    audience_analytics: {
      total_records: audienceData.length,
      data: audienceData,
    },
    revenue_analytics: {
      total_revenue,
      total_records: revenueData.length,
      data: revenueData,
    },
    growth_trends: {
      total_records: growthData.length,
      data: growthData,
    },
    platform_comparison,
    sponsorships: {
      total_sponsorships: sponsorshipData.length,
      total_contract_value,
      data: sponsorshipData,
    },
  };
}

// ==========================================
// API Routes
// ==========================================

// Current user profile
app.get(["/users/me", "/auth/me"], (req, res) => {
  res.json(userProfile);
});

// All Users
app.get("/users", (req, res) => {
  res.json([userProfile]);
});

// Auth endpoints
app.post("/auth/login", (req, res) => {
  res.json({
    access_token: "creator_iq_sample_jwt_token_2025",
    token_type: "bearer",
  });
});

app.post("/auth/register", (req, res) => {
  res.json({
    message: "User registered successfully",
    data: userProfile,
  });
});

// Reports endpoints
app.get("/reports", (req, res) => {
  res.json(getFullReport());
});

app.get("/reports/content", (req, res) => {
  res.json(getContentPerformanceSummary());
});

app.get("/reports/audience", (req, res) => {
  res.json({
    total_records: audienceData.length,
    data: audienceData,
  });
});

app.get("/reports/revenue", (req, res) => {
  const total_revenue = revenueData.reduce((acc, r) => acc + r.amount, 0);
  res.json({
    total_revenue,
    total_records: revenueData.length,
    data: revenueData,
  });
});

app.get("/reports/growth", (req, res) => {
  res.json({
    total_records: growthData.length,
    data: growthData,
  });
});

app.get("/reports/platforms", (req, res) => {
  res.json({
    data: getPlatformComparisonData(),
  });
});

// PDF and Excel Export endpoints
app.get("/reports/export/pdf", (req, res) => {
  const report = getFullReport();
  // Generate a text-based formatted report buffer
  const reportText = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 400 >> stream
BT
/F1 18 Tf
50 720 Td
(CreatorIQ - Performance Report) Tj
/F1 12 Tf
0 -30 Td
(Creator: ${userProfile.full_name}) Tj
0 -20 Td
(Total Content Items: ${report.content_performance.total_content}) Tj
0 -20 Td
(Total Views: ${report.content_performance.total_views.toLocaleString()}) Tj
0 -20 Td
(Total Likes: ${report.content_performance.total_likes.toLocaleString()}) Tj
0 -20 Td
(Total Reach: ${report.content_performance.total_reach.toLocaleString()}) Tj
0 -20 Td
(Total Revenue: INR ${report.revenue_analytics.total_revenue.toLocaleString()}) Tj
0 -20 Td
(Total Sponsorships Value: INR ${report.sponsorships.total_contract_value.toLocaleString()}) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000696 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
767
%%EOF`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=creator_report.pdf");
  res.send(Buffer.from(reportText, "utf-8"));
});

app.get("/reports/export/excel", (req, res) => {
  // Generate CSV data formatted as Excel spreadsheet
  let csv = "Platform,Content Count,Total Views,Total Likes,Total Reach,Engagement Rate (%)\n";
  const platforms = getPlatformComparisonData();
  platforms.forEach((p) => {
    csv += `"${p.platform}",${p.content_count},${p.total_views},${p.total_likes},${p.total_reach},${p.engagement_rate}%\n`;
  });

  csv += "\nContent Title,Platform,Views,Likes,Comments,Shares,Reach,Date\n";
  contents.forEach((c) => {
    csv += `"${c.content_title}","${c.platform}",${c.views},${c.likes},${c.comments},${c.shares},${c.reach},"${c.published_date}"\n`;
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=creator_report.xlsx");
  res.send(Buffer.from(csv, "utf-8"));
});

// Notifications APIs
app.get("/notifications", (req, res) => {
  res.json(notifications);
});

app.get("/notifications/unread-count", (req, res) => {
  const count = notifications.filter((n) => !n.is_read).length;
  res.json({ unread_count: count });
});

app.put("/notifications/mark-all-read", (req, res) => {
  notifications.forEach((n) => {
    n.is_read = true;
  });
  res.json({
    message: "All notifications marked as read",
    updated_count: notifications.length,
  });
});

app.post("/notifications/check-alerts", (req, res) => {
  const newAlert = {
    id: notifications.length + 1,
    creator_id: userProfile.id,
    title: "New Traffic Surge Detected",
    message: "Your recent video received 3,500 new views in the last hour!",
    notification_type: "Alert",
    is_read: false,
    created_at: new Date().toISOString(),
  };
  notifications.unshift(newAlert);
  res.json({
    message: "Alert check completed. 1 new alert generated.",
    new_count: 1,
    total: notifications.length,
    data: notifications,
  });
});

app.put("/notifications/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const notif = notifications.find((n) => n.id === id);
  if (notif) {
    if (req.body.is_read !== undefined) notif.is_read = req.body.is_read;
    return res.json({ message: "Notification updated successfully", data: notif });
  }
  res.status(404).json({ detail: "Notification not found" });
});

app.delete("/notifications/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  notifications = notifications.filter((n) => n.id !== id);
  res.json({ message: "Notification deleted successfully" });
});

// Sponsorships APIs
app.get("/sponsorships", (req, res) => {
  res.json(sponsorshipData);
});

app.get("/sponsorships/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = sponsorshipData.find((s) => s.id === id);
  if (!item) return res.status(404).json({ detail: "Sponsorship not found" });
  res.json({ data: item });
});

app.post("/sponsorships", (req, res) => {
  const newItem = {
    id: sponsorshipData.length + 1,
    creator_id: userProfile.id,
    ...req.body,
  };
  sponsorshipData.push(newItem);
  res.status(201).json({ message: "Sponsorship created", data: newItem });
});

// Content CRUD
app.get("/content", (req, res) => {
  res.json({ total: contents.length, data: contents });
});

app.get("/content/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = contents.find((c) => c.id === id);
  if (!item) return res.status(404).json({ detail: "Content not found" });
  res.json({ data: item });
});

// Audience and Growth APIs
app.get("/audience", (req, res) => {
  res.json({ total: audienceData.length, data: audienceData });
});

app.get("/growth", (req, res) => {
  res.json({ total: growthData.length, data: growthData });
});

// Revenue APIs
app.get("/revenue", (req, res) => {
  res.json({ total: revenueData.length, data: revenueData });
});

app.get("/revenue/analytics/summary", (req, res) => {
  const total = revenueData.reduce((acc, r) => acc + r.amount, 0);
  res.json({ total_revenue: total, records: revenueData.length });
});

// Analytics APIs
app.get("/analytics/top-content", (req, res) => {
  res.json(contents.slice(0, 5));
});

app.get("/analytics/platform-performance", (req, res) => {
  res.json(getPlatformComparisonData());
});

app.get("/analytics/platform-comparison", (req, res) => {
  res.json(getPlatformComparisonData());
});

app.get("/analytics/summary", (req, res) => {
  res.json(getContentPerformanceSummary());
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "CreatorIQ" });
});

// ==========================================
// Vite Integration
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreatorIQ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
