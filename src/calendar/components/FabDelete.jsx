import { useCalendarStore } from "../../hooks"

export const FabDelete = () => {
    
    const { hasEventSelected, startDeleteEvent } = useCalendarStore();


    const handleClickDelete = () => {
        startDeleteEvent();
    }
    
    return (
        <button
            aria-label="btn-delete"
            className="btn btn-danger fab-delete"
            onClick={ handleClickDelete }
            style={{
                display: hasEventSelected ? '' : 'none'
            }}
        >
            <i className="fas fa-trash"></i>
        </button>
    )
}
