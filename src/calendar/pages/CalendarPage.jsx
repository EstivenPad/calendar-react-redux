import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { localizer, getMessagesES } from '../../helpers';

import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';
import { useSelector } from 'react-redux';


export const CalendarPage = () => {

	const { openDateModal } = useUiStore();
	const { events, startLoadingEvents, setActiveEvent } = useCalendarStore();
	const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

	const { activeEvent } = useSelector(state => state.calendar);
	const { user } = useAuthStore();

	const eventStyleGetter = ( event, start, end, isSelected ) => {
		
		const isMyEvent = (event.user._id === user.uid) || (event.user.uid === user.uid)

		const style = {
			backgroundColor: isMyEvent ? '#347CF7' : '#465660',
			borderRadius: '0px',
			opacity: 0.8,
			color: 'white'
		}

		return {
			style
		}
	}

	const onDoubleClick = (event) => {
		// console.log({ doubleClick: event });
		openDateModal();
	}

	const onSelect = (event) => {
		// console.log({ click: event });
		setActiveEvent(event)
	}

	const onViewChanged = (event) => {
		localStorage.setItem('lastView', event);
	}

	useEffect(() => {
		startLoadingEvents();
	}, [])
	

	return (
		<>
			<Navbar />

			<Calendar
				localizer={localizer}
				culture='es'
				defaultView={ lastView }
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 'calc( 100vh - 80px )' }}
				messages={ getMessagesES() }
				eventPropGetter={ eventStyleGetter }
				components={{
					event: CalendarEvent
				}}
				onDoubleClickEvent={ onDoubleClick }
				onSelectEvent={ onSelect }
				onView={ onViewChanged }
			/>

			<CalendarModal/>

			<FabAddNew/>
			<FabDelete/>

		</>
	)
}
