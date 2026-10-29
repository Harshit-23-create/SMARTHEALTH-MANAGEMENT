# CareFlow HMS — API Reference
**Verified from `backend/server.js` — All endpoints confirmed in source code**

> ⚠️ **Security Note:** All endpoints listed below are **publicly accessible** (no authentication middleware applied). The `authmiddleware.js` exists but is not imported or used in any route.

---

## Base URL

| Environment | URL |
|---|---|
| Local Development | `http://localhost:5000` |
| Production (Render) | Your Render service URL |
| Frontend reads from | `import.meta.env.VITE_API_URL` or falls back to `http://localhost:5000` |

---

## Authentication Endpoints

### POST /register

**Purpose:** Create a new user account  
**Source:** `backend/server.js` L55–93  
**Authentication Required:** No (public)

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "email": "john@medicare.com",
  "password": "securepassword",
  "role": "Doctor"
}
```

**Valid Roles:** `Admin` | `Doctor` | `Nurse` | `Receptionist`

**Success Response (201):**
```json
{
  "message": "User registered successfully ✅"
}
```

**Error Responses:**
| Status | Condition | Message |
|---|---|---|
| 400 | Missing any field | `"All fields are required"` |
| 400 | Email already exists | `"User already exists"` |
| 500 | Server error | `error.message` |

**What happens internally:**
1. Validates all 4 fields present
2. Checks `User.findOne({email})` for duplicates
3. `bcrypt.hash(password, 10)` — 10 salt rounds
4. `new User({...}).save()` — stores in MongoDB
5. Returns 201 (does NOT return user object or token)

---

### POST /login

**Purpose:** Authenticate user, receive JWT  
**Source:** `backend/server.js` L98–156  
**Authentication Required:** No (public)

**Request Body:**
```json
{
  "email": "admin@medicare.com",
  "password": "password123",
  "role": "Admin"
}
```

> Note: `role` field is optional. If sent, user's DB role must match it.

**Success Response (200):**
```json
{
  "message": "Login successful ✅",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "name": "Admin User",
    "email": "admin@medicare.com",
    "role": "Admin"
  }
}
```

**Token details:**
- Signed with `process.env.JWT_SECRET` (fallback: `"supersecretkey123"`)
- Expires: `1d` (24 hours)
- Payload: `{ id: user._id, role: user.role }`

**Error Responses:**
| Status | Condition | Message |
|---|---|---|
| 400 | Missing email or password | `"Email and password are required"` |
| 400 | User not found | `"Invalid email or password"` |
| 400 | Wrong password | `"Invalid email or password"` |
| 400 | Role mismatch | `"Invalid role selected"` |
| 500 | Server error | `error.message` |

---

## Patient Endpoints

> ⚠️ **Schema mismatch:** Frontend sends `gender`, `department`, `doctor`, `contactNumber`. Backend `Patient.js` model only stores `name`, `age`, `disease`, `bed`, `status`. Extra fields are silently dropped by Mongoose.

### GET /patients

**Purpose:** Retrieve all patients sorted by newest first  
**Source:** `backend/server.js` L194–205  
**Authentication Required:** No

**Request:** No body, no query params

**Success Response (200):**
```json
[
  {
    "_id": "64abc123",
    "name": "Eleanor Vance",
    "age": 48,
    "disease": "Cardiovascular Hypertension",
    "bed": "ICU-04",
    "status": "Admitted",
    "createdAt": "2026-10-25T14:30:00.000Z",
    "updatedAt": "2026-10-25T14:30:00.000Z"
  }
]
```

**Mongoose query:** `Patient.find().sort({ createdAt: -1 })`

---

### POST /patients

**Purpose:** Add a new patient  
**Source:** `backend/server.js` L163–191  
**Authentication Required:** No

**Request Body (required fields):**
```json
{
  "name": "John Doe",
  "age": 35,
  "disease": "Type 2 Diabetes",
  "bed": "GEN-22"
}
```

> Note: `status` is **hardcoded** to `"Admitted"` — the body's `status` field is ignored.

**Success Response (201):**
```json
{
  "_id": "64xyz789",
  "name": "John Doe",
  "age": 35,
  "disease": "Type 2 Diabetes",
  "bed": "GEN-22",
  "status": "Admitted",
  "createdAt": "2026-10-26T10:00:00.000Z",
  "updatedAt": "2026-10-26T10:00:00.000Z"
}
```

**Error Responses:**
| Status | Condition | Message |
|---|---|---|
| 400 | Missing name, age, disease, or bed | `"All fields are required"` |
| 500 | Server error | `error.message` |

---

### PUT /patients/:id

**Purpose:** Update patient status  
**Source:** `backend/server.js` L208–241  
**Authentication Required:** No

**URL Parameter:** `:id` — MongoDB ObjectId of the patient

**Request Body:**
```json
{
  "status": "Discharged"
}
```

**Valid status values:** `"Admitted"` | `"Discharged"`  
> ⚠️ Note: Frontend shows "Critical" and "Recovering" but these are **not valid** in the current schema. Sending them returns 400.

**Success Response (200):**
```json
{
  "_id": "64abc123",
  "name": "Eleanor Vance",
  "status": "Discharged",
  ...
}
```

**Error Responses:**
| Status | Condition | Message |
|---|---|---|
| 400 | Invalid status value | `"Invalid status value"` |
| 404 | Patient not found | `"Patient not found"` |
| 500 | Server error | `error.message` |

**Mongoose operation:** `Patient.findByIdAndUpdate(id, {status}, {new:true, runValidators:true})`

---

### DELETE /patients/:id

**Purpose:** Permanently delete a patient record  
**Source:** `backend/server.js` L244–264  
**Authentication Required:** No

**URL Parameter:** `:id` — MongoDB ObjectId of the patient

**Request:** No body

**Success Response (200):**
```json
{
  "message": "Patient deleted successfully"
}
```

**Error Responses:**
| Status | Condition | Message |
|---|---|---|
| 404 | Patient not found | `"Patient not found"` |
| 500 | Server error | `error.message` |

**Mongoose operation:** `Patient.findByIdAndDelete(req.params.id)`

> ⚠️ This is a **hard delete** — the record is permanently removed from MongoDB. Frontend calls it "Discharge" but it actually deletes.

---

## Ambulance Endpoint

### GET /ambulance-location

**Purpose:** Return simulated ambulance GPS coordinates  
**Source:** `backend/server.js` L269–276  
**Authentication Required:** No

**Request:** No body, no params

**Success Response (200):**
```json
{
  "lat": 28.617422,
  "lng": 77.211832
}
```

**How values are computed:**
```javascript
const baseLat = 28.6139;
const baseLng = 77.2090;
const time = Date.now() / 5000;
const lat = baseLat + 0.005 * Math.sin(time);
const lng = baseLng + 0.005 * Math.cos(time);
```

> ⚠️ **This is pure simulation.** The coordinates trace a small circle around New Delhi, India. The `Ambulance.js` model (with real `lat`/`lng` fields) is **never queried**. This endpoint uses no database operations.

**Used by:** `LiveMap.jsx` polls this every 5 seconds to check backend connectivity. The actual ambulance animation uses hardcoded route interpolation — not these coordinates.

---

## Test/Health Endpoint

### GET /

**Purpose:** Verify server is running  
**Source:** `backend/server.js` L281–283  
**Authentication Required:** No

**Success Response (200 text/html):**
```
Hospital Management Backend Running 🚀
```

---

## Endpoints Summary Table

| Method | Path | Auth | DB Operation | Frontend Caller |
|---|---|---|---|---|
| POST | /register | ❌ None | User.save() | RegisterPage.jsx |
| POST | /login | ❌ None | User.findOne() + JWT | LoginPage.jsx |
| GET | /patients | ❌ None | Patient.find() | PatientManagementPage.jsx |
| POST | /patients | ❌ None | new Patient().save() | PatientManagementPage.jsx |
| PUT | /patients/:id | ❌ None | Patient.findByIdAndUpdate() | _(not currently called from UI)_ |
| DELETE | /patients/:id | ❌ None | Patient.findByIdAndDelete() | PatientManagementPage.jsx |
| GET | /ambulance-location | ❌ None | _(no DB query)_ | LiveMap.jsx (polling) |
| GET | / | ❌ None | _(no DB query)_ | _(browser test only)_ |

---

## How to Test APIs (Windows)

### Using curl (PowerShell):
```powershell
# Test server
curl http://localhost:5000/

