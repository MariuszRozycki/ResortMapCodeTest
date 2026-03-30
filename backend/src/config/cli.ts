import path from "path";

export type CliConfig = {
  mapPath: string;
  bookingsFilePath: string;
};

export function parseCliArgs(): CliConfig {
  const args = process.argv.slice(2);

  const mapIndex = args.indexOf("--map");
  const bookingsIndex = args.indexOf("--bookings");

  const mapArgFromCli = mapIndex !== -1 ? args[mapIndex + 1] : undefined;
  const bookingsArgFromCli =
    bookingsIndex !== -1 ? args[bookingsIndex + 1] : undefined;

  const mapArg = mapArgFromCli ?? "../map.ascii";
  const bookingsArg = bookingsArgFromCli ?? "../bookings.json";

  return {
    mapPath: path.resolve(process.cwd(), mapArg),
    bookingsFilePath: path.resolve(process.cwd(), bookingsArg),
  };
}
