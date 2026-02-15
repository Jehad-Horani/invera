import requests
import sys
import json
import tempfile
import os
from datetime import datetime
from PIL import Image as PILImage
import io

class FileUploadAPITester:
    def __init__(self, base_url="https://7eea4923-fa73-44b8-bd6f-bf1f9153a434.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_project_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                if files:
                    # For file uploads, don't set Content-Type header - let requests handle it
                    response = requests.post(url, data=data, files=files, timeout=30)
                else:
                    if headers is None:
                        headers = {'Content-Type': 'application/json'}
                    response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                if files:
                    response = requests.put(url, data=data, files=files, timeout=30)
                else:
                    if headers is None:
                        headers = {'Content-Type': 'application/json'}
                    response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                if headers is None:
                    headers = {}
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.headers.get('content-type', '').startswith('application/json'):
                    try:
                        response_data = response.json()
                        print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                        return success, response_data
                    except:
                        pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:400]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else None

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Connection Error: {str(e)}")
            return False, None
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def create_test_image(self, filename="test_image.jpg", format="JPEG", size=(200, 200)):
        """Create a test image file"""
        # Create a simple colored image
        img = PILImage.new('RGB', size, color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format)
        img_bytes.seek(0)
        
        return img_bytes

    def test_admin_create_project_with_files_auth(self):
        """Test creating a project with file uploads (with auth)"""
        
        # Create test images
        cover_image = self.create_test_image("cover.jpg")
        gallery_image1 = self.create_test_image("gallery1.jpg", size=(150, 150))
        gallery_image2 = self.create_test_image("gallery2.jpg", size=(180, 180))
        
        # Form data
        data = {
            'name': f'Test File Upload Project {datetime.now().strftime("%H%M%S")}',
            'category': 'architecture',
            'location': 'Test Location',
            'year': '2024',
            'summary': 'Test summary for file upload',
            'story': 'Test story for file upload',
            'scope': 'Test scope for file upload',
            'materials': 'Test materials for file upload',
            'area_sqm': '100',
            'client_name': 'Test Client',
            'is_featured': 'false'
        }
        
        # Files to upload
        files = {
            'cover_image': ('cover.jpg', cover_image, 'image/jpeg'),
            'gallery_images': [
                ('gallery1.jpg', gallery_image1, 'image/jpeg'),
                ('gallery2.jpg', gallery_image2, 'image/jpeg')
            ]
        }
        
        # Set admin auth cookie
        headers = {'Cookie': 'admin_auth=authenticated'}
        
        success, response_data = self.run_test(
            "Admin Create Project (With File Upload & Auth)",
            "POST",
            "api/admin/projects/create",
            200,
            data=data,
            files=files,
            headers=headers
        )
        
        # Save project ID for later tests
        if success and response_data and 'project' in response_data:
            self.created_project_id = response_data['project'].get('id')
            print(f"   ✓ Created project with ID: {self.created_project_id}")
        
        return success, response_data

    def test_admin_update_project_with_files(self):
        """Test updating a project with new files"""
        if not self.created_project_id:
            print("❌ Skipped - No project ID available")
            return False
        
        # Create new test images
        new_cover = self.create_test_image("new_cover.jpg", size=(250, 250))
        new_gallery = self.create_test_image("new_gallery.jpg", size=(200, 200))
        
        data = {
            'id': self.created_project_id,
            'name': f'Updated File Upload Project {datetime.now().strftime("%H%M%S")}',
            'category': 'real_estate',
            'location': 'Updated Location',
            'existing_gallery_urls': '[]'  # Remove all existing gallery images
        }
        
        files = {
            'cover_image': ('new_cover.jpg', new_cover, 'image/jpeg'),
            'gallery_images': ('new_gallery.jpg', new_gallery, 'image/jpeg')
        }
        
        headers = {'Cookie': 'admin_auth=authenticated'}
        
        success, response_data = self.run_test(
            "Admin Update Project (With File Upload)",
            "PUT",
            "api/admin/projects/update",
            200,
            data=data,
            files=files,
            headers=headers
        )
        
        return success

    def test_admin_delete_project_with_storage_cleanup(self):
        """Test deleting a project (should also delete storage files)"""
        if not self.created_project_id:
            print("❌ Skipped - No project ID available")
            return False
            
        headers = {'Cookie': 'admin_auth=authenticated'}
        
        success, response_data = self.run_test(
            "Admin Delete Project (With Storage Cleanup)",
            "DELETE",
            f"api/admin/projects/delete?id={self.created_project_id}",
            200,
            headers=headers
        )
        
        return success

    def test_admin_create_project_file_validation(self):
        """Test file validation (oversized file should fail)"""
        
        # Create a large image (over 5MB)
        large_image = self.create_test_image("large.jpg", size=(3000, 3000))
        
        data = {
            'name': 'Test Validation Project',
            'category': 'architecture'
        }
        
        files = {
            'cover_image': ('large.jpg', large_image, 'image/jpeg')
        }
        
        headers = {'Cookie': 'admin_auth=authenticated'}
        
        success, response_data = self.run_test(
            "Admin Create Project (File Too Large - Should Fail)",
            "POST",
            "api/admin/projects/create",
            400,  # Should return 400 for validation error
            data=data,
            files=files,
            headers=headers
        )
        
        return success

    def test_admin_create_project_invalid_file_type(self):
        """Test invalid file type validation"""
        
        # Create a text file instead of image
        text_file = io.BytesIO(b"This is not an image")
        
        data = {
            'name': 'Test Invalid Type Project',
            'category': 'architecture'
        }
        
        files = {
            'cover_image': ('document.txt', text_file, 'text/plain')
        }
        
        headers = {'Cookie': 'admin_auth=authenticated'}
        
        success, response_data = self.run_test(
            "Admin Create Project (Invalid File Type - Should Fail)",
            "POST",
            "api/admin/projects/create",
            400,
            data=data,
            files=files,
            headers=headers
        )
        
        return success

    def test_admin_create_project_unauthorized(self):
        """Test creating a project without authentication (should fail)"""
        # Create test image
        cover_image = self.create_test_image("cover.jpg")
        
        data = {
            'name': 'Unauthorized Test Project',
            'category': 'architecture'
        }
        
        files = {
            'cover_image': ('cover.jpg', cover_image, 'image/jpeg')
        }
        
        success, response_data = self.run_test(
            "Admin Create Project (Unauthorized)",
            "POST",
            "api/admin/projects/create",
            401,
            data=data,
            files=files
        )
        return success

    def test_projects_page_loads(self):
        """Test if projects page loads (should show uploaded projects)"""
        success, response_data = self.run_test(
            "Projects Page Load",
            "GET",
            "projects",
            200
        )
        return success

def main():
    print("🚀 Starting Next.js File Upload API Testing...")
    print("=" * 60)
    
    # Setup
    tester = FileUploadAPITester("https://7eea4923-fa73-44b8-bd6f-bf1f9153a434.preview.emergentagent.com")
    
    # Test file upload functionality
    print("\n📡 Testing File Upload API Endpoints...")
    
    # Test unauthorized access first
    tester.test_admin_create_project_unauthorized()
    
    # Test file validation
    tester.test_admin_create_project_file_validation()
    tester.test_admin_create_project_invalid_file_type()
    
    # Test successful file upload workflow
    tester.test_admin_create_project_with_files_auth()
    tester.test_admin_update_project_with_files()
    tester.test_admin_delete_project_with_storage_cleanup()
    
    # Test pages load
    print("\n🌐 Testing Page Routes...")
    tester.test_projects_page_loads()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Tests Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All file upload tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())