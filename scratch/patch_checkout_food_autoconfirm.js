const fs = require('fs');

const path = 'c:/Users/uk/Pictures/flash4-3/app/components/CheckoutFlowModal.js';
let content = fs.readFileSync(path, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. In startCheckoutFlow: recognize isFood / isVIPTakeaway as auto-confirmed
const oldOrderPayload = `        const orderPayload = {
          loyaltyStatus,
          tokenId: tokenIdToUse,
          flashId: flashIdToUse,
          createdAt: Timestamp.fromDate(now),
          expiresAt: Timestamp.fromDate(shopExpiryTime),
          shopName: shopOrder.shopName,
          orderType: shopOrder.orderType,
          paymentType: 'Pending',
          paymentStatus: 'pending',
          deliveryLocation: shopOrder.deliveryLocation || userLocation,
          items: shopOrder.items,
          totalAmount: shopTotalAmount,
          userId: authUser.uid,
          vendorOwnerUid,
          status: shopOrder.isStockManagementEnabled ? "vendor_confirmed" : "awaiting_confirmation",
          shopId: shopOrder.shopId,
        };`;

const newOrderPayload = `        const isFoodTakeaway = Boolean(shopOrder.isFood || shopOrder.isVIPTakeaway);
        const autoConfirm = shopOrder.isStockManagementEnabled || isFoodTakeaway;

        const orderPayload = {
          loyaltyStatus,
          tokenId: tokenIdToUse,
          flashId: flashIdToUse,
          createdAt: Timestamp.fromDate(now),
          expiresAt: Timestamp.fromDate(shopExpiryTime),
          shopName: shopOrder.shopName,
          orderType: shopOrder.orderType,
          paymentType: 'Pending',
          paymentStatus: 'pending',
          deliveryLocation: shopOrder.deliveryLocation || userLocation,
          items: shopOrder.items,
          totalAmount: shopTotalAmount,
          userId: authUser.uid,
          vendorOwnerUid,
          status: autoConfirm ? "vendor_confirmed" : "awaiting_confirmation",
          shopId: shopOrder.shopId,
          isFood: isFoodTakeaway,
          isVIPTakeaway: shopOrder.isVIPTakeaway || false,
        };`;

if (content.includes(oldOrderPayload)) {
  content = content.replace(oldOrderPayload, newOrderPayload);
  console.log('Replaced orderPayload in CheckoutFlowModal.js');
} else {
  console.log('Warning: oldOrderPayload not found');
}

// 2. In queue write: food orders do not wait in OrderQueue
const oldQueueWrite = `      for (const prepared of createdOrders) {
        const { orderPayload, shopOrder, flashIdToUse } = prepared;

        if (!shopOrder.isStockManagementEnabled) {
          const orderQueueDoc = doc(Firestore, "OrderQueue", quantizedKey, "orders", \`FlashId-\${flashIdToUse}\`);
          primaryBatch.set(orderQueueDoc, {
            createdAt: Timestamp.fromDate(now),
            shopId: shopOrder.shopId,
            vendorOwnerUid: orderPayload.vendorOwnerUid,
            payload: orderPayload,
            processed: false,
          });

          const userPendingOrderDoc = doc(Firestore, "users", authUser.uid, "PendingOrders", \`FlashId-\${flashIdToUse}\`);
          primaryBatch.set(userPendingOrderDoc, { ...orderPayload, isReadyForPickup: false });
        }
      }

      // Single batch commit for all orders
      if (createdOrders.some(o => !o.shopOrder.isStockManagementEnabled)) {
        await primaryBatch.commit();
        console.log(\`[CheckoutFlow] Firestore write completed in \${Date.now() - writeStartTime}ms\`);
      }`;

const newQueueWrite = `      for (const prepared of createdOrders) {
        const { orderPayload, shopOrder, flashIdToUse } = prepared;
        const isFoodTakeaway = Boolean(shopOrder.isFood || shopOrder.isVIPTakeaway);

        // Only grocery orders with disabled stock management wait for vendor review
        if (!shopOrder.isStockManagementEnabled && !isFoodTakeaway) {
          const orderQueueDoc = doc(Firestore, "OrderQueue", quantizedKey, "orders", \`FlashId-\${flashIdToUse}\`);
          primaryBatch.set(orderQueueDoc, {
            createdAt: Timestamp.fromDate(now),
            shopId: shopOrder.shopId,
            vendorOwnerUid: orderPayload.vendorOwnerUid,
            payload: orderPayload,
            processed: false,
          });

          const userPendingOrderDoc = doc(Firestore, "users", authUser.uid, "PendingOrders", \`FlashId-\${flashIdToUse}\`);
          primaryBatch.set(userPendingOrderDoc, { ...orderPayload, isReadyForPickup: false });
        }
      }

      // Single batch commit for non-food unmanaged orders
      if (createdOrders.some(o => !o.shopOrder.isStockManagementEnabled && !o.shopOrder.isFood && !o.shopOrder.isVIPTakeaway)) {
        await primaryBatch.commit();
        console.log(\`[CheckoutFlow] Firestore write completed in \${Date.now() - writeStartTime}ms\`);
      }`;

if (content.includes(oldQueueWrite)) {
  content = content.replace(oldQueueWrite, newQueueWrite);
  console.log('Replaced queueWrite in CheckoutFlowModal.js');
} else {
  console.log('Warning: oldQueueWrite not found');
}

// 3. Step transition: food orders immediately go to VENDOR_CONFIRMED without waiting or showing "Checking item availability..."
const oldStepTransition = `      if (checkoutDetails[0] && checkoutDetails[0].isStockManagementEnabled) {
        setStep('VENDOR_CONFIRMED');
        // Pre-create dynamic UPI intent immediately since no vendor wait needed
        preCreateUpiQR(createdOrders[0].orderPayload);
      } else {
        listenToPendingOrder(authUser.uid, createdOrders[0].orderPayload.flashId);
        setStep('AWAITING_VENDOR');
      }`;

const newStepTransition = `      const firstShopIsFood = Boolean(checkoutDetails[0]?.isFood || checkoutDetails[0]?.isVIPTakeaway);
      if ((checkoutDetails[0] && checkoutDetails[0].isStockManagementEnabled) || firstShopIsFood) {
        setStep('VENDOR_CONFIRMED');
        // Pre-create dynamic UPI intent immediately since no vendor wait needed
        preCreateUpiQR(createdOrders[0].orderPayload);
      } else {
        listenToPendingOrder(authUser.uid, createdOrders[0].orderPayload.flashId);
        setStep('AWAITING_VENDOR');
      }`;

if (content.includes(oldStepTransition)) {
  content = content.replace(oldStepTransition, newStepTransition);
  console.log('Replaced stepTransition in CheckoutFlowModal.js');
} else {
  console.log('Warning: oldStepTransition not found');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done CheckoutFlowModal.js');
