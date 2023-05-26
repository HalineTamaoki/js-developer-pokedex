
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getOnePokemon = (pokemonId) =>{

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`

    return fetch(url)
        .then((response)=>response.json())
        .then(sendOnePokemonResponse)
}

function sendOnePokemonResponse(pokeDetail){
    let abilityString = ''
    pokeDetail.abilities.forEach(ability => {
        abilityString+=(ability.ability.name.substring(0,1).toUpperCase() + ability.ability.name.substring(1,ability.ability.name.length) + ", ")
    });

    let statSum = 0
    pokeDetail.stats.forEach(s=>{
        statSum+=parseInt(s.base_stat) 
    })

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    
    return pokemon={
        number: pokeDetail.id,
        name: pokeDetail.name,
        type: type,
        types: types,
        photo: pokeDetail.sprites.other.dream_world.front_default,
        species: pokeDetail.species.name,
        height: pokeDetail.height/10,
        weight: pokeDetail.weight/10,
        base_experience:pokeDetail.base_experience,
        abilities: abilityString.substring(0,abilityString.length-2),
        base_stats: {
            hp: pokeDetail.stats[0].base_stat,
            attack: pokeDetail.stats[1].base_stat,
            defense: pokeDetail.stats[2].base_stat,
            specialAttack: pokeDetail.stats[3].base_stat,
            specialDefense: pokeDetail.stats[4].base_stat,
            speed: pokeDetail.stats[5].base_stat,
            total: statSum
        }
    }
}