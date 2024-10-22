<!-- Repository Information & Links -->

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Instagram][instagram-shield]][instagram-url]

<p align="center">
  <a href="https://github.com/your-repo/spectrastem">
    <img src="./assets/icon.png" alt="Logo" width="140" height="140">
  </a>
</p>

<h3 align="center">Spectrastem</h3>
<p align="center">
  Deconstruct songs into isolated stems, MIDI tracks, and sheet music.
  <br />
  <a href="path/to/demonstration/video">View Demo</a> ·
  <a href="https://github.com/your-repo/spectrastem/issues">Report Bug</a> ·
  <a href="https://github.com/your-repo/spectrastem/issues">Request Feature</a>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Interface](#interface)
- [Engine](#engine)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!--PROJECT OVERVIEW-->

## Project Overview

Spectrastem is an innovative tool designed to deconstruct songs into isolated audio stems, MIDI tracks, and sheet music, providing musicians and producers with the power to manipulate, remix, and learn from complex audio files. The project is built with a two-part architecture:

1. **Interface**: A React-based web application that offers users an intuitive interface for uploading audio files and viewing separated components.
2. **Engine**: A Flask-based backend server responsible for the actual audio processing, including separating stems, generating MIDI, and creating sheet music.

<!-- GETTING STARTED -->

## Getting Started

These instructions will help you set up the Spectrastem project on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Python 3.x
- ONNX Runtime
- Flask

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/spectrastem.git
    ```

2. Set up both the **interface** and **engine**:
    - [Interface Setup Instructions](interface/README.md)
    - [Engine Setup Instructions](engine/README.md)

### Running the Project

Once both the **interface** and **engine** are set up, follow the specific instructions in their respective README files to run the project.

<!-- INTERFACE -->

## Interface

The **interface** is built using React (Typescript) and Vite to provide an easy-to-use web application for users to interact with the audio processing features. Detailed instructions for the interface setup and usage are available [here](./interface/).

<!-- ENGINE -->

## Engine

The **engine** is a Flask server that handles the core functionality of Spectrastem, including stem separation, MIDI generation, and sheet music creation. To dive deeper into how to configure and run the engine, refer to the dedicated [engine README](./engine/).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open-source community such a wonderful place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

- **Author**: [Eddie Sosera](mailto:eddiesoserawork@gmail.com)  
- **Project Link**: https://github.com/eddiesosera/spectrastem-frontend

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- ONNX by Linux for model support. [View documentation](
- Librosa for audio processing. [View documentation](https://librosa.org/doc/latest/index.html)
- Demucs by Meta for stem processing. [View documentation](https://github.com/adefossez/demucs)
- BasicPitch by Spotify for MIDI processing. [View documentation](https://basicpitch.spotify.com/))  

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/eddiesosera
[instagram-shield]: https://img.shields.io/badge/-Instagram-black.svg?style=flat-square&logo=instagram&colorB=555
[instagram-url]: https://www.instagram.com/engineeredimagination
