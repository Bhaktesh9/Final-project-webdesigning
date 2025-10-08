// DOM elements
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const dashboard = document.getElementById('dashboard');
const message = document.getElementById('message');

// Check if user is logged in
const token = localStorage.getItem('token');
if (token) {
  showDashboard();
}

// Event listeners for switching between login/signup
document.getElementById('show-signup').addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  signupSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// Login form
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      showMessage('Login successful!', 'success');
      showDashboard();
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Login failed', 'error');
  }
});

// Signup form
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();
    showMessage(data.message, response.ok ? 'success' : 'error');
    if (response.ok) {
      signupSection.style.display = 'none';
      loginSection.style.display = 'block';
    }
  } catch (error) {
    showMessage('Signup failed', 'error');
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  dashboard.style.display = 'none';
  loginSection.style.display = 'block';
  showMessage('Logged out successfully', 'success');
});

// Show dashboard and load user data
async function showDashboard() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const user = await response.json();
      document.getElementById('welcome').innerText = `Welcome, ${user.name} (${user.role})`;
      
      // Hide login/signup, show dashboard
      loginSection.style.display = 'none';
      signupSection.style.display = 'none';
      dashboard.style.display = 'block';
      
      // Show appropriate sections based on role
      showRoleBasedSections(user.role);
      setupRoleBasedEventListeners(user.role);
    } else {
      localStorage.removeItem('token');
      showMessage('Session expired', 'error');
    }
  } catch (error) {
    showMessage('Failed to load user data', 'error');
  }
}

// Show sections based on user role
function showRoleBasedSections(role) {
  // Hide all sections first
  document.querySelectorAll('.role-section').forEach(section => {
    section.style.display = 'none';
  });

  // Show sections based on role
  switch (role) {
    case 'Salesman':
      document.getElementById('sales-section').style.display = 'block';
      break;
    case 'PurchaseMan':
      document.getElementById('purchase-section').style.display = 'block';
      break;
    case 'Manager':
      document.getElementById('manager-section').style.display = 'block';
      break;
    case 'Admin':
      // Admin gets the unified admin portal
      document.getElementById('admin-section').style.display = 'block';
      break;
  }
}

// Setup event listeners based on role
function setupRoleBasedEventListeners(role) {
  const token = localStorage.getItem('token');

  // Sales form (Salesman)
  if (role === 'Salesman') {
    document.getElementById('sales-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const productName = document.getElementById('sale-product').value;
      const quantity = document.getElementById('sale-quantity').value;
      const price = document.getElementById('sale-price').value;

      try {
        const response = await fetch('/api/inventory/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productName, quantity: parseInt(quantity), price: parseFloat(price) })
        });

        const data = await response.json();
        showMessage(data.message, response.ok ? 'success' : 'error');
        if (response.ok) {
          document.getElementById('sales-form').reset();
        }
      } catch (error) {
        showMessage('Failed to record sale', 'error');
      }
    });
  }

  // Purchase form (PurchaseMan)
  if (role === 'PurchaseMan') {
    document.getElementById('purchase-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const productName = document.getElementById('purchase-product').value;
      const quantity = document.getElementById('purchase-quantity').value;
      const cost = document.getElementById('purchase-cost').value;

      try {
        const response = await fetch('/api/inventory/purchases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productName, quantity: parseInt(quantity), cost: parseFloat(cost) })
        });

        const data = await response.json();
        showMessage(data.message, response.ok ? 'success' : 'error');
        if (response.ok) {
          document.getElementById('purchase-form').reset();
        }
      } catch (error) {
        showMessage('Failed to record purchase', 'error');
      }
    });
  }

  // Manager/Admin report buttons
  if (role === 'Manager') {
    const viewSalesBtn = document.querySelector('#manager-section #view-sales');
    const viewPurchasesBtn = document.querySelector('#manager-section #view-purchases');
    
    if (viewSalesBtn) {
      viewSalesBtn.addEventListener('click', async () => {
        await loadSalesData();
      });
    }
    
    if (viewPurchasesBtn) {
      viewPurchasesBtn.addEventListener('click', async () => {
        await loadPurchasesData();
      });
    }
  }

  // Admin-specific buttons
  if (role === 'Admin') {
    const viewUsersBtn = document.querySelector('#admin-section #view-users');
    const viewSalesBtn = document.querySelector('#admin-section #view-sales');
    const viewPurchasesBtn = document.querySelector('#admin-section #view-purchases');
    
    if (viewUsersBtn) {
      viewUsersBtn.addEventListener('click', async () => {
        await loadPendingUsers();
      });
    }
    
    if (viewSalesBtn) {
      viewSalesBtn.addEventListener('click', async () => {
        await loadSalesData();
      });
    }
    
    if (viewPurchasesBtn) {
      viewPurchasesBtn.addEventListener('click', async () => {
        await loadPurchasesData();
      });
    }

    // Admin sales form
    const adminSalesForm = document.getElementById('admin-sales-form');
    if (adminSalesForm) {
      adminSalesForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productName = document.getElementById('admin-sale-product').value;
        const quantity = document.getElementById('admin-sale-quantity').value;
        const price = document.getElementById('admin-sale-price').value;

        try {
          const response = await fetch('/api/inventory/sales', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productName, quantity: parseInt(quantity), price: parseFloat(price) })
          });

          const data = await response.json();
          showMessage(data.message, response.ok ? 'success' : 'error');
          if (response.ok) {
            adminSalesForm.reset();
          }
        } catch (error) {
          showMessage('Failed to record sale', 'error');
        }
      });
    }

    // Admin purchases form
    const adminPurchaseForm = document.getElementById('admin-purchase-form');
    if (adminPurchaseForm) {
      adminPurchaseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productName = document.getElementById('admin-purchase-product').value;
        const quantity = document.getElementById('admin-purchase-quantity').value;
        const cost = document.getElementById('admin-purchase-cost').value;

        try {
          const response = await fetch('/api/inventory/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productName, quantity: parseInt(quantity), cost: parseFloat(cost) })
          });

          const data = await response.json();
          showMessage(data.message, response.ok ? 'success' : 'error');
          if (response.ok) {
            adminPurchaseForm.reset();
          }
        } catch (error) {
          showMessage('Failed to record purchase', 'error');
        }
      });
    }
  }
}

