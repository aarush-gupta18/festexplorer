const link = 'https://recruitments.bits-dvm.org/events';
export const fetchevents = async () => {
    const response = await fetch(`${link}`);
    const data = await response.json();
    return data;};
export const searchevents = async (a = {}) => {
    const query = new URLSearchParams();
    if (a.category)query.append('category', a.category);
    if (a.day)query.append('day', a.day);
    if (a.venue)query.append('venue', a.venue);
    const response = await fetch(`${link}/search?${query.toString()}`);
    const data = await response.json();
    return data;};
