let DELETE_ENTITY_CONFIRM_OPTION = true;
let MULTIPLE_ENTITY_INITIATIVE_DRAW_OPTION = true;
let MULTIPLE_ENTITY_VARIATE_STATS = true;
let MODIFIER_PROMPT_OPTION = true;
let DEFAULT_ENTITY_COLOR = "#f7a308";
SettingsSetup();

let DATA = [];

let dataFileNames = [
    "chaosMutations.json",
    "drunkEffects.json",
    "effectMatrix.json",
    "fightEntitiesTemplates.json",
    "hitMatrix.json",
    "movementValues.json",
    "hitLocations.json"
];

// Get data from data.json
var xmlhttp = new XMLHttpRequest();
dataFileNames.forEach(fileName => {
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            DATA.push(JSON.parse(this.responseText));
        }
    };
    
    xmlhttp.open("GET", "./data/" + fileName, false);
    xmlhttp.send();
});

let randomizer = new Randomizer(100, 20);

let chaosMutations = DATA[0];

let drunkEffects = DATA[1];

let effectMatrix = DATA[2];

let fightEntitiesTemplates = DATA[3];

let hitMatrix = DATA[4];

let movementValues = DATA[5];

let hitLocations = DATA[6];

console.log(hitLocations);

//-----------------------------------------------------

let fightEntities = [];

let select_template_elem = document.getElementById("fight_entity_template_select");

let fight_organizer_input_elements = {
    name: document.getElementById("fight_organizer_input_name"),
    ww: document.getElementById("fight_organizer_input_ww"),
    us: document.getElementById("fight_organizer_input_us"),
    k: document.getElementById("fight_organizer_input_k"),
    odp: document.getElementById("fight_organizer_input_odp"),
    zr: document.getElementById("fight_organizer_input_zr"),
    int: document.getElementById("fight_organizer_input_int"),
    sw: document.getElementById("fight_organizer_input_sw"),
    ogd: document.getElementById("fight_organizer_input_ogd"),
    hp: document.getElementById("fight_organizer_input_hp"),
    initiative: document.getElementById("fight_organizer_input_initiative"),
    dmg: document.getElementById("fight_organizer_input_dmg"),
    notes: document.getElementById("fight_organizer_input_notes"),
    color: document.getElementById("color_input")
}

let baseStats = [
    "ww",
    "us",
    "k",
    "odp",
    "zr",
    "int",
    "sw",
    "ogd",
];

// Fill select with fight_entities_templates names
fightEntitiesTemplates.forEach(function (object) {
    let option = document.createElement("option");
    option.value = object.id;
    option.innerText = object.name;
    select_template_elem.add(option);
})

let select_hit_location_entity_type = document.getElementById("hit_location_entity_type");

// Fill hit location select with entity types
hitLocations.forEach(function (object) {
    let option = document.createElement("option");
    option.value = object.id;
    option.innerText = object.name;
    select_hit_location_entity_type.add(option);
})


document.getElementById("fight_entity_template_select").addEventListener("change", populateTemplate);

function populateTemplate () {
    let selectNumber = select_template_elem.value;
    
    let fightEntity = fightEntitiesTemplates[selectNumber];
    
    fight_organizer_input_elements.name.value = fightEntity.name;
    fight_organizer_input_elements.ww.value = fightEntity.ww;
    fight_organizer_input_elements.us.value = fightEntity.us;
    fight_organizer_input_elements.k.value = fightEntity.k;
    fight_organizer_input_elements.odp.value = fightEntity.odp;
    fight_organizer_input_elements.zr.value = fightEntity.zr;
    fight_organizer_input_elements.int.value = fightEntity.int;
    fight_organizer_input_elements.sw.value = fightEntity.sw;
    fight_organizer_input_elements.ogd.value = fightEntity.ogd;
    fight_organizer_input_elements.hp.value = fightEntity.hp;
    fight_organizer_input_elements.dmg.value = fightEntity.dmg;
    fight_organizer_input_elements.notes.value = fightEntity.notes;
}

