# My Electron App

This project is an Electron application that provides an offline database to store client information. It utilizes HTML, CSS, and JavaScript for the frontend, with Node.js for the backend.

## Project Structure

```
my-electron-app
├── package.json        # Configuration file for npm
├── main.js             # Main process of the Electron application
├── src
│   ├── index.html      # Main HTML file for the frontend
│   ├── style.css       # Styles for the HTML elements
│   ├── renderer.js     # Frontend logic and user interaction
│   └── database.js     # Offline database management
└── README.md           # Documentation for the project
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-electron-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

## Usage

- The application allows users to add, view, and manage client data offline.
- The user interface is built using HTML and styled with CSS.
- The frontend logic is handled by JavaScript in `renderer.js`, while `database.js` manages the offline database functionality.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.