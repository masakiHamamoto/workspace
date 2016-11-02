from django.test import TestCase, Client
from .models import Reference
from django.contrib.auth.models import User
import json


class ReferenceTestCast(TestCase):
    def setUp(self):
        pass
        self.client = Client()

        # creating a test user
        user = User.objects.create(username='test_user')
        user.set_password('12345')
        user.save()
        # logging into the client
        c = self.client.login(username='test_user', password='12345')

        # checking if user is authenticated
        self.assertIn('_auth_user_id', self.client.session)

        self.test_ref = Reference.objects.create(
                            title='Ref',
                            link='google.com',
                            notes='The Search Engine',
                            user=user)

        self.test_ref.save()

    def test_get_references(self):
        """Checking the GET Request"""
        response = self.client.get('/references', {"refid": self.test_ref.id})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())['data'][0]
        self.assertEqual('Ref', data['title'])
        self.assertEqual('google.com', data['link'])
        self.assertEqual('The Search Engine', data['notes'])

    def test_edit_references(self):
        """Checking the POST Request"""
        data = '{"title": "Edited Ref","link": "google.com","notes": "This has been edited","refid": ' + str(self.test_ref.id) + '}'
        response = self.client.post('/references', data=data, content_type='application/octet-stream')
        print("Res", json.loads(response.content.decode()))

        # Updating the test_ref
        self.test_ref = Reference.objects.get(id=self.test_ref.id)

        self.assertEqual(self.test_ref.title, "Edited Ref")
        self.assertEqual(self.test_ref.link, "google.com")
        self.assertEqual(self.test_ref.notes, "This has been edited")

    def test_delete_reference(self):
        """Checking the DELETE Request"""
        data = '{"refids": ' + str([self.test_ref.id]) + '}'
        response = self.client.delete('/references', data)
        ref = Reference.objects.all()
        self.assertEqual(len(ref), 0)
