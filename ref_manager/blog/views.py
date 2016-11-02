from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
import json
from .models import Reference
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from .forms import LoginForm
from django.views.decorators.csrf import csrf_exempt


def login_request(request):
    return render(request, 'login.html', {'form': LoginForm})


def authentication(request):
    if request.method == 'POST':
        try:
            username = str(request.POST["username"])
            password = str(request.POST["password"])
            print(username, password)
        except KeyError:
            return JsonResponse({"error": "login credentials not given"})

        user = authenticate(username=username, password=password)
        print(user)
        if user:
            login(request, user)
            print("I was here")
            return HttpResponseRedirect('/home')
    return HttpResponseRedirect('/')


@login_required(login_url='/')
def home(request):
    return render(request, 'references.html')

@login_required(login_url='/')
def references(request):
    """ Handles /references """
    if request.method == 'GET':
        return get_references(request)

    elif request.method == 'DELETE':
        return delete_reference(request)

    elif request.method == 'POST':
        return edit_reference(request)

    elif request.method == 'PUT':
        return create_reference(request)

    else:
        print("invalid request")
        return JsonResponse({'error': 'Invalid request'})


def get_references(request):
    """GET
    @param: request object to get the user
    @return: All references created by the given user
    """
    user = request.user
    try:
        references = Reference.objects.filter(user=user)
    except:
        return JsonResponse({'error': 'User not authenticated'})

    result = {'error': None, 'data': []}
    for reference in references.values():
        result['data'].append({
            'title': reference['title'],
            'link': reference['link'],
            'notes': reference['notes'],
            'refid': reference['id']
        })

    return JsonResponse(result)


def delete_reference(request):
    """DELETE
    @param: request object for getting list of ids to delete
    Deletes the given refernces
    """

    data = json.loads(request.body.decode())

    try:
        for id in data['refids']:
            reference = Reference.objects.get(id=id)
            reference.delete()
    except:
        return JsonResponse({'error': 'Need refids'})

    return JsonResponse({'success': 'Successfully deleted the references'})


def create_reference(request):
    """PUT
    @param: request object to get details about the reference
    Creates the new reference
    """

    data = json.loads(request.body.decode())
    print(data)
    try:
        ref = Reference(
                title=data['title'],
                link=data['link'],
                notes=data['notes'],
                user=request.user
            )
    except:
        return JsonResponse({'error': 'Require title, link and notes'})

    ref.save()
    return JsonResponse({'refid': ref.id})


def edit_reference(request):
    """ POST
    @param: request object to get id of reference and details
    Edits the given reference
    """

    data = json.loads(request.body.decode())
    try:
        reference = Reference.objects.get(id=data['refid'])
    except:
        return JsonResponse({'error': 'Invalid id'})

    try:
        reference.title = data['title']
        reference.link = data['link']
        reference.notes = data['notes']
    except:
        return JsonResponse({'error': 'Require title, link and notes'})

    reference.save()
    return JsonResponse({'refid': reference.id})


def signup(request):
    return render(request, 'signup.html', {})


def group(request):
    return render(request, 'group.html', {})
