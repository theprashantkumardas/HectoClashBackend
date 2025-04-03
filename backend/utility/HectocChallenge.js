
class HectocChallenge {
    static MIN = 1;
    static MAX = 9;
    static ALLOWED_CHARS = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

    constructor(input) {
        if (typeof input === 'string') {
            this.fromString(input);
        } else if (typeof input === 'object') {
            this.fromNumbers(input);
        } else {
            throw new Error("Invalid input. Provide either a string or an object with digits.");
        }
    }

    fromNumbers({ firstDigit, secondDigit, thirdDigit, fourthDigit, fifthDigit, sixthDigit }) {
        this.validateDigit(firstDigit, "first");
        this.validateDigit(secondDigit, "second");
        this.validateDigit(thirdDigit, "third");
        this.validateDigit(fourthDigit, "fourth");
        this.validateDigit(fifthDigit, "fifth");
        this.validateDigit(sixthDigit, "sixth");

        this.firstDigit = firstDigit;
        this.secondDigit = secondDigit;
        this.thirdDigit = thirdDigit;
        this.fourthDigit = fourthDigit;
        this.fifthDigit = fifthDigit;
        this.sixthDigit = sixthDigit;
    }

    fromString(hectoc) {
        if (!hectoc || hectoc.length !== 6) {
            throw new Error("String is not a hectoc. Please provide a string with 6 numbers between 1 and 9");
        }
        
        const hectocSymbols = Array.from(hectoc).map(c => {
            if (!HectocChallenge.ALLOWED_CHARS.has(c)) {
                throw new Error("Illegal character found.");
            }
            return parseInt(c, 10);
        });

        [this.firstDigit, this.secondDigit, this.thirdDigit, this.fourthDigit, this.fifthDigit, this.sixthDigit] = hectocSymbols;
    }

    validateDigit(digit, position) {
        if (digit < HectocChallenge.MIN || digit > HectocChallenge.MAX) {
            throw new Error(`The ${position} number is invalid. Please provide a number between 1 and 9`);
        }
    }

    getFirstDigit() { return this.firstDigit; }
    getSecondDigit() { return this.secondDigit; }
    getThirdDigit() { return this.thirdDigit; }
    getFourthDigit() { return this.fourthDigit; }
    getFifthDigit() { return this.fifthDigit; }
    getSixthDigit() { return this.sixthDigit; }


    toString() {
        return `${this.firstDigit}${this.secondDigit}${this.thirdDigit}${this.fourthDigit}${this.fifthDigit}${this.sixthDigit}`;
    }
}

export default HectocChallenge;