console.log(__dirname);

module.exports = {
  testMode: {
    noEmail: !process.env.SENDGRID_USERNAME,
    debugEmail: !process.env.SENDGRID_USERNAME
  },
  security: {
    maxFailedLogins: 3,
	loginOnRegistration: true,
  },
  local: {
    sendConfirmEmail: true,
    requireEmailConfirm: false,
	emailUsername: true,
    confirmEmailRedirectURL: '/confirm-email'
  },
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: 'admin',
    password: 'Mysweetayanda',
    userDB: 'sl-users',
    couchAuthDB: '_users'
  },
   mailer: {
    fromEmail: process.env.FROM_EMAIL || 'info@outsourcenow.us',
    transport: require('nodemailer-sendgrid-transport'),
    options: {
      service: 'Gmail',
        auth: {
          user: 'outsourcenowltd@gmail.com',
          pass: 'qnwrhxcuhstehxyj'
        }
    }
  },
  session: {
    adapter: 'local',
    redis: {
      url: process.env.REDIS_URL
    }
  },
  userModel: {
   whitelist: ['profile.fullname', 'profile.profilepic', 
   'profile.email', 'profile.businessname', 'profile.create_views', 
   'profile.first_time','profile.terminal', 'profile.datecreated',
   'profile.enabletouchid', 'profile.paymentplan']
	},
  userDBs: {
    model: {
      zpos: {
        designDocs: [],
        permissions: ['_reader', '_writer', '_replicator']
      }
    },
    defaultDBs: {
      private: ['zpos']
    },
    privatePrefix: 'on',
    designDocDir: __dirname + '/designDocs'
  },
  providers: {
    facebook: {
      credentials: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET,
        profileURL: 'https://graph.facebook.com/v2.4/me',
        profileFields: ['id', 'name', 'displayName', 'emails', 'age_range', 'link', 'gender', 'locale', 'timezone', 'updated_time', 'verified', 'picture', 'cover']
      },
      options: {
        scope: ['email', 'public_profile'],
        display: 'popup'
      }
    },
    google: {
      credentials: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET
      },
      options: {
        scope: ['profile', 'email']
      }
    }
    
  }
};
