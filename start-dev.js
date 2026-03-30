const { spawn } = require("child_process");
const path = require("path");

const rawArgs = process.argv.slice(2);
const isWindows = process.platform === "win32";

function normalizeArgs(args) {
  const normalized = [...args];

  const mapIndex = normalized.indexOf("--map");
  if (mapIndex !== -1 && normalized[mapIndex + 1]) {
    normalized[mapIndex + 1] = path.resolve(normalized[mapIndex + 1]);
  }

  const bookingsIndex = normalized.indexOf("--bookings");
  if (bookingsIndex !== -1 && normalized[bookingsIndex + 1]) {
    normalized[bookingsIndex + 1] = path.resolve(normalized[bookingsIndex + 1]);
  }

  return normalized;
}

const backendArgs = normalizeArgs(rawArgs);

function runNpmScript(cwd, scriptName, extraArgs = []) {
  if (isWindows) {
    return spawn(
      "cmd.exe",
      ["/c", "npm", "run", scriptName, "--", ...extraArgs],
      {
        cwd,
        stdio: "inherit",
      },
    );
  }

  return spawn("npm", ["run", scriptName, "--", ...extraArgs], {
    cwd,
    stdio: "inherit",
  });
}

function runFrontend(cwd) {
  if (isWindows) {
    return spawn("cmd.exe", ["/c", "npm", "run", "dev"], {
      cwd,
      stdio: "inherit",
    });
  }

  return spawn("npm", ["run", "dev"], {
    cwd,
    stdio: "inherit",
  });
}

const backendProcess = runNpmScript(
  path.resolve(__dirname, "backend"),
  "dev",
  backendArgs,
);

const frontendProcess = runFrontend(path.resolve(__dirname, "frontend"));

function shutdown() {
  if (!backendProcess.killed) backendProcess.kill();
  if (!frontendProcess.killed) frontendProcess.kill();
  process.exit();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

backendProcess.on("close", (code) => {
  console.log(`Backend exited with code ${code}`);
  if (!frontendProcess.killed) frontendProcess.kill();
  process.exit(code ?? 0);
});

frontendProcess.on("close", (code) => {
  console.log(`Frontend exited with code ${code}`);
  if (!backendProcess.killed) backendProcess.kill();
  process.exit(code ?? 0);
});
