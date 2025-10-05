package models

type AppointmentEvent struct {
	EventType string      `json:"event_type"` 
	Data      Appointment `json:"data"`
}
