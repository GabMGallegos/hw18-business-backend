# hw18-business-backend

Backend responsible for business rules. It does not connect directly to MongoDB.

## Environment

Copy `.env.example` to `.env` and configure:

```env
PORT=3010
HOST=0.0.0.0
DATA_API_BASE_URL=http://10.0.0.6:4010/data
CORS_ORIGIN=*
```

## Run

```bash
npm install
npm start
```

## Main base URL

```text
http://10.0.0.5:3010/computerstore
```