# Register a user
curl -Method POST -Uri "http://localhost:5000/register" `
  -ContentType "application/json" `
  -Body '{"name":"Test","email":"test@test.com","password":"pass123","role":"Doctor"}'

# Login
curl -Method POST -Uri "http://localhost:5000/login" `
  -ContentType "application/json" `
  -Body '{"email":"admin@medicare.com","password":"password123"}'

# Get all patients
curl http://localhost:5000/patients
```

### Using browser:
- Visit `http://localhost:5000/` — should show "Hospital Management Backend Running 🚀"
- Visit `http://localhost:5000/ambulance-location` — shows JSON with lat/lng
- Visit `http://localhost:5000/patients` — shows patient array (may be empty)

---

## authmiddleware.js (Not Currently Used)

**File:** `backend/middleware/authmiddleware.js`

This middleware **exists but is imported by nothing**. To use it:

```javascript
// server.js — to protect a route:
import authMiddleware from "./middleware/authmiddleware.js";

// Apply to individual routes:
app.get("/patients", authMiddleware, async (req, res) => {
  // req.user = { id, role } — decoded from JWT
});

// Apply to all routes after a point:
app.use(authMiddleware); // All routes defined after this line are protected
```

The middleware reads `Authorization: Bearer <token>` header, verifies JWT with `process.env.JWT_SECRET`, and attaches decoded payload to `req.user`.
