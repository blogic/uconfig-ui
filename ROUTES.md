# Routes
Routes in this project are managed using file-based routing with [@tanstack/react-router](https://github.com/TanStack/router). Using the it's vite expansion, if you are running the project in dev, the auto-generated **src/routeTree.gen.ts** will be updated automatically.

You should not update the **src/routeTree.gen.ts** manually. If the file did not update, you can run the command

```bash
npm run route-gen
```

If you would like to store other files or directories within the src/routes directory, prepend the directory/file name with "-".
