const execSync = require("child_process").execSync;

export default function handler(req, res) {
  const githubEvent = req.headers["x-github-event"];
  if (githubEvent === "push")
    var output = execSync("npm run update", { encoding: "utf-8" });
  res.status(202).send("Accepted");
}
