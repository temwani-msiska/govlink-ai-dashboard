export const networkHealthData = [
    { service: "Government Service Bus (GSB)", status: "Operational", uptime: "99.8%", latency: "120ms" },
    { service: "DotGov Platform", status: "Slow", uptime: "98.2%", latency: "450ms" },
    { service: "E-Government Payments", status: "Down", uptime: "92.5%", latency: "N/A" },
    { service: "Rural Office Connectivity", status: "Operational", uptime: "97.9%", latency: "320ms" },
  ];
  
  export const aiAlertsData = [
    { id: 1, alert: "High packet loss detected on DotGov APIs", severity: "Critical", timestamp: "2 mins ago" },
    { id: 2, alert: "Possible ISP failure in Rural Office A", severity: "Warning", timestamp: "10 mins ago" },
    { id: 3, alert: "Unusual bandwidth spike detected", severity: "Info", timestamp: "30 mins ago" },
  ];
  
  export const smartRoutingData = [
    { currentRoute: "Zamtel", failover: "Liquid Telecom", status: "Recommended", reason: "High latency" },
    { currentRoute: "MTN", failover: "Airtel", status: "Not Needed", reason: "Stable connection" },
  ];
  
  export const bandwidthAnalyticsData = [
    { service: "DotGov", usage: "200GB", peakTime: "12:00 PM" },
    { service: "E-Gov Payments", usage: "350GB", peakTime: "2:00 PM" },
    { service: "GSB APIs", usage: "500GB", peakTime: "3:30 PM" },
  ];
  
  export const offlineSyncData = [
    { office: "Rural Office A", syncStatus: "Pending", lastSync: "4 hours ago" },
    { office: "Provincial HQ", syncStatus: "Synced", lastSync: "30 mins ago" },
  ];
  export const speedTestData = {
    downloadSpeed: 75, 
    uploadSpeed: 25, 
    latency: 30, 
  };
  
  export const networkLocations = [
    {
      id: 1,
      name: "Ministry of Finance",
      lat: -15.3875,
      lng: 28.3228,
      status: "Operational",
      currentISP: "Zamtel",
      failoverISP: "Liquid Telecom",
    },
    {
      id: 2,
      name: "Rural Office A",
      lat: -14.8405,
      lng: 27.8216,
      status: "Slow",
      currentISP: "MTN",
      failoverISP: "Airtel",
    },
    {
      id: 3,
      name: "Government Data Center",
      lat: -15.4232,
      lng: 28.2995,
      status: "Down",
      currentISP: "Zamtel",
      failoverISP: "Liquid Telecom",
    },
  ];
  