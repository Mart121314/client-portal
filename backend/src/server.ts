import "dotenv/config";
import { app } from "./app";
import { runCleanup } from "./services/cleanupService";

const PORT = process.env.PORT ?? 3000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

runCleanup().catch((err) => console.error("Cleanup failed:", err));
setInterval(() => {
  runCleanup().catch((err) => console.error("Cleanup failed:", err));
}, CLEANUP_INTERVAL_MS);
