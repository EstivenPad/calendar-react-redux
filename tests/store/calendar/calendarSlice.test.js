import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarStates';

describe('test on calendarSlice', () => { 
    test('should return the initial state', () => { 
        
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );

    });

    test('onSetActiveEvent should active the event', () => { 
        
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        expect( state.activeEvent ).toEqual( events[0] );

    });

    test('onAddNewEvent should add the event', () => { 

        const newEvent = {
            id: '3',
            start: new Date('2020-11-04 09:00:00'),
            end: new Date('2020-11-04 12:00:00'),
            title: 'Test event!!',
            notes: 'Test notes!!!', 
        };

        const state = calendarSlice.reducer(initialState, onAddNewEvent( newEvent ));
        expect( state.events ).toEqual([ newEvent ]);

    });

    test('onUpdateEvent should update the event', () => { 

        const updatedEvent = {
            id: '1',
            start: new Date('2023-11-04 09:00:00'),
            end: new Date('2023-11-04 12:00:00'),
            title: 'Test event updated',
            notes: 'Test notes updated', 
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent( updatedEvent ));
        expect( state.events ).toContain( updatedEvent );

    });

    test('onDeleteEvent should delete the event', () => { 
        
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        expect( state.activeEvent ).toBeNull();
        expect( state.events ).not.toContain( events[0] );

    });

    test('onLoadEvents should load the events', () => { 
        
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect( state.isLoadingEvents ).toBeFalsy();
        expect( state.events ).toEqual( events );

    });

    test('onLogoutCalendar should clean the state', () => { 
    
        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
        expect( state ).toEqual( initialState );

    });

 });