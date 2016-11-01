#!/bin/bash

echo "Now installing all Python tools"

function virtualenv_dep_install {
    cd ref_manager
    if [ ! -d venv/bin ]; then
	virtualenv venv 
	echo "Created virtual environment"
    fi
    if [ ! -f venv/updated ]; then
	source venv/bin/activate
	pip install -r requirements.txt
	touch venv/updated
	echo "Installed python packages"
    fi
}

function virtualenv_install {
    echo "Installing virtualenv, it may ask for SUDO password"
    sudo pip install virtualenv
}

if [ ! -z `which virtualenv` ]; then
    virtualenv_install
fi

virtualenv_dep_install
echo "Now performing Django tasks"
python manage.py makemigrations
python manage.py migrate
