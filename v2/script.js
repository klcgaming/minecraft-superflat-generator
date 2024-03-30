alert("hello");
function generateDatapack() {
  const presetInput = document.getElementById('presetInput');
  const generatedCommands = document.getElementById('generatedCommands');
  const blockTexturesContainer = document.getElementById('blockTextures');
  const liveJsonPreview = document.getElementById('liveJsonPreview');

  blockTexturesContainer.innerHTML = ''; // Clear previous block textures

  try {
    const presetCode = JSON.parse(presetInput.value.trim());
    
    const datapackName = 'custom_datapack';
    let commands = [];

    // Generate commands based on preset settings
    const layers = presetCode.settings.layers;
    for (const layer of layers) {
      const block = layer.block;
      const height = layer.height;
      const fillCommand = `fill ~ ~-${height + 1} ~ ~ ~ ~ ${block}`;
      commands.push(fillCommand);

      // Display block texture
      displayBlockTexture(block, blockTexturesContainer);
    }

    // Generate structure spawning commands
    const structures = presetCode.settings.structure_overrides;
    for (const structure of structures) {
      const locateCommand = `execute as @a at @s run locate ${structure}`;
      commands.push(locateCommand);
    }

    // Read the template code from the JSON file
    const templateFilePath = 'emptycode.json'; // Adjust file path as needed
    const templateFileContent = readTemplateFile(templateFilePath);

    // Merge template code with generated commands
    const functionCommands = mergeCommands(templateFileContent, commands);

    // Create the datapack folder structure and store commands in a function file
    const functionPath = `${datapackName}/data/minecraft/functions/custom_functions.mcfunction`;
    writeFunctionFile(functionPath, functionCommands);

    // Display the generated commands and live JSON preview
    generatedCommands.value = functionCommands;
    liveJsonPreview.value = JSON.stringify(JSON.parse(functionCommands), null, 2); // Pretty-print JSON
  } catch (error) {
    generatedCommands.value = 'Error: Invalid preset code!';
    liveJsonPreview.value = 'Error: Invalid preset code!';
  }
}

function readTemplateFile(filePath) {
  // Here you would implement code to read the file content from 'filePath'
  // For simplicity in this example, we assume the file content directly
  const templateContent = {
    "display": "minecraft:glass",
    "settings": {
      // Add relevant settings from the JSON file here
    }
  };
  return templateContent;
}

function mergeCommands(templateContent, commands) {
  // Merge the template code with the generated commands
  const mergedContent = {
    ...templateContent,
    // Merge specific settings or commands here
    "generated_commands": commands
  };
  return JSON.stringify(mergedContent, null, 2); // Pretty-print JSON
}

function writeFunctionFile(filePath, content) {
  // Here you would implement code to write 'content' to 'filePath'
  // For simplicity in this example, we log the content to console
  console.log(`Writing content to file '${filePath}':\n${content}`);
}

function displayBlockTexture(block, container) {
  // Create an image element for the block texture
  const blockTextureImg = document.createElement('img');
  blockTextureImg.src = `img/${block}.png`; // Assuming block textures are named accordingly

  // Add CSS class to style the block icon
  blockTextureImg.classList.add('block-icon');

  // Append the image to the specified container
  container.appendChild(blockTextureImg);
}
