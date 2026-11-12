import ambulancesEvents from "../events/ambulances.events.js";

// Register a new socket connection and join the appropriate rooms based on user role
function register(socket) {

  const { id, role } = socket.user;

  // Individual room for the user
  socket.join(`user:${id}`);

  // Role-based room for the user (excluding role 3, admin)
  if (role != 3) {
    socket.join(`role:${role}`);
  }

  // Set up event listeners for events
  ambulancesEvents(socket);
}

const manager = {
  register,
};

export default manager;
