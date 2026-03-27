import { parseCliArgs } from "./config/cli";
import { createApp } from "./app";

const config = parseCliArgs();

const app = createApp(config);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Using files:");
  console.log("Map:", config.mapPath);
  console.log("Bookings:", config.bookingsPath);
});
