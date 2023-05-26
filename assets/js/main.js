const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const section1 = document.getElementById('section1')
const section2 = document.getElementById('section2')
const returnButton = document.getElementById('return-button')
const cardTop = document.getElementById('card-top')
const pokeImageSection2 = document.getElementById('pokemon-img')
const cardBottom = document.getElementById('card-bottom')

const maxRecords = 151
const limit = 10
let offset = 0;
let currentTab = 1

function convertPokemonToLi(pokemon) {
    return `
        <button class="pokemon ${pokemon.type} pokemonButton" data-position=${pokemon.number}>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type} " >${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </button>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    }).then(()=>{
        const pokemonButton = document.querySelectorAll('.pokemonButton')
        if(pokemonButton){
            pokemonButton.forEach(p=>addPokemonButtonListener(p))
        }
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

returnButton.addEventListener('click', ()=>{
    currentTab=1
    section2Fade('out')
})

function addPokemonButtonListener(pokemonButton){
   pokemonButton.addEventListener('click', ()=>{
    pokeApi.getOnePokemon(pokemonButton.dataset.position).then((pokemon)=>{

        cardTop.innerHTML=
        `                        
            <div class="name-and-tags">
                <h2 class="white-text">${pokemon.name}</h2>
                <div class="tags">
                    ${pokemon.types.map((type) => `<p class="type ${type} " >${type}</p>`).join('')}
                </div>    
            </div>
            <div>
                <p class="white-text">#${pokemon.number}</p>
            </div>`
        pokeImageSection2.innerHTML =`
            <img src="${pokemon.photo}" alt="${pokemon.name}">                        
        `
        cardBottom.innerHTML=fillCardBottom(pokemon)
        section2.classList.add(pokemon.type)
        section2Fade("in")
        section1.classList.add("hide")
    }).then(()=>{
        const tab1 = document.getElementById('card-buttom-tab-1')
        const tab2 = document.getElementById('card-buttom-tab-2')
        const about = document.getElementById('card-bottom-about')
        const stats = document.getElementById('card-bottom-stats')

        tab1.addEventListener('click', ()=>{
            modifyTabvisibility(tab1, tab2, about, stats, 1)
        })
        tab2.addEventListener('click', ()=>{
            modifyTabvisibility(tab1, tab2, about, stats, 2)
        })
    })
   })
}

function section2Fade(inOrOut){
    let op
    if(inOrOut=='in'){
        op=0.1
        section2.classList.remove('hide')
    }
    else{
        op=1
    }

    var timer = setInterval(function () {
        if (inOrOut=='in' && op >= 1){clearInterval(timer);}
        else if(inOrOut=='out' && op <= 0.1) {
            clearInterval(timer);
            section2.classList.add('hide')
            section1.classList.remove('hide')
            cardTop.innerHTML=""
            pokeImageSection2.innerHTML=""
            cardBottom.innerHTML=""
        }

        section2.style.opacity = op;
        section2.style.filter = 'alpha(opacity=' + op * 100 + ")";
        inOrOut=='in'?op += op * 0.1:op -= op * 0.1
    }, 20);
}

function modifyTabvisibility(tab1, tab2, about, stats, tabNumber){
    if(currentTab!=tabNumber){
        currentTab=tabNumber
        tab1.classList.toggle('card-bottom-buttons-selected')
        tab2.classList.toggle('card-bottom-buttons-selected')
        about.classList.toggle('hide')
        stats.classList.toggle('hide')
    }
}

function fillCardBottom(pokemon){
    return `  
        <div class="card-bottom-buttons">
            <button class="card-bottom-buttons-selected" id="card-buttom-tab-1">About</button>
            <button id="card-buttom-tab-2">Base Stats</button>
        </div>
        <table class="about" id="card-bottom-about">
            <tr>
                <td class="td-1">Species</td>
                <td class="capitalize"> ${pokemon.species}</td>
            </tr>
            <tr>
                <td class="td-1">Base Experience</td>
                <td> ${pokemon.base_experience}</td>
            </tr>
            <tr>
                <td class="td-1">Height</td>
                <td> ${pokemon.height} cm</td>
            </tr>
            <tr>
                <td class="td-1">Weight</td>
                <td> ${pokemon.weight}kg (${(pokemon.weight/2.2).toFixed(1)} lbs.)</td>
            </tr>
            <tr>
                <td class="td-1">Abilities</td>
                <td> ${pokemon.abilities}</td>
            </tr>
        </table>
        <table class="stats hide" id="card-bottom-stats">
            <tr>
                <td class="td-1">HP</td>
                <td>${pokemon.base_stats.hp}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                        <div class="${pokemon.base_stats.hp>=50?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.hp}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="td-1">Attack</td>
                <td>${pokemon.base_stats.attack}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                        <div class="${pokemon.base_stats.attack>=50?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.attack}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="td-1">Defence</td>
                <td>${pokemon.base_stats.defense}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                    <div class="${pokemon.base_stats.defense>=50?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.defense}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="td-1">Sp. Atk</td>
                <td>${pokemon.base_stats.specialAttack}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                    <div class="${pokemon.base_stats.specialAttack>=50?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.specialAttack}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="td-1">Sp. Def</td>
                <td>${pokemon.base_stats.specialDefense}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                    <div class="${pokemon.base_stats.specialDefense>=50?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.specialDefense}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="td-1">Speed</td>
                <td>${pokemon.base_stats.speed}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                        <div class="${pokemon.base_stats.speed>=50?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.speed}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="td-1">Total</td>
                <td>${pokemon.base_stats.total}</td>
                <td aria-disabled="true" class="reference-bar">
                    <div class="reference-bar-div">
                    <div class="${pokemon.base_stats.total>=300?'green-bar':'red-bar'}" style="width: ${pokemon.base_stats.total/6}%"></div>
                    </div>
                </td>
            </tr>
        </table>
        `
}
