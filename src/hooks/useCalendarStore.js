import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onSetActiveEvent, onUpdateEvent, onDeleteEvent, onLoadEvents } from '../store';
import calendarApi from '../api/calendarApi';
import { convertEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent(calendarEvent) );
    }

    const startAddNewEvent = async ( calendarEvent ) => {
        
        try {
            
            if( calendarEvent.id ){
                //Updating
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            }
            
            //Creating
            const { data } = await calendarApi.post('/events', calendarEvent);          
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id, user }) );

        } catch (error) {
            console.log(error);
            Swal.fire('Error on saving', error.response.data.msg, 'error');
        }
        
    }

    const startDeleteEvent = async () => {

        try {
            
            await calendarApi.delete(`/events/${activeEvent.id}`)

            dispatch( onDeleteEvent() );
        } catch (error) {
            console.log(error);
            Swal.fire('Error on deleting', error.response.data.msg, 'error');
        }

    }

    const startLoadingEvents = async () => {
        try {
            
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.events );
            dispatch( onLoadEvents(events) );

        } catch (error) {
            console.log('Error loading events');
            console.log(error);
        }
    }

    return {
        //Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //Methods
        setActiveEvent,
        startAddNewEvent,
        startDeleteEvent,
        startLoadingEvents
    }

}