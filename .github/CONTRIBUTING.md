## Contributing
Anyone is welcome to open [issues](https://github.com/BauwenDR/osta/issues) and/or pull-requests for bugfixes, feature-requests and/or ideas. If unsure where to start we encourage you to open a [discussion](https://github.com/BauwenDR/osta/discussions) topic first.

## How to build
### Required programs
In order to build the app make sure you have the following installed:
- NodeJS + NPM
- Java 17 (Android does not support JDK 21 yet)
- Gradle (or an IDE with build in gradle tools)

### Installing
In case the Ionic framework has not been installed, install this first
```bash
npm install --global @ionic/cli
```

#### Running in webbrowser
Run the following command, a browser window should open automatically. If this does not happen, navigate to http://localhost:8100
```bash
npm run web
```

#### Running on Android
Before building for Android make sure you have a compatible Android device (Android 5.5 or higher) connected. 
Before running the following make sure the connected device is also in debug mode.
```bash
npm run android
```

## Adding new features
Before you start coding, follow these steps:

### 1. Fork the project:
  - To begin working on the OSTA project, you’ll need the source code. Fork the main repository to create your own copy.
  - Click the “Fork” button on the top right of the repository page.

### 2. Make your changes
  - Implement the new feature or fix the issue in your branch.
  - Commit your changes with clear and concise messages.

### 3. Pull request
  - Follow the [checklist](https://github.com/BauwenDR/osta/blob/main/.github/pull_request_template.md) to make sure that you're 100% done.
  - Once your changes are ready, open a pull request (PR) to merge your branch into to main repository

Happy coding! 🚀
