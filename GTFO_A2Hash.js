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
    // h32 ^= h32 >> 15;
    // h32 *= 2246822519;
    // h32 ^= h32 >> 13;
    // h32 *= 3266489917;
    // h32 ^= h32 >> 16;
    // return h32 >>> 0;
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

function XXHash_Hash_dbg(seed, x) {
    console.log("Hash_dbg: seed: "+seed+", x:"+x);
    let num = XXHash_PreHash(seed, 4);
    console.log("PreHash: num: "+num);
    num = XXHash_StepHash_dbg(num, x);
    console.log("StepHash: num: "+num);
    num = XXHash_PostHash_dbg(num);
    console.log("PostHash: num: "+num);
    return num;
}

function XXHash_Hash_dbg_2(seed, x, y) {
    console.log("Hash_dbg: seed: "+seed+", x:"+x+", y:"+y);
    let num = XXHash_PreHash(seed, 8);
    console.log("PreHash: num: "+num);
    num = XXHash_StepHash_dbg(num, x);
    console.log("StepHash(x): num: "+num);
    num = XXHash_StepHash_dbg(num, y);
    console.log("StepHash(y): num: "+num);
    num = XXHash_PostHash_dbg(num);
    console.log("PostHash: num: "+num);
    return num;
}

function XXHash_StepHash_dbg(h32, value) {
    h32 = h32 >>> 0;
    value = value >>> 0;

    console.log("->StepHash: h32: " + h32 + " value: " + value);
    let right = Math.imul(value, 3266489917) >>> 0;
    console.log("->StepHash: right: " + right);
    let both = (h32 + right) >>> 0;
    console.log("->StepHash: both: " + both);
    let rotateLeft = XXHash_RotateLeft(both, 17);
    console.log("->StepHash: rotateLeft: " + rotateLeft);
    let result = Math.imul(rotateLeft, 668265263) >>> 0;
    console.log("->StepHash: result: " + result);
    return result;
}

function XXHash_PostHash_dbg(h32) {
    h32 = h32 >>> 0
    console.log("->PostHash: h32: " + h32);
    h32 = (h32 ^ (h32 >>> 15)) >>> 0;
    console.log("->PostHash: ^h32 >> 15: " + h32);
    h32 = Math.imul(h32, 2246822519) >>> 0;
    console.log("->PostHash: h32 *= #1: " + h32);
    h32 = (h32 ^ (h32 >>> 13)) >>> 0;
    console.log("->PostHash: ^h32 >> 13: " + h32);
    h32 = Math.imul(h32, 3266489917) >>> 0;
    console.log("->PostHash: h32 *= #2: " + h32);
    h32 = (h32 ^ (h32 >>> 16)) >>> 0;
    console.log("->PostHash: ^h32 >> 16: " + h32);
    return h32;
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
        //console.log("NextInt: Seed: "+this.Seed+", SequenceCounter: "+this.SequenceCounter);
        var result = XXHash_Int(this.Seed, this.SequenceCounter);
        //console.log("NextInt: result: "+result);
        this.SequenceCounter++;
        return result;
    }
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function GenerateComplexPasswordForValues(year, week) {
    let hash = XXHash_Hash_2(0x5e23baf, year, week);

    let password = GenerateComplexPassword(hash, 10);
    //console.log("Year: "+year+", Week: "+week+", Password: "+password);
    return password;
}

function GenerateComplexPasswordBasedOnWeek(length, date) {
    
    if(!date) {
        //let timestamp = document.getElementById("date").valueAsNumber;
        date = new Date();
    }

    let week = date.getWeek();
    let year = date.getFullYear();

    let hash = XXHash_Hash_2(0x5e23baf, year, week);

    //console.log("GenerateComplexPasswordBasedOnWeek: Seed: " + hash);

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

function doThing() {
    //alert(1);
    //console.log("abcdef");

    // 1169306189
    // 4294967295

    

    // XXHash_Hash_dbg(0, 1);

    // var pwd = GenerateComplexPassword(0, 10);

    // alert(pwd);

    for(let i = 0; i < 3; i++) {
        for(let week = 1; week < 53; week++) {
            let year = 2023 + i;
            var password = GenerateComplexPasswordForValues(year, week);
            console.log("Year: "+year+", Week: "+week+", Password: "+password);

        }
    }

    return;

    // return;

    let password1 = GenerateComplexPassword(0, 10);

    console.log("Password1 (Seed=0): " + password1);

    console.log("###########");
    console.log("###########");
    console.log("###########");
    console.log("###########");
    console.log("###########");

    let timestamp = document.getElementById("date").valueAsNumber;
    let date = new Date(timestamp);

    let week = date.getWeek();
    let year = date.getFullYear();

    let hash = XXHash_Hash_2(0x5e23baf, year, week);

    console.log("GenerateComplexPasswordBasedOnWeek: Seed: " + hash);

    let password0 = GenerateComplexPassword(hash, 10);

    let hashXY = XXHash_Hash_2(0x5e23baf, 2024, 14);
    console.log("HashXY: " + hashXY);

    console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
    console.log("Hash_DBG_2:");

    var resultXY = XXHash_Hash_dbg_2(0x5e23baf, 2024, 14);

    console.log("resultXY: "+resultXY);

    alert(week + " - " + year + " => " + password);
}