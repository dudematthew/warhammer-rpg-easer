class Randomizer {

    /**
     * Allows efficient use of www.random.org true
     * random numbers with ability to store numbers
     * in memory in advance for next calls
     * 
     * TODO: add checking if quota is used up from API
     * https://www.random.org/quota/?format=plain
     * 
     * @param {int} randomNumbersKeepAmount how
     * many numbers to refill to memory in one
     * number set
     * @param {int} neededPercentToRefill how
     * low amount of numbers in memory in one
     * set is needed to refill
     */
    constructor(randomNumbersKeepAmount = 10, neededPercentToRefill = 20) {
        this.randomNumbersKeepAmount = randomNumbersKeepAmount;
        this.neededPercentToRefill = neededPercentToRefill;
        this.randomNumberSets = [];
        this.currentlyProcessing = false;
    }

    /**
     * Get random number between two points
     * @param {int} from random number minimum value
     * @param {int} to random number maximum value
     */
    async getRandomNumber(from = 0, to = 1) {
        let randomNumberSetKey = this.getNumberSetKey(from, to);
        let randomNumberSet = (randomNumberSetKey != null) ? this.randomNumberSets[randomNumberSetKey] : null;

        if (randomNumberSet != null) {
            if (randomNumberSet.numbers.length <= this.randomNumbersKeepAmount * (this.neededPercentToRefill / 100)) {
                this.refillRandomNumbers(from, to);
            }
            console.log("Giving one random number, currently ", randomNumberSet.numbers.length);
            return randomNumberSet.numbers.pop();
        } else {
            console.log("Waiting for refilling...");
            await this.refillRandomNumbers(from, to);
            console.log("Refilled! Currently set looks like this: ", randomNumberSet);
            return await this.getRandomNumber(from, to);
        }
    }

    /**
     * Get saved number set key
     * or if doesn't exists returns null
     * @param {int} from random number minimum value
     * @param {int} to random number maximum value
     * @param {boolean} remove if remove random
     * number from the set
     * @returns {int | null} number set key 
     * or null if doesn't exist
     */
    getNumberSetKey(from = 0, to = 1, remove = true) {
        let found = false;
        let randomNumberSetKey;

        this.randomNumberSets.forEach((set, key) => {
            if (set.from == from && set.to == to) {
                found = true;
                randomNumberSetKey = key;
            }
        });

        return found ? randomNumberSetKey : null;
    }

    /**
     * Refill saved number sets
     * @param {int} from random numbers minimum value
     * @param {int} to random number maximum value
     */
    async refillRandomNumbers(from = 0, to = 1, keepAmount = this.randomNumbersKeepAmount) {

        console.log("Refilling random numbers...");

        let randomNumberSetKey = this.getNumberSetKey(from, to);
        let randomNumberSet = (randomNumberSetKey != null) ? this.randomNumberSets[randomNumberSetKey] : null;
        let found = true;

        // There is not a saved matching random 
        // number set
        if (randomNumberSet == null) {
            randomNumberSet = {
                from: from,
                to: to,
                numbers: []
            };
            found = false;
        }

        // Calculate amount of numbers that
        // needs to be fetched
        let amount = (this.randomNumbersKeepAmount - randomNumberSet.numbers.length);

        // Amount has to be greater than 0
        if (amount <= 0)
            return 0;

        console.log("Aktualnie przetwarza: ", this.currentlyProcessing);

        let randomNumbers = null;

        // Wait for the moment API is free to use
        let pseudoTimeout = 0;
        while (randomNumbers == null || pseudoTimeout < 100) {

            if (!this.currentlyProcessing)
            randomNumbers = await this.fetchRandomNumbers(from, to, amount);

            // Calculate amount again
            amount = (this.randomNumbersKeepAmount - randomNumberSet.numbers.length);

            // sleep 100
            await new Promise(r => setTimeout(r, 100));
            pseudoTimeout++;
        }


        if (randomNumbers != null) {

            randomNumberSet.numbers = randomNumberSet.numbers.concat(randomNumbers);

            if (!found) {
                this.randomNumberSets.push(randomNumberSet);
            } else {
                this.randomNumberSets[randomNumberSetKey] = randomNumberSet;
            }
        }

        return 1;
    }

    on(eventName, callbackFunction) {
        switch (eventName) {
            case "connection-error":
                this.connectionError = callbackFunction;
                break;
            default:
                console.error("There is no event name called " + eventName);
        }
    }

    makeRequest(method, url) {
        console.log("Wykonano request");

        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 30000;
            xhr.open(method, url);
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    /**
     * Gets specific amount of random numbers from
     * www.random.org api
     * @param {int} from minimal random numbers value
     * @param {int} to maximum random numbers value
     * @param {int} amount amount of numbers to fetch
     * @returns {array} array of random numbers
     */
    async fetchRandomNumbers(from = 0, to = 0, amount) {
        
        let randomNumbers = null
        this.currentlyProcessing = true;

        await this.makeRequest('GET', "https://www.random.org/integers/?num=" + amount + "&min=" + from + "&max=" + to + "&col=1&base=10&format=plain&rnd=new")
            .then(function (data) {
                randomNumbers = data.trim().split('\n');
            })
            .catch(function (err) {
                this.connectionError(err);
            });

        console.log("Zakończono procesowanie");
        this.currentlyProcessing = false;

        return randomNumbers;
    }

    connectionError(error = "") {
        console.error("Wystąpił błąd połączenia z www.random.org: " + error);
    }
}