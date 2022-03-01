class FightEntity {
    constructor (id) {

        let ThisVariable = this;

        this.id = id;

        this.killed = false;

        this.CONTAINER_ELEM = document.getElementById("fight_entities");
        this.TEMPLATE_ELEM = document.getElementById("fight_entity_template");

        this.ENTITY_ELEM = this.TEMPLATE_ELEM.cloneNode(true);

        this.ENTITY_ELEM_CHILD_NODES = this.ENTITY_ELEM.childNodes;
    
        this.CONTAINER_ELEM.appendChild(this.ENTITY_ELEM);

        this.ENTITY_ELEM.classList.remove("--hidden");
        this.ENTITY_ELEM.removeAttribute("id");

        this.NodeElements = {};

        this.NodeElements.nameInput = this.getChildElementByName("name");
        this.NodeElements.wwInput = this.getChildElementByName("ww");
        this.NodeElements.usInput = this.getChildElementByName("us");
        this.NodeElements.kInput = this.getChildElementByName("k");
        this.NodeElements.odpInput = this.getChildElementByName("odp");
        this.NodeElements.zrInput = this.getChildElementByName("zr");
        this.NodeElements.intInput = this.getChildElementByName("int");
        this.NodeElements.swInput = this.getChildElementByName("sw");
        this.NodeElements.ogdInput = this.getChildElementByName("ogd");
        this.NodeElements.hpInput = this.getChildElementByName("hp");
        this.NodeElements.initiativeInput = this.getChildElementByName("initiative");
        this.NodeElements.dmgInput = this.getChildElementByName("dmg");
        this.NodeElements.notesInput = this.getChildElementByName("notes");
        this.NodeElements.loadingIcon = this.getChildElementByName("loading_icon");

        this.NodeElements.killButton = this.getChildElementByName("kill");
        this.NodeElements.killIcon = this.getChildElementByName("kill_icon");

        this.NodeElements.nameInput.innerText = this.getElementById("fight_organizer_input_name").value;
        this.NodeElements.wwInput.value = this.getElementById("fight_organizer_input_ww").value;
        this.NodeElements.usInput.value = this.getElementById("fight_organizer_input_us").value;
        this.NodeElements.kInput.value = this.getElementById("fight_organizer_input_k").value;
        this.NodeElements.odpInput.value = this.getElementById("fight_organizer_input_odp").value;
        this.NodeElements.zrInput.value = this.getElementById("fight_organizer_input_zr").value;
        this.NodeElements.intInput.value = this.getElementById("fight_organizer_input_int").value;
        this.NodeElements.swInput.value = this.getElementById("fight_organizer_input_sw").value;
        this.NodeElements.ogdInput.value = this.getElementById("fight_organizer_input_ogd").value;
        this.NodeElements.hpInput.value = this.getElementById("fight_organizer_input_hp").value;
        this.NodeElements.initiativeInput.value = this.getElementById("fight_organizer_input_initiative").value;
        this.NodeElements.dmgInput.value = this.getElementById("fight_organizer_input_dmg").value;
        console.log(this.NodeElements.dmgInput.value, this.getChildElementByName("dmg").value);
        this.NodeElements.notesInput.value = this.getElementById("fight_organizer_input_notes").value;
        this.NodeElements.colorInput = this.getElementById("color_input");

        this.getChildElementByName("initiative").addEventListener("focusout", () => {
            RelocateFightEntities();
        });

        this.getChildElementByName("initiative").addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                RelocateFightEntities();
            }
        });


        for (let element in this.NodeElements) {
                if (element.type == "number")
                    element.addEventListener("change", function () {
                        element.value = parseInt(element.value);
                    });
        }

        this.getChildElementByName("dodge").addEventListener("click", function () {
            ThisVariable.rollForEntityAction(ThisVariable, ThisVariable.NodeElements.zrInput, "uniknęła!", "nie uniknęła...");
        });

        this.getChildElementByName("attack").addEventListener("click", function () {
            ThisVariable.rollForEntityAction(ThisVariable, ThisVariable.NodeElements.wwInput, "trafiła!", "nie trafiła...");
        });

        this.getChildElementByName("parry").addEventListener("click", function () {
            ThisVariable.rollForEntityAction(ThisVariable, ThisVariable.NodeElements.wwInput, "sparowała!", "nie sparowała...");
        });

        this.getChildElementByName("shoot").addEventListener("click", function () {
            ThisVariable.rollForEntityAction(ThisVariable, ThisVariable.NodeElements.usInput, "trafiła!", "nie trafiła...");
        });

        this.getChildElementByName("hp").addEventListener("change", () => {
            ThisVariable.correctHp();
        });

        this.getChildElementByName("harm").addEventListener("click", function () {
            let damage = parseInt(window.prompt("Podaj ilość obrażeń"));
            let protection = parseInt(window.prompt("Podaj ochronę postaci " + ThisVariable.NodeElements.nameInput.innerText + "\nTa postać posiada " + ThisVariable.roundToSingle(parseInt(ThisVariable.NodeElements.odpInput.value)) + " odporności"));

            if (isNaN(damage))
                damage = 0;

            if (isNaN(protection))
                protection = 0;

            let finalDamage = damage - protection;

            if (finalDamage < 0)
                finalDamage = 0;

            let currentHpElem = ThisVariable.NodeElements.hpInput;

            currentHpElem.value = parseInt(currentHpElem.value) - finalDamage;   
                
            let summaryText = "Postać " + ThisVariable.NodeElements.nameInput.innerText + " otrzymała " + finalDamage + " obrażeń!";
                
            // Make sure that the effect is not bigger than +10
            let possibleEffect = (parseInt(currentHpElem.value) < -10) ? -10 : parseInt(currentHpElem.value);

            if (parseInt(currentHpElem.value) < 0)
                summaryText += "\nWchodzi więc na tabelkę krytyczną! Rzuć na efekt! (+" + possibleEffect * -1 + ")";

            ThisVariable.correctHp();

            window.alert(summaryText);
        });

        this.getChildElementByName("kill").addEventListener("click", function () {
            if (ThisVariable.killed == false) {
                ThisVariable.ENTITY_ELEM.classList.add("--killed");
                ThisVariable.killed = true;
                ThisVariable.NodeElements.killButton.innerText = "Ożyw postać";
                ThisVariable.NodeElements.killIcon.classList.remove("fa-skull");
                ThisVariable.NodeElements.killIcon.classList.add("fa-heartbeat");
            } else {
                ThisVariable.ENTITY_ELEM.classList.remove("--killed");
                ThisVariable.killed = false;
                ThisVariable.NodeElements.killButton.innerText = "Zabij postać";
                ThisVariable.NodeElements.killIcon.classList.add("fa-skull");
                ThisVariable.NodeElements.killIcon.classList.remove("fa-heartbeat");
            }
        });

        this.getChildElementByName("save").addEventListener("click", function () {
            let userAgree = window.confirm("Czy na pewno chcesz zapisać tą postać?");

            if (userAgree) {
                let data = {
                    name: ThisVariable.NodeElements.nameInput.innerText,
                    ww: ThisVariable.NodeElements.wwInput.value,
                    us: ThisVariable.NodeElements.usInput.value,
                    k: ThisVariable.NodeElements.kInput.value,
                    odp: ThisVariable.NodeElements.odpInput.value,
                    zr: ThisVariable.NodeElements.zrInput.value,
                    int: ThisVariable.NodeElements.intInput.value,
                    sw: ThisVariable.NodeElements.swInput.value,
                    ogd: ThisVariable.NodeElements.ogdInput.value,
                    atk: ThisVariable.NodeElements.hpInput.value,
                    hp: ThisVariable.NodeElements.initiativeInput.value ,
                    dmg: ThisVariable.NodeElements.dmgInput.value,
                    notes: ThisVariable.NodeElements.notesInput.value
                };

                const xhr = new XMLHttpRequest();

                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {

                        if (xhr.status == 200) {
                            console.log("sucess:");
                            console.log(xhr.responseText);
                            // if(numbersQuantity > 1) {
                            //     let xhrResponseArray = xhr.responseText.toString().split("\n");
                            //     xhrResponseArray.pop();
                            //     resolve(xhrResponseArray); 
                            // }
                            // else
                            //     resolve(parseInt(xhr.responseText));
                        } 
                        else if (xhr.status == 404) {
                            console.error("Nie można otrzymać połączenia z plikiem editor.php");
                        } 
                        else
                            console.error("Wystąpił błąd połączenia: " + xhr.HEADERS_RECEIVED)
                    }
                }

                xhr.open("get", "./editor.php", true);
                xhr.send('add='+JSON.stringify(data));
            }
        });

        this.getChildElementByName("remove").addEventListener("click", function () {
            
            let userAgree = true;
            
            if (DELETE_ENTITY_CONFIRM_OPTION)
                userAgree = window.confirm("Czy na pewno chcesz usunąć tą postać?");

            if (userAgree) {
                ThisVariable.CONTAINER_ELEM.removeChild(ThisVariable.ENTITY_ELEM);
                fightEntities.splice(ThisVariable.id);
            }
        });

        this.ENTITY_ELEM.style.backgroundColor = this.hexToRgbA(this.NodeElements.colorInput.value);
    }

    /**
     * Correct HP if lower than 0
     */
    correctHp () {
        let hpElem = this.NodeElements.hpInput;
        hpElem.value = (hpElem.value < 0) ? 0 : hpElem.value;
    }
 
    getChildElementByName (name) {
        let childNodes = this.ENTITY_ELEM_CHILD_NODES;
        let returner;

        // Search in child nodes
        childNodes.forEach((element) => {

            if (element.nodeType == 1)
                if (element.hasAttribute("name") && element.getAttribute("name") == name)
                    returner = element;

            if (element.nodeType == 1 && element.hasChildNodes()) {
                
                // Search in child nodes of child nodes
                element.childNodes.forEach((subElement) => {
                    if (subElement.nodeType == 1)
                        if (subElement.hasAttribute("name") && subElement.getAttribute("name") == name)
                            returner = subElement;
                });
            }
        });

        return returner;
    }

    getElementById (id) {
        return document.getElementById(id);
    }
    
    roundToSingle (number) {
        return Math.floor(parseInt(number) / 10);
    }

    rollForEntityAction (parent, attributeElem, outputTextPass, outputTextNotPassed) {
        let modifier = 0;
        
        if (MODIFIER_PROMPT_OPTION)
            modifier = parseInt(window.prompt("Podaj modyfikator"));

        if (isNaN(modifier))
            modifier = 0;

        let attribute = parseInt(attributeElem.value) + parseInt(modifier);

        if (isNaN(attribute))
            attribute = 0;

        let RandomNumber = GetTrueRandom(1, 100, this.NodeElements.loadingIcon);

        RandomNumber.then(function (randomNumer) {

            if (randomNumer <= attribute)
                window.alert("Postać " + parent.NodeElements.nameInput.innerText + " " + outputTextPass + " (" + randomNumer + " na " + attribute + ")");
            else
                window.alert("Postać " + parent.NodeElements.nameInput.innerText + " " + outputTextNotPassed + " (" + randomNumer + " na " + attribute + ")"); 

        }).catch(function (error) {
            window.alert(error);
        });
    }

    hexToRgbA (hex) {
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.541)';
        }
        throw new Error('Bad Hex');
    }
}