export type CliConfig = {
  mapPath: string;
  bookingsFilePath: string;
};

export function parseCliArgs(): CliConfig {
  const args = process.argv;

  const getArg = (name: string, defaultValue: string): string => {
    const index = args.indexOf(name);

    if (index !== -1) {
      const value = args[index + 1];

      if (typeof value === "string" && value.trim() !== "") {
        return value;
      }
    }

    return defaultValue;
  };

  return {
    mapPath: getArg("--map", "./map.ascii"),
    bookingsFilePath: getArg("--bookings", "./bookings.json"),
  };
}
