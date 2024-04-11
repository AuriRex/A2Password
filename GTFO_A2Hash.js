function XXHash_PreHash(seed, size_bytes) {
    return (seed + 374761393 + size_bytes) >>> 0;
}

function XXHash_StepHash(h32, value) {
    h32 = h32 >>> 0;
    value = value >>> 0;

    let right = Math.imul(value, 3266489917) >>> 0;
    let both = (h32 + right) >>> 0;
    let rotateLeft = XXHash_RotateLeft(both, 17) >>> 0;
    let result = Math.imul(rotateLeft, 668265263) >>> 0;
    return result;
}

function XXHash_RotateLeft(value, count) {
    value = value >>> 0;
    return ((value << count) | value >>> (32 - count)) >>> 0;
}

function XXHash_PostHash(h32) {
    h32 = h32 >>> 0
    h32 = (h32 ^ (h32 >>> 15)) >>> 0;
    h32 = Math.imul(h32, 2246822519) >>> 0;
    h32 = (h32 ^ (h32 >>> 13)) >>> 0;
    h32 = Math.imul(h32, 3266489917) >>> 0;
    h32 = (h32 ^ (h32 >>> 16)) >>> 0;
    return h32;
}

function XXHash_Hash(seed, x) {
    let num = XXHash_PreHash(seed, 4);
    num = XXHash_StepHash(num, x);
    num = XXHash_PostHash(num);
    return num;
}

function XXHash_Hash_2(seed, x, y) {
    let num = XXHash_PreHash(seed, 8);
    num = XXHash_StepHash(num, x);
    num = XXHash_StepHash(num, y);
    num = XXHash_PostHash(num);
    return num;
}

function XXHash_Int(seed, x) {
    let val = XXHash_Hash(seed, x) |0; // Convert to signed int with |0
    return Math.abs(val);
}

class HashSequence {
    constructor(seed) {
        this.Seed = seed;
        this.SequenceCounter = 0;
    }

    NextInt() {
        var result = XXHash_Int(this.Seed, this.SequenceCounter);
        this.SequenceCounter++;
        return result;
    }
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function GenerateComplexPasswordForValues(year, week) {
    let hash = XXHash_Hash_2(0x5e23baf, year, week);

    let password = GenerateComplexPassword(hash, 10);

    return password;
}

function GenerateComplexPasswordBasedOnWeek(length, date) {
    
    if(!date) {
        date = new Date();
    }

    let week = date.getWeek();
    let year = date.getFullYear();

    let hash = XXHash_Hash_2(0x5e23baf, year, week);

    let password = GenerateComplexPassword(hash, length);
    console.log("Year: "+year+", Week: "+week+", Password: "+password);
    return password;
}

function GenerateComplexPassword(seed, length) {
    let seq = new HashSequence(seed);

    if(length < 1) {
        return "";
    }

    let count = 0;
    let result = "";

    do {

        if (count > 0
            & (count % 5 == 0)
            & (count < length - 1))
        {
            result += "-";
        }

        let nextInt = seq.NextInt();

        let value = ALPHABET[nextInt % ALPHABET.length];

        //console.log("nextInt: "+nextInt+", value: "+value);

        result += value;

        count++;
    } while(count < length);

    return result;
}

// https://stackoverflow.com/questions/7765767/show-week-number-with-javascript
Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}