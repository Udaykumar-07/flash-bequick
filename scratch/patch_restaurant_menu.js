const fs = require('fs');
const path = 'c:/Users/uk/Pictures/flash4-3/app/RestaurantMenu.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace totalAmount calculation with thisRestaurantCartItems + thisRestaurantTotalAmount
const oldTotalAmount = `  const totalAmount = useMemo(() => {
    return Object.values(cartItems || {}).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
  }, [cartItems]);`;

const newTotalAmount = `  // Cart items strictly belonging to this restaurant (Food items only)
  const thisRestaurantCartItems = useMemo(() => {
    const res = {};
    if (!cartItems) return res;
    Object.entries(cartItems).forEach(([id, item]) => {
      if (item && item.quantity > 0 && item.isFood && String(item.restaurantId || item.shopId) === String(restaurantId)) {
        res[id] = item;
      }
    });
    return res;
  }, [cartItems, restaurantId]);

  const thisRestaurantCartList = useMemo(() => {
    return Object.values(thisRestaurantCartItems);
  }, [thisRestaurantCartItems]);

  const totalAmount = useMemo(() => {
    return thisRestaurantCartList.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
  }, [thisRestaurantCartList]);`;

if (content.includes(oldTotalAmount)) {
  content = content.replace(oldTotalAmount, newTotalAmount);
  console.log('Successfully replaced totalAmount logic');
} else {
  console.log('Warning: oldTotalAmount not found directly');
}

// 2. In handleDirectPayment: use thisRestaurantCartList
const oldDirectPaymentHead = `  const handleDirectPayment = useCallback(async () => {
    const foodCartItems = Object.values(cartItems || {}).filter(it => it.quantity > 0);
    if (foodCartItems.length === 0) {
      Alert.alert("Empty Order", "Please select items before proceeding to payment.");
      return;
    }`;

const newDirectPaymentHead = `  const handleDirectPayment = useCallback(async () => {
    const foodCartItems = Object.values(thisRestaurantCartItems);
    if (foodCartItems.length === 0) {
      Alert.alert("Empty Order", "Please select items from this restaurant before proceeding to payment.");
      return;
    }`;

if (content.includes(oldDirectPaymentHead)) {
  content = content.replace(oldDirectPaymentHead, newDirectPaymentHead);
  console.log('Successfully replaced handleDirectPayment food items source');
} else {
  console.log('Warning: oldDirectPaymentHead not found');
}

// Update dependency array of handleDirectPayment
const oldDirectPaymentDeps = `  }, [cartItems, restaurantDetails, restaurantName, restaurantId, resolveUserLocation, hasPriorityPickup, isElite]);`;
const newDirectPaymentDeps = `  }, [thisRestaurantCartItems, restaurantDetails, restaurantName, restaurantId, resolveUserLocation, hasPriorityPickup, isElite]);`;
if (content.includes(oldDirectPaymentDeps)) {
  content = content.replace(oldDirectPaymentDeps, newDirectPaymentDeps);
  console.log('Successfully replaced handleDirectPayment deps');
}

// 3. In handleUpdateItemQuantity: add availability check
const oldHandleUpdate = `  const handleUpdateItemQuantity = useCallback((item, delta) => {
    if (isShopClosed) {
      Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.");
      return;
    }`;

const newHandleUpdate = `  const handleUpdateItemQuantity = useCallback((item, delta) => {
    const isItemAvailable = item.available !== false && (item.quantity === undefined || Number(item.quantity) > 0);
    if (!isItemAvailable && delta > 0) {
      Alert.alert("Item Unavailable", \`"\${item.title || item.name}" is currently not available.\`);
      return;
    }
    if (isShopClosed) {
      Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.");
      return;
    }`;

if (content.includes(oldHandleUpdate)) {
  content = content.replace(oldHandleUpdate, newHandleUpdate);
  console.log('Successfully replaced handleUpdateItemQuantity');
}

// 4. In renderFoodItem: check availability and show unavailable button
const oldRenderFoodItem = `  // Food item render with SecureImage from SharedDB, with placeholder fallback
  const renderFoodItem = ({ item }) => {
    const qty = cartItems?.[item.id]?.quantity || 0;
    const itemImageSource = item.image && typeof item.image === 'string'
      ? { uri: item.image }
      : placeholderImage;

    return (
      <View style={[styles.foodCard, isShopClosed && { opacity: 0.78 }]}>
        <SecureImage
          source={itemImageSource}
          style={styles.foodImage}
          resizeMode="cover"
        />
        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.foodCategory} numberOfLines={1}>{item.category}</Text>
          <Text style={styles.foodPrice}>₹{Number(item.price || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.foodActions}>
          {isShopClosed ? (
            <TouchableOpacity
              onPress={() => Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.")}
              style={styles.closedButton}
              activeOpacity={0.7}
            >
              <Text style={styles.closedButtonText}>CLOSED</Text>
            </TouchableOpacity>
          ) : qty > 0 ? (
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => handleUpdateItemQuantity(item, -1)} style={styles.qtyBtn}>
                <Ionicons name="remove" size={18} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity onPress={() => handleUpdateItemQuantity(item, 1)} style={[styles.qtyBtn, styles.qtyBtnAdd]}>
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleUpdateItemQuantity(item, 1)} style={styles.addButton}>
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };`;

