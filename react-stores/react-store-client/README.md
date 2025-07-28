### Generating the SpacetimeDB Module files
```bash
spacetime generate --lang typescript --out-dir src/module_bindings --project-path ../../quickstart-chat-server-template
```

### Running the App
Note: it cannot run on the default port `3000`, as the SpacetimeDB server runs on port 3000 by default
```bash
next dev --turbopack -p 3001
```
