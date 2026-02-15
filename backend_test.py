import requests
import sys
import json
import tempfile
import os
from datetime import datetime
from PIL import Image as PILImage
import io

class NextJSAPITester:
    def __init__(self, base_url="https://7eea4923-fa73-44b8-bd6f-bf1f9153a434.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.headers.get('content-type', '').startswith('application/json'):
                    try:
                        response_data = response.json()
                        print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    except:
                        pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Connection Error: {str(e)}")
            return False, None
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_admin_create_project_unauthorized(self):
        """Test creating a project without authentication (should fail)"""
        success, response = self.run_test(
            "Admin Create Project (Unauthorized)",
            "POST",
            "api/admin/projects/create",
            401,
            data={
                "name": "Test Project",
                "category": "architecture",
                "cover_image_url": "https://example.com/image.jpg"
            }
        )
        return success

    def test_admin_update_project_unauthorized(self):
        """Test updating a project without authentication (should fail)"""
        success, response = self.run_test(
            "Admin Update Project (Unauthorized)",
            "PUT",
            "api/admin/projects/update",
            401,
            data={
                "id": "test-id",
                "name": "Updated Test Project"
            }
        )
        return success

    def test_home_page(self):
        """Test if the home page loads"""
        success, response = self.run_test(
            "Home Page Load",
            "GET",
            "",
            200
        )
        return success

    def test_projects_page(self):
        """Test if the projects page loads"""
        success, response = self.run_test(
            "Projects Page Load",
            "GET",
            "projects",
            200
        )
        return success

    def test_project_detail_not_found(self):
        """Test project detail page with non-existent slug"""
        success, response = self.run_test(
            "Project Detail Not Found",
            "GET",
            "projects/test1",
            200  # Should return 200 with not-found content, not 404
        )
        
        # Check if the response contains the not-found content
        if success and response:
            content = response.text
            if 'Project Not Found' in content and 'test1' in content:
                print(f"   ✅ Contains not-found message with slug 'test1'")
                return True
            else:
                print(f"   ❌ Missing not-found message or slug not displayed")
                return False
        return success

def main():
    print("🚀 Starting Next.js API Testing...")
    print("=" * 60)
    
    # Setup
    tester = NextJSAPITester("http://localhost:3000")
    
    # Test API endpoints
    print("\n📡 Testing API Endpoints...")
    tester.test_admin_create_project_unauthorized()
    tester.test_admin_update_project_unauthorized()
    
    # Test page routes
    print("\n🌐 Testing Page Routes...")
    tester.test_home_page()
    tester.test_projects_page() 
    tester.test_project_detail_not_found()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Tests Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())