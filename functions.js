// import { rmSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

// Fetch Pokemon by name
export const fetchPokemon = async pokeName => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
  const json = await response.json();
  return json;
};

export const createFolder = async folderName => {
  const folderPath = path.join(process.cwd(), folderName);

  try {
    // If the file already exits
    await fs.access(folderPath);
    console.log(`Folder ${folderName} was added`);
    console.log('File already exited so that got added to that folder');
  } catch (error) {
    // Create new folder otherwise
    await fs.mkdir(folderPath);
    console.log('A new folder was created');
  }
};

export const saveImage = async (filePath, arrayBuffer) => {
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
};

export const saveTextStats = async (filePath, textStats) => {
  await fs.writeFile(filePath, textStats);
};

// create artwork images

export const artworkImage = async (folderName, promiseArtwork) => {
  let artworkKey = [];
  let artworkUrl = [];
  console.log();
  const artWork = promiseArtwork.sprites.other['official-artwork'];
  for (const [key, url] of Object.entries(artWork)) {
    artworkUrl.push(fetch(url).then(res => res.arrayBuffer()));
    artworkKey.push(key);

    artworkUrl = await Promise.all(artworkUrl);
    await createFolder(folderName);
    for (let i = 0; i < artworkUrl.length; i++) {
      // create folder and png for all the images promisename[i]
      const filePath = path.join(
        process.cwd(),
        folderName,
        `${artworkKey[i]}.png`
      );

      await saveImage(filePath, artworkUrl[i]);
    }
  }
};

export const createStatText = async (folderName, pokemonObject) => {
  const arrChochies = [];

  for (const item of pokemonObject) {
    arrChochies.push(`${item.stat.name}: ${item.base_stat}`);
  }
  const filePath = path.join(process.cwd(), folderName, `stats.txt`);

  const value = arrChochies.join('\n');

  await saveTextStats(filePath, value);
};

export const spritesImages = async (folderName, promiseSprites) => {
  let promisesSpritesArray = [];
  let promiseName = [];

  for (const [name, url] of Object.entries(promiseSprites)) {
    if (!url) continue;
    if (name === 'other' || name === 'versions') continue;

    promisesSpritesArray.push(fetch(url).then(res => res.arrayBuffer()));
    promiseName.push(name);
  }

  promisesSpritesArray = await Promise.all(promisesSpritesArray);
  await createFolder(folderName);
  for (let i = 0; i < promisesSpritesArray.length; i++) {
    // create folder and png for all the images promisename[i]
    const filePath = path.join(
      process.cwd(),
      folderName,
      `${promiseName[i]}.png`
    );

    await saveImage(filePath, promisesSpritesArray[i]);
  }
};
