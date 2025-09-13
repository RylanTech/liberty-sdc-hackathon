const axios = require('axios');

const searchOpenStreetMap = async (city, category, state = '', country = 'us', limit = 50) => {
  if (!city || !category) {
    throw new Error('City and category are required');
  }

  let locationQuery = city;
  if (state) locationQuery += `, ${state}`;
  if (country) locationQuery += `, ${country}`;

  const locationRes = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: locationQuery,
      format: 'json',
      limit: 1
    },
    headers: { 'User-Agent': 'MyApp/1.0' }
  });

  if (!locationRes.data || locationRes.data.length === 0) {
    throw new Error('City/state not found');
  }

  const bbox = locationRes.data[0].boundingbox; 
  

  const overpassBbox = `${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]}`;

  const overpassQuery = `
  [out:json][timeout:60];
    (
      node["amenity"="${category}"](${overpassBbox});
      way["amenity"="${category}"](${overpassBbox});
      relation["amenity"="${category}"](${overpassBbox});
      node["shop"="${category}"](${overpassBbox});
      way["shop"="${category}"](${overpassBbox});
      relation["shop"="${category}"](${overpassBbox});
      node["leisure"="${category}"](${overpassBbox});
      way["leisure"="${category}"](${overpassBbox});
      relation["leisure"="${category}"](${overpassBbox});
      node["tourism"="${category}"](${overpassBbox});
      way["tourism"="${category}"](${overpassBbox});
      relation["tourism"="${category}"](${overpassBbox});
    );
    out center ${limit};
  `;

  const response = await axios.post('https://overpass-api.de/api/interpreter', 
    overpassQuery, 
    {
      headers: { 
        'User-Agent': 'MyApp/1.0',
        'Content-Type': 'text/plain'
      },
      timeout: 30000
    }
  );

  if (!response.data || !response.data.elements) {
    return [];
  }

  const results = response.data.elements.map((item, index) => {
    let lat, lon;
    
    if (item.type === 'node') {
      lat = item.lat;
      lon = item.lon;
    } else if (item.center) {
      lat = item.center.lat;
      lon = item.center.lon;
    } else if (item.type === 'way' && item.geometry && item.geometry.length > 0) {
      const coords = item.geometry;
      lat = coords.reduce((sum, coord) => sum + coord.lat, 0) / coords.length;
      lon = coords.reduce((sum, coord) => sum + coord.lon, 0) / coords.length;
    } else {
      return null; 
    }

    const tags = item.tags || {};
    let address = '';
    if (tags['addr:housenumber']) address += tags['addr:housenumber'] + ' ';
    if (tags['addr:street']) address += tags['addr:street'];
    if (tags['addr:city']) address += (address ? ', ' : '') + tags['addr:city'];
    if (tags['addr:state']) address += (address ? ', ' : '') + tags['addr:state'];
    if (tags['addr:postcode']) address += (address ? ' ' : '') + tags['addr:postcode'];

    return {
      id: item.id || index,
      name: tags.name || tags.brand || tags['addr:housename'] || `${category} ${index + 1}`,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      address: address || 'Address not available',
      state: tags['addr:state'] || null,
      type: item.type,
      class: tags.amenity || tags.shop || tags.leisure || tags.tourism || category,
      tags: tags 
    };
  }).filter(item => item !== null);
  const cityCenter = {
    lat: (parseFloat(bbox[0]) + parseFloat(bbox[1])) / 2,
    lon: (parseFloat(bbox[2]) + parseFloat(bbox[3])) / 2
  };

  results.sort((a, b) => {
    const distA = Math.sqrt(Math.pow(a.lat - cityCenter.lat, 2) + Math.pow(a.lon - cityCenter.lon, 2));
    const distB = Math.sqrt(Math.pow(b.lat - cityCenter.lat, 2) + Math.pow(b.lon - cityCenter.lon, 2));
    return distA - distB;
  });

  return results.slice(0, limit);
};

module.exports = { searchOpenStreetMap };