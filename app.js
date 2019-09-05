const express = require("express"); // https://www.npmjs.com/package/express
const session = require("express-session"); // https://www.npmjs.com/package/express-session
const passport = require("passport"); // https://www.npmjs.com/package/passport
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy; // https://www.npmjs.com/package/ibmcloud-appid

const app = express();

// Warning The default server-side session storage implementation, MemoryStore,
// is purposely not designed for a production environment. It will
// leak memory under most conditions, it does not scale past a single process,
// and is meant for debugging and developing.
// For a list of stores, see compatible session stores below
// https://www.npmjs.com/package/express-session#compatible-session-stores
app.use(
  session({
    secret: "123456",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(
  new WebAppStrategy({
    tenantId: "",
    clientId: "",
    secret: "",
    oauthServerUrl: "",
    redirectUri: "http://localhost:3000/appid/callback"
  })
);

// Handle callback
app.get("/appid/callback", passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Protect the whole app
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Serve static resources
app.use(express.static("./public"));

// Start server
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
