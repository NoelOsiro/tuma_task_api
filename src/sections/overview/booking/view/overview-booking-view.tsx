'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Button } from '@mui/material';

import { fetcher, endpoints } from 'src/lib/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { _bookings, _bookingNew, _appFeatured, _bookingReview } from 'src/_mock';
import {
  SeoIllustration,
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import { BookingBooked } from '../booking-booked';
import { BookingNewest } from '../booking-newest';
import { AppWelcome } from '../../app/app-welcome';
import { BookingDetails } from '../booking-details';
import { AppFeatured } from '../../app/app-featured';
import { BookingAvailable } from '../booking-available';
import { BookingStatistics } from '../booking-statistics';
import { BookingTotalIncomes } from '../booking-total-incomes';
import { BookingWidgetSummary } from '../booking-widget-summary';
import { BookingCheckInWidgets } from '../booking-check-in-widgets';
import { BookingCustomerReviews } from '../booking-customer-reviews';

// ----------------------------------------------------------------------

export function OverviewBookingView() {
  const { user } = useAuthContext();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetcher(endpoints.tasks.list);
        // `fetcher` returns the response payload. Normalize possible shapes to an array.
        // Common shapes: [] | { data: [] } | { results: [] } | unexpected object or string
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data?.data)) {
          items = data.data;
        } else if (Array.isArray(data?.results)) {
          items = data.results;
        } else {
          // fallback: if data itself looks like a single item, wrap it
          if (data && typeof data === 'object' && (data.id || data.title)) {
            items = [data];
          } else {
            items = [];
          }
        }

        if (mounted) setTasks(items);
      } catch (err) {
        console.warn('[overview] failed to load tasks, falling back to mock data', err);
        if (mounted) setTasks(_bookings as any[]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
     
  }, []);

  const totalActive = Array.isArray(tasks) ? tasks.length : 0;
  const totalPending = Array.isArray(tasks)
    ? tasks.filter((t) => t.status === 'open' || t.status === 'assigned').length
    : 0;
  const totalCompleted = Array.isArray(tasks) ? tasks.filter((t) => t.status === 'completed').length : 0;
  const _taskOverview = [
    { status: 'open', value: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'open').length : 0, quantity: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'open').length : 0 },
    { status: 'assigned', value: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'assigned').length : 0, quantity: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'assigned').length : 0 },
    { status: 'in_progress', value: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'in_progress').length : 0, quantity: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'in_progress').length : 0 },
    { status: 'completed', value: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'completed').length : 0, quantity: Array.isArray(tasks) ? tasks.filter((t) => t.status === 'completed').length : 0 },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="Fill your Profile to get started"
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary" href='user/'>
                Profile
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={_appFeatured} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Total Active Tasks"
            percent={0}
            total={totalActive}
            icon={<BookingIllustration />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Pending Tasks"
            percent={0}
            total={totalPending}
            icon={<CheckInIllustration />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Completed Tasks"
            percent={0}
            total={totalCompleted}
            icon={<CheckoutIllustration />}
          />
        </Grid>

        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Box
              sx={{
                mb: 3,
                p: { md: 1 },
                display: 'flex',
                gap: { xs: 3, md: 1 },
                borderRadius: { md: 2 },
                flexDirection: 'column',
                bgcolor: { md: 'background.neutral' },
              }}
            >
              <Box
                sx={{
                  p: { md: 1 },
                  display: 'grid',
                  gap: { xs: 3, md: 0 },
                  borderRadius: { md: 2 },
                  bgcolor: { md: 'background.paper' },
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                }}
              >
                <BookingTotalIncomes
                  title="Total tasks"
                  total={totalActive}
                  percent={2.6}
                  chart={{
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    series: [{ data: [10, 41, 80, 100, 60, 120, 69, 91, 160] }],
                  }}
                />

                <BookingBooked
                  title="Task status"
                  data={_taskOverview}
                  sx={{ boxShadow: { md: 'none' } }}
                />
              </Box>

              <BookingCheckInWidgets
                chart={{
                  series: [
                    { label: 'Pending Tasks', percent: (totalPending / totalActive) * 100, total: totalPending },
                    { label: 'Completed Tasks', percent: (totalCompleted / totalActive) * 100, total: totalCompleted },
                  ],
                }}
                sx={{ boxShadow: { md: 'none' } }}
              />
            </Box>

            <BookingStatistics
              title="Task statistics"
              chart={{
                series: [
                  {
                    name: 'Weekly',
                    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                    data: [
                      { name: 'PPoE', data: [24, 41, 35, 151, 49] },
                      { name: 'Hotspot', data: [20, 56, 77, 88, 99] },
                    ],
                  },
                  {
                    name: 'Monthly',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    data: [
                      { name: 'PPoE', data: [83, 112, 119, 88, 103, 112, 114, 108, 93] },
                      { name: 'Hotspot', data: [46, 46, 43, 58, 40, 59, 54, 42, 51] },
                    ],
                  },
                  {
                    name: 'Yearly',
                    categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                    data: [
                      { name: 'PPoE', data: [76, 42, 29, 41, 27, 96] },
                      { name: 'Hotspot', data: [46, 44, 24, 43, 44, 43] },
                    ],
                  },
                ],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
              <BookingAvailable
                title="Available tasks"
                chart={{
                  series: [
                    { label: 'Pending', value: totalPending },
                    { label: 'Available', value: totalActive },
                  ],
                }}
              />

              <BookingCustomerReviews
                title="Customer reviews"
                subheader={`${_bookingReview.length} Reviews`}
                list={_bookingReview}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid size={12}>
          <BookingNewest
            title="Newest tasks"
            subheader={`${_bookingNew.length} tasks`}
            list={_bookingNew}
          />
        </Grid>

        <Grid size={12}>
          <BookingDetails
            title="Task details"
            tableData={_bookings}
            headCells={[
              { id: 'destination', label: 'Location' },
              { id: 'customer', label: 'Requester' },
              { id: 'checkIn', label: 'Start Time' },
              { id: 'checkOut', label: 'End Time' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
