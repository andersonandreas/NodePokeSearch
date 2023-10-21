import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import {
  fetchPokemon,
  createFolder,
  spritesImages,
  createStatText,
  artworkImage,
} from './functions.js';

console.log(
  '----------------------------POKEMON------------------------------'
);

const promptForPokemonInfo = async () => {
  return await inquirer.prompt({
    type: 'input',
    name: 'pokemon_name',
    message: 'Pokemon name: ',
    validate: function (input) {
      if (!input) {
        return 'Enter a name';
      }
      return true;
    },
  });
};

// checkbox giving back choicee from the user
const promptForDownloadInfo = async () => {
  return await inquirer.prompt({
    type: 'checkbox',
    name: 'options',
    message: 'Pokemon info to download: ',
    choices: [
      new inquirer.Separator('-- Options --'),
      {
        name: 'Stats',
      },
      {
        name: 'Sprites',
      },
      {
        name: 'Artwork',
      },
    ],
  });
};

const promptToContinueInfo = async () => {
  return await inquirer.prompt({
    type: 'list',
    message: 'Would you like to search for another pokemon?',
    name: 'continue',
    choices: ['Yes', 'No'],
  });
};

const promtAndFetch = async () => {
  while (true) {
    const promtPokemon = await promptForPokemonInfo();
    const promtDownload = await promptForDownloadInfo();
    const fetchPokemonObject = await fetchPokemon(promtPokemon.pokemon_name);

    if (promtDownload.options.includes('Stats')) {
      await createFolder(promtPokemon.pokemon_name);
      await createStatText(promtPokemon.pokemon_name, fetchPokemonObject.stats);
    }

    if (promtDownload.options.includes('Sprites')) {
      await spritesImages(
        promtPokemon.pokemon_name,
        fetchPokemonObject.sprites
      );
    }

    if (promtDownload.options.includes('Artwork')) {
      await artworkImage(promtPokemon.pokemon_name, fetchPokemonObject);
    }

    const promptToCont = await promptToContinueInfo();
    // Breakar loopen
    if (promptToCont.continue === 'No') {
      break;
    }
  }
};

promtAndFetch();

// const array = ['stats', 'sprites'];

// let [stats, sprites, artwork] = array;

// console.log(artwork ?? 'Nothing to see!');

// if (choices === 'stats,sprites') {
//   await createFolder(namePoke);
//   await createStatText(pathToContent, value);
//   const urlImg = await createImgPokemon(namePoke);
//   await dowload(namePoke, urlImg);
// } else if (choices === 'stats') {
//   await createFolder(namePoke);
//   await createStatText(pathToContent, value);
// } else if (choices === 'sprites') {
//   await createFolder(namePoke);
//   const urlImg = await createImgPokemon(namePoke);
//   // const urlImg = await getValueImages(namePoke);

//   await dowload(namePoke, urlImg);
// } else {
//   console.log('Nothing to search for..');
// }
