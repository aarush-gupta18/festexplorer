const link = 'https://recruitments.bits-dvm.org/events';
export const fetchevents = async () => {
    const response = await fetch(`${link}`);
    const data = await response.json();
    return data;};
export const searchevents = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.day)      query.append('day', params.day);
    if (params.venue)    query.append('venue', params.venue);
    const response = await fetch(`${link}/search?${query.toString()}`);
    const data = await response.json();
    return data;};
