// Sample data for testing the application with Supabase
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { User, Sale, Purchase } = require('./src/utils/db');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('🔗 Connecting to Supabase...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Sale.deleteMany({});
    await Purchase.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('👥 Creating sample users...');

    const users = [
      {
        name: 'Admin User',
        email: 'admin@company.com',
        password: hashedPassword,
        role: 'Admin',
        status: 'active'
      },
      {
        name: 'Manager User',
        email: 'manager@company.com',
        password: hashedPassword,
        role: 'Manager',
        status: 'active'
      },
      {
        name: 'Sales Person',
        email: 'sales@company.com',
        password: hashedPassword,
        role: 'Salesman',
        status: 'active'
      },
      {
        name: 'Purchase Manager',
        email: 'purchase@company.com',
        password: hashedPassword,
        role: 'PurchaseMan',
        status: 'active'
      },
      {
        name: 'Pending User',
        email: 'pending@company.com',
        password: hashedPassword,
        role: 'Salesman',
        status: 'pending'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      try {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }

    // Find specific users for sample data
    const salesmanUser = createdUsers.find(u => u.role === 'Salesman');
    const purchaseUser = createdUsers.find(u => u.role === 'PurchaseMan');

    if (salesmanUser && purchaseUser) {
      // Create sample sales
      console.log('💰 Creating sample sales...');
      const sales = [
        {
          product_name: 'Laptop',
          quantity: 5,
          price: 999.99,
          date: new Date('2024-01-15').toISOString(),
          salesman_id: salesmanUser.id
        },
        {
          product_name: 'Mouse',
          quantity: 20,
          price: 25.50,
          date: new Date('2024-01-20').toISOString(),
          salesman_id: salesmanUser.id
        },
        {
          product_name: 'Keyboard',
          quantity: 15,
          price: 45.00,
          date: new Date('2024-01-25').toISOString(),
          salesman_id: salesmanUser.id
        }
      ];

      for (const saleData of sales) {
        try {
          await Sale.create(saleData);
          console.log(`✅ Created sale: ${saleData.product_name}`);
        } catch (error) {
          console.error(`❌ Failed to create sale ${saleData.product_name}:`, error.message);
        }
      }

      // Create sample purchases
      console.log('🛒 Creating sample purchases...');
      const purchases = [
        {
          product_name: 'Laptop',
          quantity: 10,
          cost: 750.00,
          date: new Date('2024-01-10').toISOString(),
          purchaseman_id: purchaseUser.id
        },
        {
          product_name: 'Mouse',
          quantity: 50,
          cost: 15.00,
          date: new Date('2024-01-12').toISOString(),
          purchaseman_id: purchaseUser.id
        },
        {
          product_name: 'Keyboard',
          quantity: 30,
          cost: 30.00,
          date: new Date('2024-01-14').toISOString(),
          purchaseman_id: purchaseUser.id
        }
      ];

      for (const purchaseData of purchases) {
        try {
          await Purchase.create(purchaseData);
          console.log(`✅ Created purchase: ${purchaseData.product_name}`);
        } catch (error) {
          console.error(`❌ Failed to create purchase ${purchaseData.product_name}:`, error.message);
        }
      }
    }

    console.log('\n🎉 === Sample Data Created Successfully ===');
    console.log('🔑 Login credentials (password for all: password123):');
    console.log('   • Admin: admin@company.com');
    console.log('   • Manager: manager@company.com');
    console.log('   • Salesman: sales@company.com');
    console.log('   • PurchaseMan: purchase@company.com');
    console.log('   • Pending User: pending@company.com (needs admin approval)');
    console.log('\n🚀 You can now start the server with: npm start');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.message.includes('Missing Supabase environment variables')) {
      console.log('\n📝 Please make sure to:');
      console.log('1. Set up your Supabase project');
      console.log('2. Update .env file with your SUPABASE_URL and SUPABASE_ANON_KEY');
      console.log('3. Run the database-setup.sql script in your Supabase SQL Editor');
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;