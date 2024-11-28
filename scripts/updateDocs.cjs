const fs = require('fs');
const path = require('path');

// Path to the packages directory and the index.md file
const packagesDir = path.join(__dirname, '../packages/sdk');
const docsIndexPath = path.join(__dirname, '../docs/packages/index.md');

// Function to read the package.json and extract the version
const getPackageVersion = packagePath => {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || 'Unknown';
  }
  return 'Not found';
};

// Main function to update the index.md file
const updateDocsIndex = () => {
  const badgeRegex = /<Badge type="info" text=".*?" \/>/g;

  // Read the current index.md content
  const indexContent = fs.readFileSync(docsIndexPath, 'utf-8');

  // Get all subdirectories in the packages directory
  const packages = fs
    .readdirSync(packagesDir)
    .filter(pkg => fs.statSync(path.join(packagesDir, pkg)).isDirectory());

  // Build the updated content
  const updatedContent = indexContent.replace(badgeRegex, (match, offset, string) => {
    // Find the package name from the surrounding text
    const beforeBadge = string.slice(0, offset);
    const packageMatch = /## ([\w\-@/]+)/.exec(beforeBadge);

    if (packageMatch) {
      const packageName = packageMatch[1].replace('@geins/', '');
      const packagePath = path.join(packagesDir, packageName);
      const version = getPackageVersion(packagePath);
      return `<Badge type="info" text="${version}" />`;
    }
    return match;
  });

  // Write the updated content back to the index.md
  fs.writeFileSync(docsIndexPath, updatedContent, 'utf-8');
  console.log('Updated docs/packages/index.md with correct package versions.');
};

// Run the update
updateDocsIndex();
