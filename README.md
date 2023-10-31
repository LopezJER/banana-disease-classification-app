# Banana Disease Classification App
**Description:** Provides AI-assisted automatic labelling of banana images with unknown disease classes.

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
Banana Disease Classification App aims to provide AI capabilities to the existing tool, allowing AI-assisted automatic labelling of banana images with unknown disease classes.

### Technologies
- Python 3
- Flask 2
- SQLite 3
- Flask-SQLAlchemy 3
- pandas 2
- TensorFlow
- scikit-learn
- Jupyter
- NumPy

[&#9650; Back to the Top](#banana-disease-classification-app)

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

[&#9650; Back to the Top](#banana-disease-classification-app)

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

[&#9650; Back to the Top](#banana-disease-classification-app)

---

## Goals & Instructions

It hosts the necessary components for preparing a dataset for banana disease image classification, training and evaluating a banana disease classifier, and deploying it to a web application. Specifically, it contains
  - Data engineering files such as scripts used to preprocess and split the dataset,
  - Classification models and Jupyter notebooks clearly documeting the training and evaluation process of the models, and
  - The Flask web application that requests predictions from the best-performing banana disease classification model.

Please download the dataset at: 
- Download the dataset: [GoogleDrive Link](https://drive.google.com/file/d/1B_bPOivLtsHwtGcYVOl8i3TNsZMcx-Sy/view?usp=sharing) 
- Alternatively, copy and past the link: https://drive.google.com/file/d/1B_bPOivLtsHwtGcYVOl8i3TNsZMcx-Sy/view?usp=sharing

[&#9650; Back to the Top](#banana-disease-classification-app)