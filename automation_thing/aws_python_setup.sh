#!/bin/bash

echo "Now installing all Python tools necessary for install of Boto"

function virtualenv_dep_install {
    if [ ! -x venv/bin/pip ]; then
	virtualenv venv
    fi
    venv/bin/python venv/bin/pip install -r requirements.txt
}

function virtualenv_install {
    echo "Installing virtualenv, it may ask for SUDO password"
    sudo pip install virtualenv
}

if [ ! -z `which virtualenv` ]; then
    virtualenv_install
fi
