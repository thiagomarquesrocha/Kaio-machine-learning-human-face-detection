# Kaio face detectetion predicting users
Machine Learning project to detect gestures on human faces trying to predict what user is. The project was made with **Django, Scikit learn, Pharser JS and Jquery**.

![Smile](https://raw.githubusercontent.com/thiagomarques2015/face_detectetion_web/master/smile_face_detection.png)

![Smile 2](https://raw.githubusercontent.com/thiagomarques2015/face_detectetion_web/master/smile_face_detection_2.png)

### Data exploration:

- 4264 face expressions
- 5 features
- 12 distinct users


### Install

This project requires **Python 2.7** and the following Python libraries installed:

- [NumPy](http://www.numpy.org/)
- [Pandas](http://pandas.pydata.org/)
- [matplotlib](http://matplotlib.org/)
- [scikit-learn](http://scikit-learn.org/stable/)
- [scipy](https://www.scipy.org/)
- [django](https://www.djangoproject.com/)


You will also need to have software installed to run and execute a [Jupyter Notebook](http://ipython.org/notebook.html)

If you do not have Python installed yet, it is highly recommended that you install the [Anaconda](http://continuum.io/downloads) distribution of Python, which already has the above packages and more included. Make sure that you select the Python 2.7 installer and not the Python 3.x installer.

### Code

Template code is provided in the `server/classify_who_is_notebook.ipynb` notebook file. You will also be required to use the included `visuals.py` Python file and the `detect.csv` and `whois.csv` dataset file to complete your work. While some code has already been implemented to get you started, you will need to implement additional functionality when requested to successfully complete the project. Note that the code included in `visuals.py` is meant to be used out-of-the-box and not intended for students to manipulate. If you are interested in how the visualizations are created in the notebook, please feel free to explore this Python file.

### Run

In a terminal or command window, navigate to the project sub directory `server/` and run one of the following commands:

#### Analysis

```bash
ipython notebook classify_who_is_notebook.ipynb
```  
or
```bash
jupyter notebook classify_who_is_notebook.ipynb
```

This will open the Jupyter Notebook software and project file in your browser.

#### Test

To test the front end application of Kaio

```bash
pyhton manage.py runserver
```  

### Data

The Kaio dataset consists of 4264 data points, with each datapoint having 5 features.

**Features**

1.  `user`: user id

2. `rate_blink_left`: percentage the user blinked left eye (0.0 until 1.0)

3. `rate_blink_right`: percentage the user blinked right eye (0.0 until 1.0)

4. `rate_smile_or_not`: percentage the user smile (0.0 until 1.0)

**Target Variable**

1. `emotion`: feelings (0-sadness | 1-angry | 2-happiness)
