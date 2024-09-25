const fs = require('fs');
const path = require('path');

// Path to your original schema file
const schemaPath = path.resolve(__dirname, '../schemas/schema.graphql');

// Path to save the new schema with updated comments
const newSchemaPath = path.resolve(
  __dirname,
  '../schemas/schema-w-docblocks.graphql',
);

// Function to convert single-line comments (#) to triple quotes (""")
function convertCommentsToDocBlocks(content) {
  // Use a regular expression to match indented or non-indented single-line comments
  // Capture the indentation (if any) and keep it in the replacement
  return content.replace(/^(\s*)# (.*)$/gm, '$1"""$2"""');
}

// Read the original schema file
fs.readFile(schemaPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the schema file:', err);
    return;
  }

  // Replace comments with doc blocks
  const updatedSchema = convertCommentsToDocBlocks(data);

  // Write the updated schema to a new file
  fs.writeFile(newSchemaPath, updatedSchema, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the updated schema:', err);
      return;
    }

    console.log(
      `Schema with doc blocks saved successfully as ${newSchemaPath}`,
    );
  });
});