function getEffectFromObjectByRange (arrayOfObjects, number) {

    let returner = "Nie znaleziono efektu który swoim przedziałem obejmowałby tą liczbę";

    arrayOfObjects.forEach(element => {
        if (number >= element.from && number <= element.to)
            returner = element.effect;
    });

    return returner;
}

// Add reaction to inputs on enter press
for (let enterInput of document.getElementsByClassName("enter_click")) {
    enterInput.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            if (enterInput.getAttribute('name') == 0)
                ShowHitLocation("input");
                
            else if (enterInput.getAttribute("name") == 1)
                ShowDrunkEffect("input");

            else if (enterInput.getAttribute("name") == 2)
                ShowCriticalEffect("input");
        }
    });
};

function SettingsSetup () {
    let settingsIds = [
        "delete_entity_confirm",
        "modifier_prompt",
        "default_color",
        "multiple_entities_variate_stats",
        "multiple_entities_initiative_draw",
    ];

    settingsIds.forEach(id => {
        let settingsElem = document.getElementById(id);

        SettingsUpdateCheck(settingsElem);
    });
}

function SettingsUpdateCheck (checkboxElem) {
    console.log("Settings change... ", checkboxElem.id, checkboxElem.checked);
    switch (checkboxElem.id) {
        case "delete_entity_confirm":
            if (checkboxElem.checked)
                DELETE_ENTITY_CONFIRM_OPTION = true;
            else
                DELETE_ENTITY_CONFIRM_OPTION = false;
        break;

        case "modifier_prompt":
            if (checkboxElem.checked)
                MODIFIER_PROMPT_OPTION = true;
            else
                MODIFIER_PROMPT_OPTION = false;
        break;

        case "default_color":
            DEFAULT_ENTITY_COLOR = document.getElementById("default_color").value;
            console.log(DEFAULT_ENTITY_COLOR);
        break;

        case "multiple_entities_variate_stats":
            if (checkboxElem.checked)
                MULTIPLE_ENTITY_INITIATIVE_DRAW_OPTION = true;
            else
                MULTIPLE_ENTITY_INITIATIVE_DRAW_OPTION = false
        break;

        case "multiple_entities_initiative_draw":
            if (checkboxElem.checked)
                MULTIPLE_ENTITY_INITIATIVE_DRAW_OPTION = true;
            else
                MULTIPLE_ENTITY_INITIATIVE_DRAW_OPTION = false;
        break;
    }
}

function ShowHitLocation(type) {
    if (type != "random" && type != "input") {
        console.log("error!");
        return 0;
    }

    let outputElem = document.getElementById("hit_location_output");
    let inputElem = document.getElementById("hit_location_input");
    let input = inputElem.value;
    let entityTypeElem = document.getElementById("hit_location_entity_type");
    let entityType = entityTypeElem.options[entityTypeElem.selectedIndex].value;

    // User asked about computed random number hit location
    if (type == "random") {
        let RandomNumber = GetTrueRandom(1, 100, document.getElementById("hit_location_loading_icon"));

        RandomNumber.then(function (randomNumer) {
            outputElem.innerHTML += " " + GetHitLocation(randomNumer, entityType) + "<br>";
            outputElem.scrollTop = outputElem.scrollHeight;
        }).catch(function (error) {
            window.alert("Wystąpił błąd połączenia");
        });
    }
    // User asked about inputed number hit location
    else if (type == "input") {
        if (input > 100)
            input = 100;
        else if (input < 1)
            input = 1

        console.log(outputElem.innerHTML);
        outputElem.innerHTML += GetHitLocation(inputElem.value, entityType) + "<br>";
    }

}

