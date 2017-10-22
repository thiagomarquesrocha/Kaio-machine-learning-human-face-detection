# Kaio: face detectetion predicting emotion
Machine Learning project a case study focused on the interaction with digital characters, using a character called "Kaio", which, based on the automatic detection of facial expressions and classification of emotions, interacts with humans by classifying emotions and imitating expressions. As a result the tool is able to classify three emotions (sadness, anger and happiness). The project was made with **Android Mobile Vision, Django, Scikit Learn, Pharser JS and Jquery**.

![Overview](https://raw.githubusercontent.com/thiagomarquesrocha/Kaio-machine-learning-human-face-detection/master/kaio/images/visao_geral.png)

### Demo

**Animation states**

Kaio has 4 states

![Animation](https://raw.githubusercontent.com/thiagomarquesrocha/Kaio-machine-learning-human-face-detection/master/kaio/images/animacoes_estado_personagem.png)

**How to learning and detecting human face emotion**

Kaio need to learn how humans interact then detect the facial expression in real time

![Smile](https://raw.githubusercontent.com/thiagomarquesrocha/Kaio-machine-learning-human-face-detection/master/kaio/images/smile_face_detection.png)


### Architecture

The architecture was divided by three components: 


- Cellphone: face expression detector; 
- Server: Emotion classifier;
- Web: Character digital.

![Architecture](https://raw.githubusercontent.com/thiagomarquesrocha/Kaio-machine-learning-human-face-detection/master/kaio/images/Arquitetura.jpg)

### Data exploration:

- 4264 face expressions
- 5 features
- 12 distinct users


### Install

This project requires **Python 2.7** and the following Python libraries installed:

- [NumPy](http://www.numpy.org/)
- [Pandas](http://pandas.pydata.org/)
- [matplotlib](http://matplotlib.org/)
- [scikit-learn 0.19.0](http://scikit-learn.org/stable/)
- [scipy](https://www.scipy.org/)
- [django](https://www.djangoproject.com/)
- [python-socketio](http://python-socketio.readthedocs.io/en/latest/)


You will also need to have software installed to run and execute a [Jupyter Notebook](http://ipython.org/notebook.html)

If you do not have Python installed yet, it is highly recommended that you install the [Anaconda](http://continuum.io/downloads) distribution of Python, which already has the above packages and more included. Make sure that you select the Python 2.7 installer and not the Python 3.x installer.

### Code

Template code is provided in the `kaio/kaio.ipynb` notebook file. You will also be required to use the included `visuals.py` Python file and the `detect.csv`, `training.csv`, and `training_wo_outliers.csv` dataset file to complete your work.

### Run

In a terminal or command window, navigate to the project sub directory `server/` or `kaio/` and run one of the following commands:

#### ANALYSIS

In `kaio/` execute:

```bash
ipython notebook kaio.ipynb
```  
or
```bash
jupyter notebook kaio.ipynb
```

This will open the Jupyter Notebook software and project file in your browser.

#### TEST

In `server/` execute:

__Front__

Run the emotion classify server/front

```bash
python manage.py runserver [IP]:[PORT]
```

__Server__

Run the socket.io server to connect front and server

```bash
python server.py
```


### Data

The Kaio dataset consists of 4264 data points, with each datapoint having 5 features.

- `training.csv` - Without preprocessing
- `training_wo_outliers.csv` - With preprocessing where was removed outliers 

**Features**

1.  `user`: user id

2. `rate_blink_left`: percentage the user blinked left eye (0.0 until 1.0)

3. `rate_blink_right`: percentage the user blinked right eye (0.0 until 1.0)

4. `rate_smile_or_not`: percentage the user smile (0.0 until 1.0)

**Target Variable**

1. `feel`: emotion (0-sadness | 1-angry | 2-happiness)
