export const events = [
    {
        id: '1',
        start: new Date('2023-11-04 09:00:00'),
        end: new Date('2023-11-04 12:00:00'),
        title: 'Test event',
        notes: 'Test notes', 
    },
    {
        id: '2',
        start: new Date('2023-12-24 15:00:00'),
        end: new Date('2023-12-24 18:00:00'),
        title: 'Test event from Michael',
        notes: 'Test notes from Michael', 
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
};

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null,
};

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] },
};