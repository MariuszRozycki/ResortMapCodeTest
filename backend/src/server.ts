import { parseCliArgs } from "./config/cli";
import { createApp } from "./app";
import { parseMapFile } from "./parsers/parseMapFile";

const config = parseCliArgs();
const parsedMap = parseMapFile(config.mapPath);

const app = createApp(config);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Using files:");
  console.log(`map: ${config.mapPath}`);
  console.log(`bookings: ${config.bookingsFilePath}`);
  console.log("Map parsed successfully.");
  console.log("=================================");
});
