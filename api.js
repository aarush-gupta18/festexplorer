const link = 'https://recruitments.bits-dvm.org/events';
export const fetchEvents = async () => {
    const response = await fetch(`${link}`);
    const data = await response.json();
    return data;};

