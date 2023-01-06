const { Router } = require("express");
// Importar todos los routers;
//Ejemplo: const authRouter = require('./auth.js');

const router = Router();

const {
  getPokemon,
  getPokemonId,
  getTypes,
  postPokemon,
  borroPokemon,
} = require("./Pokemons");

router.get("/pokemons", getPokemon);

router.get("/pokemons/:id", getPokemonId);

router.get("/types", getTypes);

router.post("/pokemon", postPokemon);

router.delete("/pokemons/:id", borroPokemon);

// Configurar los routers
module.exports = router;
