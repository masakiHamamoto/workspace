from django.test import TestCase, Client
from blog.models import Reference
from django.contrib.auth.models import User


class ReferenceTestCast(TestCase):
    def setUp(self):
        self.client = Client()

        # creating a test user
        user = User.objects.create(username='test_user', password='12345')
        # logging into the client
        self.client = self.client.login(username='testuser', password='12345')

        # test the PUT request
        # creating a test reference
        self.client.put(
                    '/references/',
                    {
                        "title": "Ref",
                        "link": "google.com",
                        "notes": "The Search Engine"
                    })

        # checking if user is authenticated
        # self.assertIn('_auth_user_id', self.client.session)

        self.test_ref = Reference.objects.create(
                            title='Ref',
                            link='google.com',
                            notes='The Search Engine')
        self.test_ref.save()

    def test_get_references(self):
        """Checking the GET Request"""
        response = self.client.get('/references', {"refid": self.test_ref.id})
        self.assertEqual(response.status_code, 200)
        self.assertEquals(
            json.loads(response.content),
            {
                'title': 'Ref',
                'link': 'google.com',
                'notes': 'The Search Engine'
            })

    def test_edit_references(self):
        """Checking the POST Request"""
        response = self.client.POST(
            '/references',
            {
                "title": "Edited Ref",
                "link": "google.com",
                "notes": "This has been edited",
                "refid": self.test_ref.id
            })

        # Updating the test_ref
        self.test_ref = Reference.objects.all(id=self.self.test_ref.id)

        self.assertEqual(self.test_ref.title, "Edited Ref")
        self.assertEqual(self.test_ref.link, "google.com")
        self.assertEqual(self.test_ref.notes, "This has been edited")
        self.assertEqual(json.loads(response.content).refid, self.test_ref.id)

    def test_delete_reference(self):
        """Checking the DELETE Request"""
        response = self.client.delete('/references',
                                      {"refid": self.test_ref.id})

        ref = Reference.objects.all()
        self.assertEqual(len(ref), 0)
