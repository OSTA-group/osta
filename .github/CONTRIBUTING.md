## Contributing
Anyone is welcome to open [issues](https://github.com/BauwenDR/osta/issues) and/or pull-requests for bugfixes, feature-requests and/or ideas. If unsure where to start we encourage you to open a [discussion](https://github.com/BauwenDR/osta/discussions) topic first.

## How to build
### Required programs
In order to build the app make sure you have the following installed:
- NodeJS + NPM
- Java 17 (Android does not support JDK 21 yet)
- Gradle (or an IDE with built-in gradle tools)

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

## Submitting Issues
Before submitting an issue, double-check that it is not a duplicate.

For big feature requests, we recommend first opening a discussion on the [discussions page](https://github.com/BauwenDR/osta/discussions/categories/ideas).

## Submitting Issues and Adding New Features

### 1. Check Discussions/Issues
- **Review Discussions:** Check the discussions page to see if the feature has already been sugested (or possibly rejected).
- **Start a Discussion for Major Features:** For major features, start a discussion to gather feedback and suggestions. This ensures that any changes to the workflow are considered.
- **Analyze Thoroughly:** Once the feature is thoroughly analyzed, new issue(s) will be created, and you can begin working on the issue.

### 2. Fork the Project
- **Fork the Repository:** Fork the main repository to create your own copy. Click the “Fork” button on the top right of the repository page.

### 3. Make Your Changes
- **Implement Changes:** Work on the new feature or fix the issue in your branch.
- **Commit Your Changes:** Commit your changes with clear and concise messages.

### 4. Pull Request
- **Follow the Checklist:** Ensure you follow the [checklist](https://github.com/BauwenDR/osta/blob/main/.github/pull_request_template.md) to confirm you are 100% done.
- **Open a Pull Request (PR):** Once your changes are ready, open a PR to merge your branch into the main repository.


Happy coding! 🚀
