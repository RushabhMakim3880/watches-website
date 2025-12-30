// Profile Page JavaScript
const API_URL = 'http://localhost:3000/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return token;
}

// API call helper
async function apiCall(endpoint, options = {}) {
    const token = checkAuth();
    if (!token) return;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        showMessage(error.message, 'error');
        throw error;
    }
}

// Show message
function showMessage(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Navigation
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show section
        document.querySelectorAll('.profile-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');

        // Load section data
        loadSectionData(section);
    });
});

// Load section data
async function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'orders':
            await loadOrders();
            break;
        case 'wishlist':
            await loadWishlist();
            break;
        case 'addresses':
            await loadAddresses();
            break;
    }
}

// Load user profile
async function loadProfile() {
    try {
        const data = await apiCall('/auth/profile');
        const user = data.user;

        // Update sidebar
        document.getElementById('sidebarName').textContent = user.name;
        document.getElementById('sidebarEmail').textContent = user.email;

        // Update avatars
        const avatarUrl = user.profile_picture || 'images/default-avatar.png';
        document.getElementById('sidebarAvatar').src = avatarUrl;
        document.getElementById('profilePicture').src = avatarUrl;

        // Update form
        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileAddress').value = user.address || '';

        // Update newsletter toggle
        document.getElementById('newsletterToggle').checked = user.newsletter_subscribed === 1;

        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

// Load dashboard
async function loadDashboard() {
    try {
        // Load stats
        const [orders, wishlist, addresses] = await Promise.all([
            apiCall('/orders'),
            apiCall('/wishlist'),
            apiCall('/profile/addresses')
        ]);

        document.getElementById('totalOrders').textContent = orders.orders?.length || 0;
        document.getElementById('totalWishlist').textContent = wishlist.wishlist?.length || 0;
        document.getElementById('totalAddresses').textContent = addresses.addresses?.length || 0;

        // Load recent orders
        const recentOrders = orders.orders?.slice(0, 3) || [];
        const recentOrdersList = document.getElementById('recentOrdersList');

        if (recentOrders.length === 0) {
            recentOrdersList.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-bag"></i><h3>No orders yet</h3><p>Start shopping to see your orders here</p></div>';
        } else {
            recentOrdersList.innerHTML = recentOrders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <strong>Order #${order.id}</strong>
                            <p>${new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <span class="order-status ${order.status}">${order.status}</span>
                            <p><strong>₹${order.total_amount.toLocaleString()}</strong></p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Profile form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('profileName').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value
    };

    try {
        await apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(formData)
        });

        showMessage('Profile updated successfully!');
        await loadProfile();
    } catch (error) {
        console.error('Failed to update profile:', error);
    }
});

// Profile picture upload
document.getElementById('profilePictureInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showMessage('File size must be less than 5MB', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
        const token = checkAuth();
        const response = await fetch(`${API_URL}/profile/picture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        showMessage('Profile picture updated!');

        // Update images
        const newUrl = `http://localhost:3000${data.profilePicture}`;
        document.getElementById('profilePicture').src = newUrl;
        document.getElementById('sidebarAvatar').src = newUrl;
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// Change password
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        await apiCall('/profile/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });

        showMessage('Password changed successfully!');
        e.target.reset();
    } catch (error) {
        console.error('Failed to change password:', error);
    }
});

// Password strength indicator
document.getElementById('newPassword').addEventListener('input', (e) => {
    const password = e.target.value;
    const strengthBar = document.getElementById('passwordStrength');

    if (password.length === 0) {
        strengthBar.className = 'password-strength';
    } else if (password.length < 6) {
        strengthBar.className = 'password-strength weak';
    } else if (password.length < 10) {
        strengthBar.className = 'password-strength medium';
    } else {
        strengthBar.className = 'password-strength strong';
    }
});

// Load orders
async function loadOrders() {
    try {
        const data = await apiCall('/orders');
        const orders = data.orders || [];
        const ordersList = document.getElementById('ordersList');

        if (orders.length === 0) {
            ordersList.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-bag"></i><h3>No orders yet</h3><p>Start shopping to see your orders here</p></div>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <strong>Order #${order.id}</strong>
                        <p>${new Date(order.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
                    </div>
                    <div style="text-align: right;">
                        <span class="order-status ${order.status}">${order.status}</span>
                        <p style="margin-top: 10px;"><strong>₹${order.total_amount.toLocaleString()}</strong></p>
                    </div>
                </div>
                <div class="order-items">
                    <p><strong>Shipping Address:</strong> ${order.shipping_address}</p>
                    <p><strong>Payment Method:</strong> ${order.payment_method}</p>
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button class="btn btn-primary btn-sm" onclick="viewOrderDetails(${order.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="reorderItems(${order.id})">
                            <i class="fas fa-redo"></i> Reorder
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const data = await apiCall(`/orders/${orderId}`);
        const order = data.order;

        const orderDetailsModal = document.getElementById('orderDetailsModal');
        const orderDetailsContent = document.getElementById('orderDetailsContent');

        document.getElementById('orderDetailsTitle').textContent = `Order #${order.id}`;

        orderDetailsContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>Order Information</h4>
                <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
                <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
                <p><strong>Payment Method:</strong> ${order.payment_method}</p>
                <p><strong>Payment Status:</strong> ${order.payment_status}</p>
                ${order.tracking_number ? `<p><strong>Tracking Number:</strong> ${order.tracking_number}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>Shipping Address</h4>
                <p>${order.shipping_address}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4>Order Items</h4>
                <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px;">
                    ${order.items ? order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <div>
                                <strong>${item.product_name || 'Product'}</strong>
                                <p style="color: #666; margin: 5px 0;">Quantity: ${item.quantity}</p>
                            </div>
                            <div style="text-align: right;">
                                <strong>₹${(item.price * item.quantity).toLocaleString()}</strong>
                                <p style="color: #666; margin: 5px 0;">₹${item.price.toLocaleString()} each</p>
                            </div>
                        </div>
                    `).join('') : '<p>No items found</p>'}
                </div>
            </div>
            
            <div style="border-top: 2px solid #333; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem;">
                    <strong>Total Amount:</strong>
                    <strong>₹${order.total_amount.toLocaleString()}</strong>
                </div>
            </div>
        `;

        orderDetailsModal.classList.add('active');
    } catch (error) {
        console.error('Failed to load order details:', error);
        showMessage('Failed to load order details', 'error');
    }
}

// Reorder items
async function reorderItems(orderId) {
    try {
        const data = await apiCall(`/orders/${orderId}`);
        const order = data.order;

        if (!order.items || order.items.length === 0) {
            showMessage('No items found in this order', 'error');
            return;
        }

        // Add all items to cart
        let addedCount = 0;
        for (const item of order.items) {
            try {
                await apiCall('/cart', {
                    method: 'POST',
                    body: JSON.stringify({
                        product_id: item.product_id,
                        quantity: item.quantity
                    })
                });
                addedCount++;
            } catch (error) {
                console.error(`Failed to add item ${item.product_id} to cart:`, error);
            }
        }

        if (addedCount > 0) {
            showMessage(`${addedCount} item(s) added to cart!`);
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1500);
        } else {
            showMessage('Failed to add items to cart', 'error');
        }
    } catch (error) {
        console.error('Failed to reorder:', error);
        showMessage('Failed to reorder items', 'error');
    }
}

// Load wishlist
async function loadWishlist() {
    try {
        const data = await apiCall('/wishlist');
        const wishlist = data.wishlist || [];
        const wishlistGrid = document.getElementById('wishlistGrid');

        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><h3>Your wishlist is empty</h3><p>Add products you love to your wishlist</p></div>';
            return;
        }

        wishlistGrid.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.brand}</p>
                    <p class="price">₹${item.price.toLocaleString()}</p>
                    <div class="wishlist-actions">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${item.product_id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load wishlist:', error);
    }
}

// Remove from wishlist
async function removeFromWishlist(id) {
    try {
        await apiCall(`/wishlist/${id}`, { method: 'DELETE' });
        showMessage('Removed from wishlist');
        await loadWishlist();
    } catch (error) {
        console.error('Failed to remove from wishlist:', error);
    }
}

// Add to cart
async function addToCart(productId) {
    try {
        await apiCall('/cart', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        showMessage('Added to cart!');
    } catch (error) {
        console.error('Failed to add to cart:', error);
    }
}

// Load addresses
async function loadAddresses() {
    try {
        const data = await apiCall('/profile/addresses');
        const addresses = data.addresses || [];
        const addressesList = document.getElementById('addressesList');

        if (addresses.length === 0) {
            addressesList.innerHTML = '<div class="empty-state"><i class="fas fa-map-marker-alt"></i><h3>No saved addresses</h3><p>Add an address for faster checkout</p></div>';
            return;
        }

        addressesList.innerHTML = addresses.map(addr => `
            <div class="address-card ${addr.is_default ? 'default' : ''}">
                <span class="address-label">${addr.label}${addr.is_default ? ' (Default)' : ''}</span>
                <h4>${addr.full_name}</h4>
                <p>${addr.phone}</p>
                <p>${addr.address_line1}</p>
                ${addr.address_line2 ? `<p>${addr.address_line2}</p>` : ''}
                <p>${addr.city}, ${addr.state} - ${addr.pincode}</p>
                <div class="address-actions">
                    ${!addr.is_default ? `<button class="btn btn-sm btn-secondary" onclick="setDefaultAddress(${addr.id})">Set Default</button>` : ''}
                    <button class="btn btn-sm btn-primary" onclick="editAddress(${addr.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAddress(${addr.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load addresses:', error);
    }
}

// Address modal
const addressModal = document.getElementById('addressModal');
const addressForm = document.getElementById('addressForm');

document.getElementById('addAddressBtn').addEventListener('click', () => {
    document.getElementById('addressModalTitle').textContent = 'Add New Address';
    addressForm.reset();
    document.getElementById('addressId').value = '';
    addressModal.classList.add('active');
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        addressModal.classList.remove('active');
    });
});

addressModal.addEventListener('click', (e) => {
    if (e.target === addressModal) {
        addressModal.classList.remove('active');
    }
});

// Submit address form
addressForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        label: document.getElementById('addressLabel').value,
        fullName: document.getElementById('addressFullName').value,
        phone: document.getElementById('addressPhone').value,
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        city: document.getElementById('addressCity').value,
        state: document.getElementById('addressState').value,
        pincode: document.getElementById('addressPincode').value,
        isDefault: document.getElementById('addressDefault').checked
    };

    const addressId = document.getElementById('addressId').value;

    try {
        if (addressId) {
            await apiCall(`/profile/addresses/${addressId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showMessage('Address updated!');
        } else {
            await apiCall('/profile/addresses', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showMessage('Address added!');
        }

        addressModal.classList.remove('active');
        await loadAddresses();
    } catch (error) {
        console.error('Failed to save address:', error);
    }
});

// Edit address
async function editAddress(id) {
    try {
        const data = await apiCall('/profile/addresses');
        const address = data.addresses.find(a => a.id === id);

        if (!address) return;

        document.getElementById('addressModalTitle').textContent = 'Edit Address';
        document.getElementById('addressId').value = address.id;
        document.getElementById('addressLabel').value = address.label;
        document.getElementById('addressFullName').value = address.full_name;
        document.getElementById('addressPhone').value = address.phone;
        document.getElementById('addressLine1').value = address.address_line1;
        document.getElementById('addressLine2').value = address.address_line2 || '';
        document.getElementById('addressCity').value = address.city;
        document.getElementById('addressState').value = address.state;
        document.getElementById('addressPincode').value = address.pincode;
        document.getElementById('addressDefault').checked = address.is_default;

        addressModal.classList.add('active');
    } catch (error) {
        console.error('Failed to load address:', error);
    }
}

// Delete address
async function deleteAddress(id) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
        await apiCall(`/profile/addresses/${id}`, { method: 'DELETE' });
        showMessage('Address deleted');
        await loadAddresses();
    } catch (error) {
        console.error('Failed to delete address:', error);
    }
}

// Set default address
async function setDefaultAddress(id) {
    try {
        await apiCall(`/profile/addresses/${id}/default`, { method: 'PUT' });
        showMessage('Default address updated');
        await loadAddresses();
    } catch (error) {
        console.error('Failed to set default address:', error);
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
});

// Newsletter toggle
document.getElementById('newsletterToggle').addEventListener('change', async (e) => {
    try {
        await apiCall('/settings/newsletter', {
            method: 'PUT',
            body: JSON.stringify({ subscribed: e.target.checked })
        });
        showMessage(`Newsletter ${e.target.checked ? 'subscribed' : 'unsubscribed'}!`);
    } catch (error) {
        console.error('Failed to update newsletter preference:', error);
        // Revert toggle on error
        e.target.checked = !e.target.checked;
    }
});

// Delete account
document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            const password = prompt('Please enter your password to confirm account deletion:');
            if (!password) {
                showMessage('Account deletion cancelled', 'error');
                return;
            }

            try {
                await apiCall('/settings/account', {
                    method: 'DELETE',
                    body: JSON.stringify({ password })
                });
                showMessage('Account deleted successfully');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                console.error('Failed to delete account:', error);
            }
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProfile();
    await loadDashboard();
});

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
