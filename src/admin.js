// admin.js
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJSExpress from '@adminjs/express';
import { User } from './models/user.models.js';
import Product from './models/products.models.js';
import Order from './models/order.models.js';
import express from 'express';
import session from 'express-session';

// Register the mongoose adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// Define the admin options with read-only access
const adminOptions = {
  resources: [
    {
      resource: User,
      options: {
        actions: {
          edit: { isAccessible: false },
          delete: { isAccessible: false },
          new: { isAccessible: false },
        },
        properties: {
          password: { isVisible: false },
          refreshToken: { isVisible: false },
        },
      }
    },
    {
      resource: Product,
      options: {
        actions: {
          edit: { isAccessible: true },
          delete: { isAccessible: true },
          new: { isAccessible: true },
        }        
      }
    },
    {
      resource: Order,
      options: {
        actions: {
          edit: { isAccessible: false },
          delete: { isAccessible: false },
          new: { isAccessible: false },
        }
      }
    }
  ],
  branding: {
    companyName: 'Food App Admin',
    logo: false,
  },
  rootPath: '/admin',
};

// Create AdminJS instance
const admin = new AdminJS(adminOptions);

// Create router
const router = express.Router();

// Add session middleware
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Build authenticated router with built-in authentication
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      // Replace these with environment variables in production
      if (email === 'admin@example.com' && password === 'password') {
        return { email };
      }
      return null;
    },
    cookiePassword: 'some-secret-cookie-password',
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: 'another-secret-key',
  }
);

export { adminRouter };