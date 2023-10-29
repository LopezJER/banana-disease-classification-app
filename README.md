# Image Data Asset Management Tool
**Description:** GUI-based app that supports the training of banana disease detection models.

---

## Table of Contents
- [Description](#description)
    - [Technologies](#technologies) 
- [How to Use](#how-to-use)
    - [Install Locally](#install-locally)
    - [Install in a Docker Container](#install-in-a-docker-container)
- [Goals & Instructions](#goals--instructions)

---

## Description
Image Data Asset Management Tool is a graphical user interface (GUI) based app that supports the training of banana disease detection models by facilitating efficient image validation, updating, and management.

### Technologies
- Python 3
- Flask 2
- SQLite 3
- Flask-SQLAlchemy 3
- pandas 2

[&#9650; Back to the Top](#image-data-asset-management-tool)

---

## How to Use

### Install Locally
- Clone [this repository](https://github.com/Deep-Computer-Vision/image-data-asset-management-tool-deep-computer-vision-team). ([Not sure how?](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository))

- Install [Python](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/latest/installation/#installation).

- Run the following to command to ensure that Python and pip are installed correctly: ([Not on Path?](https://realpython.com/add-python-to-path/))
    - On Windows
        ```
        python --version && pip --version
        ```
    - On Linux/Unix or MacOS
        ```
        python3 --version && pip --version
        ```
        Versions of installed Python and pip should be displayed.

- On the root directory of the project, run the following command to install necessary [Python packages](https://github.com/Deep-Computer-Vision/image-data-asset-management-tool-deep-computer-vision-team/blob/main/requirements.txt) using pip.
    ```
    pip install -r requirements.txt
    ```

- On the root directory of the project, run the following command to start the project.
    ```
    flask run
    ```

- Enter the following to the address bar of a browser.
    ```
    localhost:5000
    ```

- If an error occurs, try repeating the steps.

[&#9650; Back to the Top](#image-data-asset-management-tool)

### Install in a Docker Container

- Clone [this repository](https://github.com/Deep-Computer-Vision/image-data-asset-management-tool-deep-computer-vision-team). ([Not sure how?](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository))

- Install [Docker Desktop](https://docs.docker.com/engine/install/#desktop).

- Open Docker Desktop.

- Run the following command to ensure that Docker is running.
    ```
    docker ps -a
    ```
    All containers should be displayed.

- On the root directory of the project, run the following command create an image.
    ```
    docker build -t username/image-data-asset-management-tool:1.0 .
    ```
    Feel free to edit 'username' into your username and '1.0' to the current version of the project.

- On the root directory of the project, run the following command to run a new container that pulled the recently created image.
    ```
    docker run -p 5000:5000 username/image-data-asset-management-tool:1.0
    ```
    If the username and version used is different, then use the username and version used during the building of an image.

- Enter the following to the address bar of a browser.
    ```
    localhost:5000
    ```

- If an error occurs, try repeating the steps.

[&#9650; Back to the Top](#image-data-asset-management-tool)

---

## Goals & Instructions

Kindly download the sample dataset at this [Google Drive](https://drive.google.com/drive/folders/1ozIIgAa56q-YADreYt_tZJJvDGT0eVwA?usp=sharing).


The objective of this project is to develop an image data asset management tool tailored to our specific needs. The tool's primary purpose is to support the training of our banana disease detection models by facilitating efficient image validation, updating, and management. By creating a user-friendly graphical user interface (GUI), we aim to streamline the process of handling image assets and maximize the accuracy of our detection models. Additionally, the tool will prove invaluable as we gather images from diverse fieldwork sites, enabling us to establish a cohesive and organized system for uploading, validating, and maintaining these images.

Project Goals:
1.	Improved Querying: The tool should provide a straightforward mechanism to search images for visual inspection. Notably, the tool should allow filtering of images based on specific metadata.
2.	Easy Updating: The GUI should enable authorized users to easily update image metadata. This feature is vital for refining the accuracy of our disease detection models over time.
3.	Efficient Workflow: By incorporating a user-friendly interface, the tool aims to expedite the process of validating and managing images. This efficiency will lead to quicker model training and improvements in our detection capabilities.

[&#9650; Back to the Top](#image-data-asset-management-tool)