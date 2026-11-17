const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash4-3/app/(Cart)/Cart.js';
let content = fs.readFileSync(path, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. In loadShopsFromLocalCache: filter out food shops
const oldCacheReturn = `        if (!isFresh) {
          console.log("[Local Cache] Cache expired, forcing refresh.");
          return null;
        }
        return parsed.shops;`;

const newCacheReturn = `        if (!isFresh) {
          console.log("[Local Cache] Cache expired, forcing refresh.");
          return null;
        }
        // Exclude food mode enabled shops from grocery cart
        return parsed.shops.filter(s => !s.isFoodEnabled && !s.foodMode && !s.isFood);`;

if (content.includes(oldCacheReturn)) {
  content = content.replace(oldCacheReturn, newCacheReturn);
  console.log('Replaced cache return in Cart.js');
} else {
  console.log('Warning: oldCacheReturn not found');
}

// 2. In fetchAndProcessAllNearbyShops: skip food shops
const oldFetchLoop = `        shopsQuerySnapshot.forEach((docSnap) => {
          const shopData = docSnap.data();
          const shopId = docSnap.id;
          const shopLocation = shopData.location;

          if (
            shopLocation?.latitude &&
            shopLocation?.longitude &&
            typeof shopLocation.latitude === 'number' &&
            typeof shopLocation.longitude === 'number'
          ) {`;

const newFetchLoop = `        shopsQuerySnapshot.forEach((docSnap) => {
          const shopData = docSnap.data();
          const shopId = docSnap.id;

          // Exclude shops with Food Mode enabled from grocery cart
          const isFoodShop = shopData.isFoodEnabled === true ||
            shopData.isFoodEnabled === 'true' ||
            shopData.foodMode === true ||
            shopData.isFood === true;
          if (isFoodShop) return;

          const shopLocation = shopData.location;

          if (
            shopLocation?.latitude &&
            shopLocation?.longitude &&
            typeof shopLocation.latitude === 'number' &&
            typeof shopLocation.longitude === 'number'
          ) {`;

if (content.includes(oldFetchLoop)) {
  content = content.replace(oldFetchLoop, newFetchLoop);
  console.log('Replaced fetchLoop in Cart.js');
} else {
  console.log('Warning: oldFetchLoop not found');
}

// 3. In setupShopsRealtimeListener: skip food shops
const oldRealtimeLoop = `        snapshot.forEach((docSnap) => {
          const shopData = docSnap.data();
          const shopId = docSnap.id;
          const shopLocation = shopData.location;

          if (
            shopLocation?.latitude &&
            shopLocation?.longitude &&
            typeof shopLocation.latitude === 'number' &&
            typeof shopLocation.longitude === 'number'
          ) {`;

const newRealtimeLoop = `        snapshot.forEach((docSnap) => {
          const shopData = docSnap.data();
          const shopId = docSnap.id;

          // Exclude shops with Food Mode enabled from grocery cart
          const isFoodShop = shopData.isFoodEnabled === true ||
            shopData.isFoodEnabled === 'true' ||
            shopData.foodMode === true ||
            shopData.isFood === true;
          if (isFoodShop) return;

          const shopLocation = shopData.location;

          if (
            shopLocation?.latitude &&
            shopLocation?.longitude &&
            typeof shopLocation.latitude === 'number' &&
            typeof shopLocation.longitude === 'number'
          ) {`;

if (content.includes(oldRealtimeLoop)) {
  content = content.replace(oldRealtimeLoop, newRealtimeLoop);
  console.log('Replaced realtimeLoop in Cart.js');
} else {
  console.log('Warning: oldRealtimeLoop not found');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done Cart.js');