const newRenderFoodItem = `  // Food item render with SecureImage from SharedDB, with placeholder fallback
  const renderFoodItem = ({ item }) => {
    const qty = cartItems?.[item.id]?.quantity || 0;
    const isItemAvailable = item.available !== false && (item.quantity === undefined || Number(item.quantity) > 0);
    const itemImageSource = item.image && typeof item.image === 'string'
      ? { uri: item.image }
      : placeholderImage;

    return (
      <View style={[styles.foodCard, (isShopClosed || !isItemAvailable) && { opacity: 0.65 }]}>
        <SecureImage
          source={itemImageSource}
          style={styles.foodImage}
          resizeMode="cover"
        />
        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={1}>{item.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 }}>
            <Text style={styles.foodCategory} numberOfLines={1}>{item.category}</Text>
            {!isItemAvailable && (
              <View style={styles.notAvailTag}>
                <Text style={styles.notAvailTagText}>Out of Stock</Text>
              </View>
            )}
          </View>
          <Text style={styles.foodPrice}>₹{Number(item.price || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.foodActions}>
          {!isItemAvailable ? (
            <View style={styles.unavailableButton}>
              <Text style={styles.unavailableButtonText}>UNAVAILABLE</Text>
            </View>
          ) : isShopClosed ? (
            <TouchableOpacity
              onPress={() => Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.")}
              style={styles.closedButton}
              activeOpacity={0.7}
            >
              <Text style={styles.closedButtonText}>CLOSED</Text>
            </TouchableOpacity>
          ) : qty > 0 ? (
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => handleUpdateItemQuantity(item, -1)} style={styles.qtyBtn}>
                <Ionicons name="remove" size={18} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity onPress={() => handleUpdateItemQuantity(item, 1)} style={[styles.qtyBtn, styles.qtyBtnAdd]}>
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleUpdateItemQuantity(item, 1)} style={styles.addButton}>
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };`;

if (content.includes(oldRenderFoodItem)) {
  content = content.replace(oldRenderFoodItem, newRenderFoodItem);
  console.log('Successfully replaced renderFoodItem');
}

// 5. In FlatList padding:
const oldPadding = `{ paddingBottom: Math.max(insets.bottom, 16) + (cartItems && Object.keys(cartItems).length > 0 ? 140 : 40) }`;
const newPadding = `{ paddingBottom: Math.max(insets.bottom, 16) + (thisRestaurantCartList.length > 0 ? 140 : 40) }`;
if (content.includes(oldPadding)) {
  content = content.replace(oldPadding, newPadding);
  console.log('Successfully replaced FlatList padding');
}

// 6. In CartFooter: only render if thisRestaurantCartList.length > 0 and pass thisRestaurantCartItems
const oldCartFooter = `      <CartFooter
        cartItems={cartItems}
        isLoading={false}
        insets={insets}
        cartExpanded={cartExpanded}
        setCartExpanded={setCartExpanded}
        cartExpandAnim={cartExpandAnim}
        totalAmount={totalAmount}
        buttonText={isShopClosed ? "Restaurant Closed" : "Go to Cart"}
        buttonIcon={isShopClosed ? "alert-circle" : "cart"}
        buttonColor={isShopClosed ? "#ef4444" : "#f59e0b"}
        badgeText={isShopClosed ? "Closed" : "⚡ VIP Takeaway"}
        onButtonPress={isShopClosed ? () => Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.") : handleDirectPayment}
        onNavigateToCart={isShopClosed ? () => Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.") : handleDirectPayment}
        onRemoveItem={handleRemoveItem}
      />`;

const newCartFooter = `      {thisRestaurantCartList.length > 0 && (
        <CartFooter
          cartItems={thisRestaurantCartItems}
          isLoading={false}
          insets={insets}
          cartExpanded={cartExpanded}
          setCartExpanded={setCartExpanded}
          cartExpandAnim={cartExpandAnim}
          totalAmount={totalAmount}
          buttonText={isShopClosed ? "Restaurant Closed" : "Go to Cart"}
          buttonIcon={isShopClosed ? "alert-circle" : "cart"}
          buttonColor={isShopClosed ? "#ef4444" : "#f59e0b"}
          badgeText={isShopClosed ? "Closed" : "⚡ VIP Takeaway"}
          onButtonPress={isShopClosed ? () => Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.") : handleDirectPayment}
          onNavigateToCart={isShopClosed ? () => Alert.alert("Restaurant Closed", "This restaurant is currently closed and not accepting orders.") : handleDirectPayment}
          onRemoveItem={handleRemoveItem}
        />
      )}`;

if (content.includes(oldCartFooter)) {
  content = content.replace(oldCartFooter, newCartFooter);
  console.log('Successfully replaced CartFooter render');
}

// 7. Add styles for unavailableButton and notAvailTag
const oldStyleAnchor = `  closedButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },`;

const newStyleAnchor = `  closedButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  unavailableButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableButtonText: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  notAvailTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  notAvailTagText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: '700',
  },`;

if (content.includes(oldStyleAnchor)) {
  content = content.replace(oldStyleAnchor, newStyleAnchor);
  console.log('Successfully added unavailable styles');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done writing RestaurantMenu.js');