function ShowChaosMutation (type) {
    if (type != "random" && type != "input") {
        console.log("error!");
        return 0;
    }

    let outputElem = document.getElementById("chaos_mutation_output");
    let inputElem = document.getElementById("chaos_mutation_input");
    let input = inputElem.value;

    // User asked about computed random number hit location
    if (type == "random") {
        let RandomNumber = GetTrueRandom(1, 100, document.getElementById("chaos_mutation_loading_icon"));

        if (RandomNumber == 0) {
            console.error("Wystąpił błąd");
            return 0;
        }

        RandomNumber.then(function (randomNumer) {

            outputElem.innerHTML += "• " + getEffectFromObjectByRange(chaosMutations, randomNumer) + "<br>";
            outputElem.scrollTop = outputElem.scrollHeight;
        }).catch(function (error) {
            window.alert(error);
        });
    }
    // User asked about inputed number hit location
    else if (type == "input") {
        if (input > 100)
            input = 100;
        else if (input < 1)
            input = 1;

        outputElem.innerHTML += "• " + getEffectFromObjectByRange(chaosMutations, inputElem.value) + "<br>";
    }

}

function ShowDrunkEffect (type) {
    if (type != "random" && type != "input") {
        console.log("error!");
        return 0;
    }

    let outputElem = document.getElementById("drunk_effect_output");
    let inputElem = document.getElementById("drunk_effect_input");
    let input = inputElem.value;

    // User asked about computed random number hit location
    if (type == "random") {
        let RandomNumber = GetTrueRandom(1, 100, document.getElementById("drunk_effect_loading_icon"));

        if (RandomNumber == 0) {
            console.error("Wystąpił błąd");
            return 0;
        }

        RandomNumber.then(function (randomNumer) {
            outputElem.innerHTML += "• " + getEffectFromObjectByRange(drunkEffects, randomNumer) + "<br>";
            outputElem.scrollTop = outputElem.scrollHeight;
        }).catch(function (error) {
            window.alert(error);
        });
    }
    // User asked about inputed number hit location
    else if (type == "input") {
        if (input > 100)
            input = 100;
        else if (input < 1)
            input = 1;

        outputElem.innerHTML +=  "• " + getEffectFromObjectByRange(drunkEffects, inputElem.value) + "<br>";
    }

}

function ShowCriticalEffect(type) {
    if (type != "random" && type != "input") {
        console.log("error!");
        return 0;
    }

    let outputElem = document.getElementById("critical_effect_output");
    let inputElem = document.getElementById("critical_effect_input");
    let input = inputElem.value;

    let hitLocationElem = document.getElementById("critical_effect_hit_location");
    let hitLocation = hitLocationElem.options[hitLocationElem.selectedIndex].value;

    let plusNumberElem = document.getElementById("critical_effect_plus_number");
    let plusNumber = plusNumberElem.options[plusNumberElem.selectedIndex].value;

    console.log("Hit location: ", hitLocation);
    console.log("Plus number: ", plusNumber);
    console.log("Input: ", input);

    if (hitLocation == "disabled") {
        window.alert("Proszę podać lokację trafienia.");
        return 0;
    }

    // User asked about computed random number hit location
    if (type == "random") {
        let RandomNumber = GetTrueRandom(1, 100, document.getElementById("critical_effect_loading_icon"));

        RandomNumber.then(function (randomNumber) {
            outputElem.innerHTML += "• " + GetCriticalEffect(GetCriticalHitNumber(randomNumber, plusNumber), hitLocation) + "<br>";
            outputElem.scrollTop = outputElem.scrollHeight;
        }).catch(function (error) {
            window.alert("Wystąpił błąd połączenia.");
            console.error(error);
        });
    }
    // User asked about inputed number hit location
    else if (type == "input") {
        if (input > 100)
            input = 100;
        else if (input < 1)
            input = 1;

        outputElem.innerHTML += GetCriticalEffect(GetCriticalHitNumber(inputElem.value, plusNumber), hitLocation) + "<br>";
    }
}

async function GetTrueRandom(from = 1, to = 2, loadingIconElem = document.getElementById("trash_can"), numbersQuantity = 1, randomNumbersKeepAmount) {

    let randomReturn;

    if (!Number.isInteger(parseInt(from)) || !Number.isInteger(parseInt(to))) {
        console.log("error!", from, to);
        return 0;
    }
    
    // Start loading animation
    if (typeof loadingIconElem !== undefined)
        loadingIconElem.classList.add("loading_animation");

    if (numbersQuantity <= 1)
        randomReturn = await randomizer.getRandomNumber(from, to, randomNumbersKeepAmount);

    else {
        randomReturn = [];
        for (let i = 0; i < numbersQuantity; i++) {
            randomReturn.push(await randomizer.getRandomNumber(from, to, randomNumbersKeepAmount));
        }
    }

    // End loading animation
    if (typeof loadingIconElem !== undefined)
        loadingIconElem.classList.remove("loading_animation");

    return parseInt(randomReturn);
}

