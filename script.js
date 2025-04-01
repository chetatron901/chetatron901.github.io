const canvas = document.getElementById('worldCanvas');
const ctx = canvas.getContext('2d');
const worldDataText = document.getElementById('worldData');
const cubeTypeSelect = document.getElementById('cubeType');

let world = []; // Array to store cube data: {x, y, type}
const cubeSize = 40; // Size of each cube in pixels

// World boundaries
const worldWidth = 240;
const worldHeight = 180;

// Calculate grid dimensions
const gridWidth = (worldWidth * 2) / cubeSize;
const gridHeight = (worldHeight * 2) / cubeSize;

//Adjust canvas size to match the new cube size.
canvas.width = gridWidth * cubeSize;
canvas.height = gridHeight * cubeSize;

function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw grid lines
    for (let x = 0; x <= gridWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cubeSize, 0);
        ctx.lineTo(x * cubeSize, canvas.height);
        ctx.strokeStyle = 'lightgray';
        ctx.stroke();
    }
    for (let y = 0; y <= gridHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cubeSize);
        ctx.lineTo(canvas.width, y * cubeSize);
        ctx.strokeStyle = 'lightgray';
        ctx.stroke();
    }

    world.forEach(cube => {
        let color = 'gray'; // Default color
        if (cube.type === 1) {
            color = 'green'; // Grass
        } else if (cube.type === 2) {
            color = 'syrup'; // Dirt
        } else if (cube.type === 3) {
            color = 'darkgray'; // stone
        }

        ctx.fillStyle = color;
        ctx.fillRect(cube.x * cubeSize, cube.y * cubeSize, cubeSize, cubeSize);
        ctx.strokeRect(cube.x * cubeSize, cube.y * cubeSize, cubeSize, cubeSize); // Outline
    });
}

function addCube(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const gridX = Math.floor(mouseX / cubeSize);
    const gridY = Math.floor(mouseY / cubeSize);
    const type = parseInt(cubeTypeSelect.value);

    // Eraser functionality
    if (type === 0) {
        const existingCubeIndex = world.findIndex(cube => cube.x === gridX && cube.y === gridY);
        if (existingCubeIndex !== -1) {
            world.splice(existingCubeIndex, 1); // Remove the cube
            drawWorld();
        }
        return; // Don't add a new cube
    }

    // Check if a cube already exists at this location
    const existingCubeIndex = world.findIndex(cube => cube.x === gridX && cube.y === gridY);
    if (existingCubeIndex === -1) {
        world.push({ x: gridX, y: gridY, type });
        drawWorld();
    } else { // if a cube exist, replace it.
        world[existingCubeIndex] = { x: gridX, y: gridY, type};
        drawWorld();
    }
}

function saveWorld() {
    let worldString = "";
    world.forEach(cube => {
        worldString += `${cube.x},${cube.y},${cube.type};`;
    });
    worldDataText.value = worldString;
}

function loadWorld() {
    const worldString = worldDataText.value;
    const cubeStrings = worldString.split(';');
    world = []; // Clear the current world

    cubeStrings.forEach(cubeString => {
        if (cubeString) {
            const parts = cubeString.split(',');
            if (parts.length === 3) {
                const x = parseInt(parts[0]);
                const y = parseInt(parts[1]);
                const type = parseInt(parts[2]);
                world.push({ x, y, type });
            }
        }
    });
    drawWorld();
}

canvas.addEventListener('click', addCube); // Add click event listener
drawWorld(); // Initial draw
