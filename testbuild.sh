#!/bin/bash

cd ref_manager
source venv/bin/activate
python manage.py test
