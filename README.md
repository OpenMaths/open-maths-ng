# openmaths-app

World's first mathematical IDE

## Installation

`./install`

### Running

Server runs on port 8088

Tests run on port 8087

static.* should run on 8089

api.* should run on 8080

### Random TODOs

use jscs jshint in gulp
traverse
Font: https://github.com/andreberg/Meslo-Font
Font-Awesome license

### Google Cloud SDK

    gcloud auth login
    gcloud config set project open-maths
    # gcloud compute config-ssh
    gcloud compute ssh openmaths-app --zone europe-west1-b
    
    # sudo apt-get update && sudo apt-get install apache2 nodejs nodejs-legacy php5
    cd ~ && mkdir src && cd src && git clone https://github.com/OpenMaths/openmaths-app.git
    cd openmaths-app && ./install && ./distill
    cd /var/www/
    sudo cp ~/src/openmaths-app/dist/index.html html/
    sudo cp -r ~/src/openmaths-app/dist/app/ html/
