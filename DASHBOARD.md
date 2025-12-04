# Dashboard Setup

## Overview

The dashboard page has been successfully set up for the AI SalesFlow project. It provides a comprehensive view of all lead activities, statistics, and recent interactions as specified in the `about.md` user stories.

## Features

### 1. **Quick Statistics**

The dashboard displays four key metrics:

- **Total Leads**: Shows the total number of leads with month-over-month percentage change
- **Active Conversations**: Displays leads with recent messages (last 24 hours)
- **Closed Deals**: Shows total closed leads with weekly additions
- **Average Response Time**: Displays AI-powered response times

### 2. **Visual Charts**

- **Leads Trend Chart**: Bar chart showing lead creation over the last 7 days
- **Status Distribution**: Progress bars showing leads grouped by status (new, open, in_progress, closed, archived)

### 3. **Recent Activity**

- **Recent Leads**: List of the 5 most recent leads with avatars, email, status badges, and AI-generated summaries
- **Recent Messages**: Activity feed showing the latest conversations with color-coded sender types (User, AI, Lead)

## Architecture

### API Endpoint

- **Route**: `/api/dashboard/stats`
- **Method**: GET
- **Query Params**: `tenantId` (required)
- **Returns**: Comprehensive dashboard statistics including stats, recent leads, recent activity, and chart data

### Components Created

1. **`components/dashboard/stats-cards.tsx`**

   - Displays the four key metric cards with trend indicators
   - Includes responsive hover effects

2. **`components/dashboard/leads-chart.tsx`**

   - Bar chart visualization for leads over time
   - Interactive hover states showing exact counts

3. **`components/dashboard/status-chart.tsx`**

   - Progress bar chart for lead status distribution
   - Color-coded by status type

4. **`components/dashboard/recent-leads.tsx`**

   - Card displaying recent 5 leads
   - Includes avatars, status badges, and relative timestamps

5. **`components/dashboard/recent-activity.tsx`**
   - Activity feed for recent messages
   - Color-coded icons for different sender types

### Data Flow

1. Dashboard page uses TanStack Query (`useQuery`) to fetch data
2. Data is fetched from `/api/dashboard/stats` endpoint
3. API queries MongoDB using aggregation pipelines
4. Results are transformed and returned as JSON
5. Components receive props and render visualizations

## Running the Dashboard

### Prerequisites

Make sure you have:

- MongoDB connection string in `.env.local` as `NEXT_PUBLIC_MONGO_URL`
- Database seeded with sample data

### Seed the Database

Run the seed script to populate sample data:

```bash
npm run seed
```

This will create:

- 1 demo tenant
- 20 sample leads (distributed across different statuses and dates)
- Multiple messages for testing

### Access the Dashboard

1. Run the development server:

   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/dashboard` (or the dashboard route)

## Technical Details

### Dependencies Added

- `date-fns`: For relative date formatting ("2 hours ago", etc.)
- `dotenv`: For environment variable loading in scripts
- `tsx`: For running TypeScript scripts

### Data Fetching

- Uses **TanStack Query** for efficient data fetching and caching
- Auto-refetches every 30 seconds to keep data fresh
- Includes loading and error states for better UX

### Styling

- Uses **Tailwind CSS** for responsive design
- Includes **hover effects** and **transitions** for premium feel
- **Gradient text** for the dashboard title
- **Color-coded badges** for different statuses and sender types

## Future Enhancements

As mentioned in the user stories, the dashboard should be enhanced with:

1. Real authentication to get the actual tenant from the logged-in user
2. Date range pickers to filter data
3. Export functionality for reports
4. More detailed analytics and charts
5. Real-time updates using WebSockets
6. Customizable widgets that users can arrange

## Notes

- The current implementation uses a placeholder `tenantId` (`000000000000000000000000`)
- This should be replaced with the actual authenticated user's tenant ID once authentication is fully implemented
- All MongoDB aggregations are optimized for performance with proper indexes recommendation
- The dashboard components are fully responsive and mobile-friendly

## User Story Alignment

This dashboard implementation fulfills the user stories from `about.md`:

**For Founders:**
✅ Clean dashboard to see all new leads without jumping between email inboxes

**For Sales Managers:**
✅ All incoming leads in one place, sorted by newest first
✅ AI-generated summaries visible on each lead
✅ Easy to see lead status

**For SDRs:**
✅ Single inbox view for all messages
✅ Conversation history visible
✅ Can identify hot leads by status

**Dashboard Requirements:**
✅ Quick snapshots of new leads, open leads, and auto replies
✅ Basic charts to understand activity at a glance

## Support

For issues or questions about the dashboard, refer to the main project README or contact the development team.
