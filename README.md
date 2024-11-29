# frogbar Client
## Requirements

The versions represent the versions used during the development phase.

- pnpm \[9.14.2\]

## Running the client

1. Set server address of socket to your domain or IP on which server is hosted.
```python
const socket = io("http://localhost:3000");
```

2. Install dependencies
```
pnpm install
```

3. Run the client using following command:
- Dev Environment:
```
pnpm run dev
```

- Production Environment:
```
pnpm run build
```
Now, you can host the static assets in `dist` directory on your server.