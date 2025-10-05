// Simple shield test
let shield = 100;

console.log('Initial shield:', shield);

function damageShield(damage) {
    console.log('Damage received:', damage);
    const oldShield = shield;
    shield = Math.max(0, shield - damage);
    console.log('Shield changed:', oldShield, '->', shield);
}

// Test single hit
damageShield(15);
console.log('Expected: 85, Actual:', shield);

// Test multiple hits
damageShield(15);
console.log('Expected: 70, Actual:', shield);

damageShield(15);
console.log('Expected: 55, Actual:', shield);