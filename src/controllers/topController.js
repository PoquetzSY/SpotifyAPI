const fetch = require('node-fetch');

// Authorization token that must have been created previously. See: https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQDbQCQPDs5LaMb-hejgd8BidooBFcpZ57PjLFcqnU80H1l7Z1wDb8Y84mE2MCfZv2lC3NE-DF8jd3WpfiN9QshxrCFzsLGw-yNS9pDBFt_qv3bshktoADj4VzJeZYv7Un3Fj0kDf4ThIyhufpQ6_AqxFibNMdTuE2GuiBQ5VluvuwfF0mgsUtSU5LIBr2fGX2mzhYY1E4FtOnXHSlpdZnGQCJkjRygg0OffL4qMtuq0GYzPMOtLXWDnk9PCLANG9GPYAtdXOpGZV_DhpDLL388C5_8tQytF1TbLC5i17Srjp0iKVeLmm11Q4ZJsxS8TyQHI-HLxZf_6Pa5jjXF0Ib4ZFS_hOrs5klwK2tNSlp1BrJzv2So';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=5', 'GET')).items;
}

module.exports = { getTopTracks };
