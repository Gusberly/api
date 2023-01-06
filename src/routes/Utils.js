const axios = require("axios");
const { Pokemon, Types } = require("../db");

const getApiInfo = async () => {
  try {
    const pokeUrl = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=40"
    );
    const pokeUrls = pokeUrl.data.results.map((e) => axios.get(e.url));
    const allPokeUrls = await axios.all(pokeUrls);
    const pokemon = allPokeUrls.map((p) => {
      return {
        id: p.data.id,
        name: p.data.name,
        life: p.data.stats[0].base_stat,
        attack: p.data.stats[1].base_stat,
        defense: p.data.stats[2].base_stat,
        speed: p.data.stats[5].base_stat,
        height: p.data.height,
        weight: p.data.weight,
        types: p.data.types.map((e) => e.type.name),
        img: p.data.sprites.other.dream_world.front_default,
      };
    });
    return pokemon;
  } catch (err) {
    console.log(err);
  }
};

const getDbInfo = async () => {
  try {
    return await Pokemon.findAll({
      include: {
        model: Types,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllInfo = async () => {
  let apiInfo = await getApiInfo();
  let dbInfo1 = await getDbInfo();
  let dbInfo2 = await dbInfo1.map((el) => {
    console.log("db info", el);
    return {
      id: el.id,
      name: el.name,
      life: el.life,
      attack: el.attack,
      defense: el.defense,
      speed: el.speed,
      height: el.height,
      weight: el.weight,
      types:
        el.types.length === 1
          ? [el.types[0].name]
          : [el.types[0].name, el.types[1].name],
      img: el.img,
    };
  });
  let allInfo = apiInfo.concat(dbInfo2);
  return allInfo;
};

const guardoEnDb = async () => {
  try {
    const apiTipos = await axios.get("https://pokeapi.co/api/v2/type");
    const tipos = apiTipos.data.results.map((e) => {
      return { name: e.name };
    });
    const tiposFinal = tipos.map((e) => e.name);

    tiposFinal.forEach((e) => {
      Types.findOrCreate({
        where: { name: e },
      });
    });
    const todosLosTipos = Types.findAll();
    return todosLosTipos;
  } catch (error) {
    console.log(error);
  }
};

const tiposEnDb = async () => {
  try {
    let tiposEnDb = await Types.findAll();
    return tiposEnDb;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getApiInfo,
  getDbInfo,
  getAllInfo,
  guardoEnDb,
  tiposEnDb,
};
