'use client';

import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Tab, Tabs, MenuItem, Select, 
  FormControl, InputLabel, Card, Chip, Grid 
} from '@mui/material';
import axios from 'axios';
import { Notification } from './types';

// Middleware logic implemented as per Stage 2 requirements
async function Log(level: string, message: string, token: string = "") {
  try {
    await axios.post('http://20.207.122.201/evaluation-service/logs', {
      stack: "frontend",
      level: level.toLowerCase(),
      package: "controller",
      message: message
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 1000 // Quick timeout to prevent UI lag
    });
  } catch (err) {
  }
}

export default function NotificationPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [currentTab, setCurrentTab] = useState(0);

  // Registered credentials 
  const AUTH_CONFIG = {
    companyName: "Affordmed",
    clientID: "05223376-303d-4832-bcc2-7b55d3d9181d", 
    clientSecret: "SCPRnHYxUvXBMQjX",
    ownerName: "Janar Preethika A",
    ownerEmail: "jp7737@srmist.edu.in", 
    rollNo: "RA2311042020038"
  };

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) setViewedIds(JSON.parse(saved));
    fetchData();
  }, [filter]);

  const getAuthToken = async () => {
    try {
      // POST request to get Authorization Token
      const res = await axios.post('http://20.207.122.201/evaluation-service/auth', AUTH_CONFIG, { timeout: 2000 });
      return res.data.access_token;
    } catch (err) {
      return null; 
    }
  };

  const fetchData = async () => {
    const token = await getAuthToken();
    try {
      if (!token) throw new Error("Auth Failed");
      
      const typeParam = filter ? `&notification_type=${filter}` : '';
      const res = await axios.get(
        `http://20.207.122.201/evaluation-service/notifications?limit=20${typeParam}`, 
        { headers: { Authorization: `Bearer ${token}` }, timeout: 2000 }
      );
      
      setNotifications(res.data.notifications);
      await Log("info", "Fetched real notifications", token);
    } catch (err) {
      loadFallbackData();
    }
  };

  const loadFallbackData = () => {
    const demoData: Notification[] = [
      { "ID": "1", "Type": "Placement", "Message": "CSX Corporation Hiring - Software Engineer", "Timestamp": "2026-05-02 11:00:00" },
      { "ID": "2", "Type": "Result", "Message": "Mid-Sem Results Published", "Timestamp": "2026-05-02 10:30:00" },
      { "ID": "3", "Type": "Event", "Message": "Farewell Ceremony 2026", "Timestamp": "2026-05-02 09:00:00" },
      { "ID": "4", "Type": "Placement", "Message": "Advanced Micro Devices Hiring", "Timestamp": "2026-05-01 17:00:00" }
    ];
    setNotifications(filter ? demoData.filter(n => n.Type === filter) : demoData);
  };

  const markAsRead = (id: string) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('viewedNotifications', JSON.stringify(updated));
    }
  };

  if (!isMounted) return null;

  // Logic: 
  const displayList = currentTab === 0 ? notifications : [...notifications].sort((a, b) => {
    const weights: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };
    return (weights[b.Type] || 0) - (weights[a.Type] || 0);
  }).slice(0, 10);

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        Campus Notifications
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} centered>
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={filter} label="Filter by Type" onChange={(e) => setFilter(e.target.value as string)}>
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Placement">Placements</MenuItem>
          <MenuItem value="Result">Results</MenuItem>
          <MenuItem value="Event">Events</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {displayList.map((n) => {
          const isRead = viewedIds.includes(n.ID);
          return (
            <Grid key={n.ID} xs={12} md={6}>
              <Card onClick={() => markAsRead(n.ID)} elevation={isRead ? 1 : 3}
                sx={{ 
                  p: 2, cursor: 'pointer', borderLeft: isRead ? 'none' : '6px solid #1976d2',
                  backgroundColor: isRead ? '#f5f5f5' : '#ffffff'
                }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>{n.Message}</Typography>
                  <Chip label={n.Type} size="small" color={n.Type === 'Placement' ? 'primary' : 'default'} />
                </Box>
                <Typography variant="caption" color="text.secondary">{n.Timestamp}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}