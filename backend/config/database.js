const fs = require('fs');
const path = require('path');

// Data directory
const dataDir = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files
const initFile = (filename, defaultData) => {
    const filepath = path.join(dataDir, filename);
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
    }
    return filepath;
};

// Initialize all data files
initFile('users.json', []);
initFile('cart.json', []);
initFile('wishlist.json', []);
initFile('orders.json', []);
initFile('newsletter.json', []);

console.log('✅ JSON file storage initialized:', dataDir);

// Read JSON file
const readFile = (filename) => {
    const filepath = path.join(dataDir, filename);
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
};

// Write JSON file
const writeFile = (filename, data) => {
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

// Load products from existing products.js
const productsModule = require('../data/products');
const products = productsModule.products || productsModule;

// Simulate database query interface for compatibility
const query = async (sql, params = []) => {
    const sqlUpper = sql.trim().toUpperCase();

    try {
        // Products queries
        if (sqlUpper.includes('FROM PRODUCTS') || sqlUpper.includes('FROM products')) {
            if (sqlUpper.startsWith('SELECT')) {
                // Return all products or filtered
                let results = [...products];

                // Simple filtering (you can enhance this)
                if (params.length > 0 && sql.includes('WHERE id = ?')) {
                    results = results.filter(p => p.id === parseInt(params[0]));
                }

                return [results];
            } else if (sqlUpper.startsWith('INSERT')) {
                // For demo, we'll just return success
                return [{ insertId: products.length + 1, affectedRows: 1 }];
            }
        }

        // Users queries
        if (sqlUpper.includes('FROM USERS') || sqlUpper.includes('FROM users')) {
            const users = readFile('users.json');

            if (sqlUpper.startsWith('SELECT')) {
                if (sql.includes('WHERE email = ?')) {
                    const results = users.filter(u => u.email === params[0]);
                    return [results];
                } else if (sql.includes('WHERE id = ?')) {
                    const results = users.filter(u => u.id === parseInt(params[0]));
                    return [results];
                }
                return [users];
            } else if (sqlUpper.startsWith('INSERT')) {
                const newUser = {
                    id: users.length + 1,
                    name: params[0],
                    email: params[1],
                    password: params[2],
                    phone: params[3] || null,
                    address: params[4] || null,
                    created_at: new Date().toISOString()
                };
                users.push(newUser);
                writeFile('users.json', users);
                return [{ insertId: newUser.id, affectedRows: 1 }];
            } else if (sqlUpper.startsWith('UPDATE')) {
                // Simple update logic
                return [{ affectedRows: 1 }];
            }
        }

        // Cart queries
        if (sqlUpper.includes('FROM CART') || sqlUpper.includes('FROM cart')) {
            const cart = readFile('cart.json');

            if (sqlUpper.startsWith('SELECT')) {
                if (sql.includes('WHERE user_id = ?')) {
                    const userCart = cart.filter(c => c.user_id === parseInt(params[0]));
                    // Join with products
                    const results = userCart.map(c => {
                        const product = products.find(p => p.id === c.product_id);
                        return { ...c, ...product };
                    });
                    return [results];
                }
                return [cart];
            } else if (sqlUpper.startsWith('INSERT')) {
                const newItem = {
                    id: cart.length + 1,
                    user_id: parseInt(params[0]),
                    product_id: parseInt(params[1]),
                    quantity: parseInt(params[2])
                };
                cart.push(newItem);
                writeFile('cart.json', cart);
                return [{ insertId: newItem.id, affectedRows: 1 }];
            } else if (sqlUpper.startsWith('DELETE')) {
                const filtered = cart.filter(c => c.user_id !== parseInt(params[0]));
                writeFile('cart.json', filtered);
                return [{ affectedRows: cart.length - filtered.length }];
            }
        }

        // Wishlist queries
        if (sqlUpper.includes('FROM WISHLIST') || sqlUpper.includes('FROM wishlist')) {
            const wishlist = readFile('wishlist.json');

            if (sqlUpper.startsWith('SELECT')) {
                if (sql.includes('WHERE user_id = ?')) {
                    const userWishlist = wishlist.filter(w => w.user_id === parseInt(params[0]));
                    const results = userWishlist.map(w => {
                        const product = products.find(p => p.id === w.product_id);
                        return { ...w, ...product };
                    });
                    return [results];
                }
                return [wishlist];
            } else if (sqlUpper.startsWith('INSERT')) {
                const newItem = {
                    id: wishlist.length + 1,
                    user_id: parseInt(params[0]),
                    product_id: parseInt(params[1])
                };
                wishlist.push(newItem);
                writeFile('wishlist.json', wishlist);
                return [{ insertId: newItem.id, affectedRows: 1 }];
            }
        }

        // Newsletter queries
        if (sqlUpper.includes('FROM NEWSLETTER') || sqlUpper.includes('FROM newsletter')) {
            const newsletter = readFile('newsletter.json');

            if (sqlUpper.startsWith('SELECT')) {
                if (sql.includes('WHERE email = ?')) {
                    const results = newsletter.filter(n => n.email === params[0]);
                    return [results];
                }
                return [newsletter];
            } else if (sqlUpper.startsWith('INSERT')) {
                const newSub = {
                    id: newsletter.length + 1,
                    email: params[0],
                    subscribed_at: new Date().toISOString()
                };
                newsletter.push(newSub);
                writeFile('newsletter.json', newsletter);
                return [{ insertId: newSub.id, affectedRows: 1 }];
            }
        }

        // Default response
        return [[]];
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    }
};

// Promisified version for compatibility
const promisePool = {
    query: async (sql, params) => {
        return query(sql, params);
    },
    getConnection: async () => ({
        query: async (sql, params) => {
            return query(sql, params);
        },
        beginTransaction: () => { },
        commit: () => { },
        rollback: () => { },
        release: () => { }
    })
};

module.exports = promisePool;
