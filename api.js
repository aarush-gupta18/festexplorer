const BASE_URL = 'https://recruitments.bits-dvm.org/events';
export const fetchevents = async () => {
    const response = await fetch(`${BASE_URL}`);
    const data = await response.json();
    return data;};
export const searchevents = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.day)      query.append('day', params.day);
    if (params.venue)    query.append('venue', params.venue);
    const url = `${BASE_URL}/search?${query.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;};