// Load sales data
async function loadSalesData() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('/api/inventory/sales', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const sales = await response.json();
      displayData(sales, 'sales', ['Product', 'Quantity', 'Price', 'Date']);
    } else {
      showMessage('Failed to load sales data', 'error');
    }
  } catch (error) {
    showMessage('Failed to load sales data', 'error');
  }
}

// Load purchases data
async function loadPurchasesData() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('/api/inventory/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const purchases = await response.json();
      displayData(purchases, 'purchases', ['Product', 'Quantity', 'Cost', 'Date']);
    } else {
      showMessage('Failed to load purchases data', 'error');
    }
  } catch (error) {
    showMessage('Failed to load purchases data', 'error');
  }
}

// Load pending users (Admin only)
async function loadPendingUsers() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('/api/auth/pending-users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const users = await response.json();
      displayUsersData(users);
    } else {
      showMessage('Failed to load pending users', 'error');
    }
  } catch (error) {
    showMessage('Failed to load pending users', 'error');
  }
}

// Display users data with approve buttons
function displayUsersData(users) {
  const container = document.getElementById('admin-data');
  
  if (users.length === 0) {
    container.innerHTML = `<p>No pending users found.</p>`;
    return;
  }

  let table = `<table class="data-table"><thead><tr>`;
  table += `<th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>`;
  table += `</tr></thead><tbody>`;

  users.forEach(user => {
    table += `<tr>`;
    table += `<td>${user.name}</td>`;
    table += `<td>${user.email}</td>`;
    table += `<td>${user.role}</td>`;
    table += `<td><span class="status-${user.status}">${user.status}</span></td>`;
    if (user.status === 'pending') {
      table += `<td><button onclick="approveUser('${user.id}', '${user.role}')" class="approve-btn">Approve</button></td>`;
    } else {
      table += `<td>-</td>`;
    }
    table += `</tr>`;
  });

  table += `</tbody></table>`;
  container.innerHTML = table;
}

// Approve user function (global scope for onclick)
window.approveUser = async function(userId, role) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('/api/auth/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, role })
    });

    const data = await response.json();
    showMessage(data.message, response.ok ? 'success' : 'error');
    
    if (response.ok) {
      // Reload pending users to reflect changes
      await loadPendingUsers();
    }
  } catch (error) {
    showMessage('Failed to approve user', 'error');
  }
}

// Display data in table format
function displayData(data, type, headers) {
  // Try to find the appropriate container based on which sections are visible
  let container = document.getElementById('reports-data');
  if (!container || container.offsetParent === null) {
    // If reports-data doesn't exist or isn't visible, use admin-data
    container = document.getElementById('admin-data');
  }
  
  if (!container) {
    console.error('No container found for displaying data');
    return;
  }
  
  if (data.length === 0) {
    container.innerHTML = `<p>No ${type} data found.</p>`;
    return;
  }

  let table = `<h4>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h4>`;
  table += `<table class="data-table"><thead><tr>`;
  headers.forEach(header => {
    table += `<th>${header}</th>`;
  });
  table += `</tr></thead><tbody>`;

  data.forEach(item => {
    table += `<tr>`;
    if (type === 'sales') {
      table += `<td>${item.productName}</td><td>${item.quantity}</td><td>$${item.price}</td><td>${new Date(item.date).toLocaleDateString()}</td>`;
    } else if (type === 'purchases') {
      table += `<td>${item.productName}</td><td>${item.quantity}</td><td>$${item.cost}</td><td>${new Date(item.date).toLocaleDateString()}</td>`;
    }
    table += `</tr>`;
  });

  table += `</tbody></table>`;
  container.innerHTML = table;
}

// Show message function
function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = 'block';
  
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}