const { Pokemon, Types } = require("../db");
const { getAllInfo, guardoEnDb, tiposEnDb } = require("./Utils");

const getPokemon = async (req, res) => {
  try {
    const { name } = req.query;
    let todaLaInfo = await getAllInfo();
    console.log("get Pokemon entre");
    if (name) {
      const pokemonName = await todaLaInfo.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      pokemonName.length
        ? res.status(200).send(pokemonName)
        : res.status(404).send("Pokemon no encontrado.");
    } else {
      res.status(200).send(todaLaInfo);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const getPokemonId = async (req, res) => {
  try {
    const { id } = req.params;
    const unPokemon = await getAllInfo();
    if (id) {
      let pokemonId = await unPokemon.filter((el) => el.id == id);
      pokemonId.length
        ? res.status(200).json(pokemonId)
        : res.status(404).send("Pokemon no encontrado");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const getTypes = async (req, res) => {
  try {
    await guardoEnDb();
    let tipos = await tiposEnDb();
    tipos = tipos.map((t) => {
      return t.name;
    });
    res.send(tipos);
  } catch (error) {
    console.log(error);
  }
};

const postPokemon = async (req, res) => {
  try {
    const {
      name,
      life,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
      img,
      createdInDb,
    } = req.body;
    const nuevoPoke = await Pokemon.create({
      name,
      life,
      attack,
      defense,
      speed,
      height,
      weight,
      img,
      createdInDb,
    });
    let tiposDesdeDb = await Types.findAll({
      where: { name: types },
    });
    nuevoPoke.addTypes(tiposDesdeDb);
    res.status(201).send("Pokemon Creado Exitosamente");
    return nuevoPoke;
  } catch (err) {
    res.status(400).send(err);
  }
};

const borroPokemon = async (req, res) => {
  try {
    const { id } = req.params;
    let pokeDelete = await Pokemon.findByPk(id);
    if (id) {
      await pokeDelete.destroy();
      return res.status(200).send("pokemon eliminado");
    }
    res.status(404).send("Pokemon no encontrado");
  } catch (error) {
    console.log("este es el error", error);
  }
};

module.exports = {
  getPokemon,
  getPokemonId,
  getTypes,
  postPokemon,
  borroPokemon,
};
