import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";

async function addChangelogEntry(newVersion, releaseLabel, additions, errorFixes, upgrades) {
  try {
    const currentDate = new Date().toISOString();
    const changelogEntry = `## [${newVersion} - ${releaseLabel}] - ${currentDate}\n`
      + `${additions.length ? "### Added\n" : ""}${additions.join("\n")}\n`
      + `${errorFixes.length ? "### Error Fixes\n" : ""}${errorFixes.join("\n")}\n`
      + `${upgrades.length ? "### Upgrades\n" : ""}${upgrades.join("\n")}\n\n`;

    const projectDir = process.cwd();
    const changelogPath = path.join(projectDir, "database", "CHANGELOG.md");

    // Create the directory if it doesn't exist
    await fs.mkdir(path.dirname(changelogPath), { recursive: true });

    // Read the current changelog content
    let changelogContent = await fs.readFile(changelogPath, "utf-8");

    // Parse the versions and find the latest version
    const versionRegex = /## \[([\d.]+) -/g;
    const versionMatches = Array.from(changelogContent.matchAll(versionRegex));
    const versions = versionMatches.map((match) => match[1]);
    const latestVersion = versions[0];

    // If newVersion is not provided, create a .1 incremented version
    if (!newVersion) {
      const latestVersionParts = latestVersion.split(".");
      const incrementedVersion = parseInt(latestVersionParts[latestVersionParts.length - 1], 10) + 1;
      latestVersionParts[latestVersionParts.length - 1] = incrementedVersion.toString();
      newVersion = latestVersionParts.join(".");
    }

    changelogContent = changelogEntry + changelogContent;

    // Write the updated changelog content back to the file
    await fs.writeFile(changelogPath, changelogContent);

    // Promisify the exec function to work with async/await
    const execute = (command) => {
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error("Error executing Git commands:", error);
            reject(error);
          } else {
            console.log("Git commands executed successfully:", stdout);
            resolve();
          }
        });
      });
    };

    // Run Git commands
    await execute("git add . && git commit -m \"" + releaseLabel + "\" && git push origin master");
  } catch (error) {
    console.error("Error updating version:", error);
    throw error;
  }
}


export default async function handler(req, res) {
  try {
    const { newVersion, releaseLabel, additions, errorFixes, upgrades } = req.body;
    await addChangelogEntry(newVersion, releaseLabel, additions, errorFixes, upgrades);
    res.status(200).json({ message: "Version updated and pushed to Git successfully." });
  } catch (error) {
    console.error("Error updating version:", error);
    res.status(500).json({ message: "Error updating version." });
  }
}