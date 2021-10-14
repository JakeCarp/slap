console.log('hello from game.js');

let player = {
    defeatedMon: [],
    pokemon: [
        {
            name: 'Pikachu',
            owner: 'player',
            imgURL: 'https://secure.img1-fg.wfcdn.com/im/77981853/resize-h755-w755%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg',
            hp: 100,
            defeated: false,
            attacks: [
                {
                    name: 'Thunder',
                    dmg: 48
                },
                {
                    name: 'Quick Attack',
                    dmg: 48
                },
                {
                    name: 'Headbutt',
                    dmg: 15
                }
            ],
            speed: 50
        },
        {
            name: 'Bulbasaur',
            owner: 'player',
            imgURL: 'https://www.pokemonget.eu/shop/155-large_default/bulbasaur-6-ivs-shiny.jpg',
            hp: 100,
            defeated: false,
            attacks: [
                {
                    name: 'Thunder',
                    dmg: 48
                },
                {
                    name: 'Quick Attack',
                    dmg: 48
                },
                {
                    name: 'Headbutt',
                    dmg: 15
                }
            ],
            speed: 50
        }
    ],
    defeated: false
}
let cpu = {
    defeatedMon: [],
    pokemon: [
        {
            name: 'Bulbasaur',
            owner: 'cpu',
            imgURL: 'https://www.pokemonget.eu/shop/155-large_default/bulbasaur-6-ivs-shiny.jpg',
            hp: 100,
            defeated: false,
            attacks: [
                {
                    name: 'Thunder',
                    dmg: 48
                },
                {
                    name: 'Quick Attack',
                    dmg: 48
                },
                {
                    name: 'Headbutt',
                    dmg: 15
                }
            ],
            speed: 50
        }
    ],
    defeated: false
}
let activeMons = []

function update() {
    let playerMonDefeated = false
    if (cpu.defeated) {
        document.getElementById('end-game').innerHTML = `
        <h2> You WIN </h2>
        `
        return
    }
    if (player.defeated) {
        document.getElementById('end-game').innerHTML = `
        <h2> You LOSE </h2>
        `
        return
    }

    activeMons.forEach(a => {
        if (a.defeated) {
            if (a.owner == 'player') {
                playerMonDefeated = true
            }
            activeMons = activeMons.filter(m => m.defeated = false)
            activeMons.push(cpu.pokemon[0])
        }
    })

    if (!playerMonDefeated) {
        if (activeMons.length > 0) {

            activeMons.forEach(a => {
                let targetElem = ''
                let activeTemplate = ``
                a.owner == 'player' ? targetElem = 'player' : targetElem = 'cpu'
                activeTemplate = `
                <div class="card">
                <img class="card-img-top" src="${a.imgURL}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${a.name}</h5>
                <h6>HP: ${a.hp}</h6>
                <div id="${a.name}-attk"></div>
                <div id="change-${a.owner}"></div>
                </div>
                </div>
                `
                document.getElementById(`${targetElem}-mon`).innerHTML = activeTemplate
                if (targetElem == 'player') {
                    document.getElementById(`change-${targetElem}`).innerHTML = `
                    <button onclick="changeMon()">Change</button>
                    `
                }
                let attackTemplate = ``
                a.attacks.forEach(attk => {
                    attackTemplate += `
                    <button onclick="attk('${a.owner}','${attk.name}')" class="btn btn-primary">${attk.name}</button>
                    `
                })
                document.getElementById(`${a.name}-attk`).innerHTML = attackTemplate
            })
        } else {

            let selectionTemplate = ``
            player.pokemon.forEach(p => {
                selectionTemplate += `
                <button onclick="selectMon('${p.name}')">${p.name}</button>
                `
            })
            document.getElementById('player-mon').innerHTML = selectionTemplate
        }

    } else {

        let selectionTemplate = ``
        player.pokemon.forEach(p => {
            selectionTemplate += `
                <button onclick="selectMon('${p.name}')">${p.name}</button>
                `
        })
        document.getElementById('player-mon').innerHTML = selectionTemplate
    }
}
function changeMon() {
    let selectionTemplate = ``
    player.pokemon.forEach(p => {
        selectionTemplate += `
            <button onclick="selectMon('${p.name}')">${p.name}</button>
            `
    })
    document.getElementById('player-mon').innerHTML = selectionTemplate
}
function selectMon(name) {
    //Push player selection
    let selectedMon = player.pokemon.find(a => a.name == name)
    activeMons.push(selectedMon)
    //make CPU selection
    let cpuNum = cpu.pokemon.length
    activeMons.push(cpu.pokemon[cpuSelection(cpuNum)])
    update()
}

function cpuSelection(max) {
    return Math.floor(Math.random() * max)
}

function attk(owner, attkname) {
    let playerMon = activeMons.find(a => a.owner == owner)
    let cpuMon = activeMons.find(a => a.owner != owner)
    //chose CPU move
    let cpuMove = cpuMon.attacks[cpuSelection(cpuMon.attacks.length)]
    //chose player move
    let playerMove = playerMon.attacks.find(a => a.name == attkname)
    //print play by play to console
    console.log(`${playerMon.name} used ${attkname}`)
    console.log(`${cpuMon.name} used ${cpuMove.name}`);


    //compare Mon Speeds and subtract dmg from HP
    if (playerMon.speed >= cpuMon.speed) {
        cpuMon.hp -= playerMove.dmg
        if (cpuMon.hp <= 0) {
            cpuMon.defeated = true
            cpu.pokemon = cpu.pokemon.filter(p => p.defeated == false)
            cpu.defeatedMon.push(cpuMon)
            if (cpu.pokemon.length === 0) {
                cpu.defeated = true
            }
            update()
        } else {
            playerMon.hp -= cpuMove.dmg
            if (playerMon.hp <= 0) {
                playerMon.defeated = true
                player.pokemon = player.pokemon.filter(p => p.defeated == false)
                player.defeatedMon.push(playerMon)
                update()
                player.defeatedMon.push(playerMon)
                if (player.pokemon.length === 0) {
                    player.defeated = true
                }
            }
        }
    } else {
        playerMon.hp -= cpuMove.dmg
        if (playerMon.hp <= 0) {
            playerMon.defeated = true
            player.pokemon = player.pokemon.filter(p => p.defeated == false)
            player.defeatedMon.push(playerMon)
            update()
        } else {
            cpuMon.hp -= playerMove.dmg
            if (cpuMon.hp <= 0) {
                cpuMon.defeated = true
                cpu.pokemon = cpu.pokemon.filter(p => p.defeated == false)
                cpu.defeatedMon.push(cpuMon)
                update()
            }
        }
    }
    update()
}

update()
