import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  try {
    const { newVersion, releaseLabel, additions, errorFixes, upgrades } = req.body;
    const currentDate = new Date().toISOString();
    const changelogEntry = `## [${newVersion} - ${releaseLabel}] - ${currentDate}\n`
      + `${additions.length ? "### Added\n" : ""}${additions.join("\n")}\n`
      + `${errorFixes.length ? "### Error Fixes\n" : ""}${errorFixes.join("\n")}\n`
      + `${upgrades.length ? "### Upgrades\n" : ""}${upgrades.join("\n")}\n\n`;

    const projectDir = process.cwd(); // This gets the top-most directory of your project
    const changelogPath = path.join(projectDir, "database", "CHANGELOG.md");

    // Create the directory if it doesn't exist
    await fs.mkdir(path.dirname(changelogPath), { recursive: true });

    // Create the file if it doesn't exist
    await fs.appendFile(changelogPath, changelogEntry, { flag: "a" });

    // Run Git commands
    exec("git add . && git commit -m \"" + releaseLabel + "\" && git push origin master", (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing Git commands:", error);
        res.status(500).json({ message: "Error updating version and pushing to Git." });
      } else {
        console.log("Git commands executed successfully:", stdout);
        res.status(200).json({ message: "Version updated and pushed to Git successfully." });
      }
    });
  } catch (error) {
    console.error("Error updating version:", error);
    res.status(500).json({ message: "Error updating version." });
  }
}
