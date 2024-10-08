import cron from 'node-cron';
import { Booking } from '../database/models/Booking';
import { Booking_History } from '../database/models/Booking_history';
import { LessThanOrEqual, Not } from 'typeorm'; // Add this import

const moveExpiredReservationsToHistory = async () => {
    const currentDate = new Date();

    const expiredReservations = await Booking.find({
        where: {
            exit_datetime: LessThanOrEqual(currentDate),
            state: Not("checked-out" as "reserved" | "checked-in" | "checked-out" | "cancelled") // Specify the type
        }
    });

    const validStates = ["reserved", "cancelled", "no-show", "completed"]; // Define valid states

    const historyPromises = expiredReservations.map(reservation => {
        const history = new Booking_History();
        history.room_id = reservation.room_id;
        history.user_id = reservation.user_id;
        history.entry_datetime = reservation.entry_datetime;
        history.exit_datetime = reservation.exit_datetime || new Date(); 
        return history.save();
    });

    // Save all histories
    await Promise.all(historyPromises);

    // Optionally, delete expired reservations from the Access table
    const deletePromises = expiredReservations.map(reservation => {
        return Booking.delete({ id: reservation.id });
    });

    await Promise.all(deletePromises);
    
    console.log("Moved expired reservations to history.");
}

// Schedule the task to run at midnight every day
cron.schedule('0 0 * * *', async () => {
    console.log("Running scheduled task to move expired reservations.");
    await moveExpiredReservationsToHistory();
});