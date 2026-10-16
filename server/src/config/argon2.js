import {Version} from '@node-rs/argon2';

export const argon2 = {
    memoryCost: 65536, // 64 MB 
    timeCost: 3, // Number of iterations
    outputLen: 32, // Length of the hash in bytes
    parallelism: 1, // Number of threads
    version: Version.Version13 // version 19 in hexadecimal
};
