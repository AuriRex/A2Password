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

// <3
// https://stackoverflow.com/a/9781559
Date.prototype.getWeek = function() {
    // We have to compare against the first monday of the year not the 01/01
    // 60*60*24*1000 = 86400000
    // 'onejan_next_monday_time' reffers to the miliseconds of the next monday after 01/01

    var day_miliseconds = 86400000,
        onejan = new Date(this.getFullYear(),0,1,0,0,0),
        onejan_day = (onejan.getDay()==0) ? 7 : onejan.getDay(),
        days_for_next_monday = (8-onejan_day),
        onejan_next_monday_time = onejan.getTime() + (days_for_next_monday * day_miliseconds),
        // If one jan is not a monday, get the first monday of the year
        first_monday_year_time = (onejan_day>1) ? onejan_next_monday_time : onejan.getTime(),
        this_date = new Date(this.getFullYear(), this.getMonth(),this.getDate(),0,0,0),// This at 00:00:00
        this_time = this_date.getTime(),
        days_from_first_monday = Math.round(((this_time - first_monday_year_time) / day_miliseconds));

    var first_monday_year = new Date(first_monday_year_time);

    // We add 1 to "days_from_first_monday" because if "days_from_first_monday" is *7,
    // then 7/7 = 1, and as we are 7 days from first monday,
    // we should be in week number 2 instead of week number 1 (7/7=1)
    // We consider week number as 52 when "days_from_first_monday" is lower than 0,
    // that means the actual week started before the first monday so that means we are on the firsts
    // days of the year (ex: we are on Friday 01/01, then "days_from_first_monday"=-3,
    // so friday 01/01 is part of week number 52 from past year)
    // "days_from_first_monday<=364" because (364+1)/7 == 52, if we are on day 365, then (365+1)/7 >= 52 (Math.ceil(366/7)=53) and thats wrong

    return (days_from_first_monday>=0 && days_from_first_monday<364) ? Math.ceil((days_from_first_monday+1)/7) : 52;
}