function GetHitLocation(locationNumber = 0, entityType = "default") {

    let returner = "Wystąpił błąd danych";

    hitLocations.forEach(element => {
        if (element.id == entityType) {
            element.values.forEach(value => {
                if (parseInt(locationNumber) >= parseInt(value.from) && parseInt(locationNumber) <= value.to) {
                    returner = value.effect;
                }
            });
        }
    });

    return returner;
}

function GetCriticalHitNumber(hitNumber, plusNumber) {

    if (hitNumber <= 10) return hitMatrix[0][plusNumber - 1];
    else if (hitNumber >= 11 && hitNumber <= 20) return hitMatrix[1][plusNumber - 1];
    else if (hitNumber >= 21 && hitNumber <= 30) return hitMatrix[2][plusNumber - 1];
    else if (hitNumber >= 31 && hitNumber <= 40) return hitMatrix[3][plusNumber - 1];
    else if (hitNumber >= 41 && hitNumber <= 50) return hitMatrix[4][plusNumber - 1];
    else if (hitNumber >= 51 && hitNumber <= 60) return hitMatrix[5][plusNumber - 1];
    else if (hitNumber >= 61 && hitNumber <= 70) return hitMatrix[6][plusNumber - 1];
    else if (hitNumber >= 71 && hitNumber <= 80) return hitMatrix[7][plusNumber - 1];
    else if (hitNumber >= 81 && hitNumber <= 90) return hitMatrix[8][plusNumber - 1];
    else if (hitNumber >= 91 && hitNumber <= 100) return hitMatrix[9][plusNumber - 1];
    else console.error("wystąpił błąd");
}

function GetCriticalEffect(criticalHitNumber = 1, hitLocation = 0) {
    return effectMatrix[parseInt(hitLocation)][parseInt(criticalHitNumber) - 1];
}

function ChangeToDefaultColor () {
    fight_organizer_input_elements.color.value = DEFAULT_ENTITY_COLOR;
}

function RollK100 () {
    let outputElem = document.getElementById("roll_k100_output");

    let RandomNumber = GetTrueRandom(1, 100, document.getElementById("roll_k100_loading_icon"));

    console.log(RandomNumber);

    RandomNumber.then(function (randomNumber) {
        outputElem.innerHTML += "• " + randomNumber + "<br>";
        outputElem.scrollTop = outputElem.scrollHeight;
    }).catch(function (error) {
        window.alert("Wystąpił błąd połączenia.");
    });
}

function RollK10 () {
    let outputElem = document.getElementById("roll_k10_output");
    let diceQuantity = document.getElementById("roll_k10_numbers_quantity").value;

    let RandomNumber = GetTrueRandom(1, 10, document.getElementById("roll_k10_loading_icon"), diceQuantity);

    RandomNumber.then(function (randomNumberReturn) {
        if (diceQuantity != 1) {
            outputElem.innerHTML += "• " + "Rzucono "  + diceQuantity + " kośćmi:<br>";
            randomNumberReturn.forEach(element => {
                outputElem.innerHTML += element + "<br>";
            });
        }
        else {
            outputElem.innerHTML += "• " + "Rzucono jedną kością:<br>";
            outputElem.innerHTML += randomNumberReturn + "<br>";
        }
        
        // outputElem.scrollTop = outputElem.scrollHeight;
    }).catch(function (error) {
        window.alert("Wystąpił błąd połączenia.");
        console.error(error);
    });
}

function RandomHitLocationInput() {

    let selectElem = document.getElementById("critical_effect_hit_location");

    let RandomNumber = GetTrueRandom(0, 3, document.getElementById("critical_effect_hit_location_loading_icon"));

    RandomNumber.then(function (randomNumer) {
        selectElem.value = randomNumer;
    }).catch(function (error) {
        window.alert("Wystąpił błąd połączenia");
    });
}

function RandomInitiativeInput () {
    let selectElem = fight_organizer_input_elements.initiative;
    let agility = fight_organizer_input_elements.zr.value;

    let RandomNumber = GetTrueRandom(1, 10, document.getElementById("initiative_loading_animation"));

    RandomNumber.then(function (randomNumer) {
        selectElem.value = randomNumer + parseInt(agility);
    }).catch(function (error) {
        window.alert("Wystąpił błąd połączenia");
    });
}

function AddFightEntity () {
   fightEntities.push(new FightEntity(fightEntities.length));
   
   RelocateFightEntities();
}

async function AddMultipleFightEntity () {
    let amountInput = Math.abs(parseInt(window.prompt("Podaj ilość bytów które mają zostać dodane") ?? 0));

    // Create amountInput entities
    for (let i = 0; i < amountInput; i++) {
        let fightEntity = new FightEntity(fightEntities.length);
        let fightEntityNameInput = fightEntity.NodeElements.nameInput;

        // Randomize stats
        if (MULTIPLE_ENTITY_VARIATE_STATS)
            baseStats.forEach(async stat => {
                let inputEl = fightEntity.NodeElements[stat + "Input"];
                inputEl.value = await GetRandomizedStat(parseInt(inputEl.value));
            });
            
        // Draw initiative for each entity
        if (MULTIPLE_ENTITY_INITIATIVE_DRAW_OPTION)
            fightEntity.drawInitiative();
            
        // Calculate correct name based on all entitites
        let number = 1;
        while (EntityNameExist(fightEntityNameInput.innerText + ` ${number}`)) {
            number++;
        }
        fightEntityNameInput.innerText += ` ${number}`;


        fightEntities.push(fightEntity);
    }


    RelocateFightEntities();
}

function EntityNameExist (name = "") {
    let exist = false;

    fightEntities.forEach(fightEntity => {

        if (fightEntity.NodeElements.nameInput.innerText == name)
            exist = true;
    });

    return exist;
}

// Relocate all fight entities by initiative
function RelocateFightEntities () {
    
    // Sorts array by objects initiative
    fightEntities.sort((a, b) => {
        if (parseInt(a.NodeElements.initiativeInput.value) < parseInt(b.NodeElements.initiativeInput.value))
            return -1;

        if (parseInt(a.NodeElements.initiativeInput.value) > parseInt(b.NodeElements.initiativeInput.value))
            return 1;

        return 0;
    });

    // Relocates elements based on order in array
    fightEntities.forEach(function (entity) {
        entity.CONTAINER_ELEM.appendChild(entity.ENTITY_ELEM);
    });
}

function ClearParent (object) {
    let parent = object.parentElement;
    document.body.appendChild(object);
    parent.innerText = "";
    parent.appendChild(object);
}

function RandomizeStat (inputId) {
    let statInput = document.getElementById(inputId);
    let stat = parseInt(statInput.value);

    let RandomNumber = GetTrueRandom(1, 21);

    console.log(stat, RandomNumber);

    RandomNumber.then(function (randomNumer) {
        randomNumer = parseInt(randomNumer);
        randomNumer -= 11;
        stat += randomNumer;

        statInput.value = randomNumer >= 0 ? randomNumer : 0;
    }).catch(function (error) {
        window.alert("Wystąpił błąd połączenia");
    });
}

function RandomizeAllStats () {
    baseStats.forEach(stat => {
        RandomizeStat("fight_organizer_input_" + stat);
    });
}

async function GetRandomizedStat (statValue) {
    let randomNumber = parseInt(await GetTrueRandom(1, 21));

    console.log(statValue, randomNumber);

    randomNumber -= 11;
    statValue += randomNumber;

    return randomNumer >= 0 ? randomNumer : 0;
}
    
// Has to be last line of code - convert to int on inputs change
document.querySelectorAll('input[type="number"]').forEach((element) => {
    element.addEventListener("change", function () {
        if (element.nodeType == 1)
            element.addEventListener("change", function () {
                element.value = parseInt(element.value);
            });
    });
});