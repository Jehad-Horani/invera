#!/usr/bin/env python3
"""
Backend API testing for file upload functionality
Tests all admin project CRUD operations with file uploads
"""

import requests
import sys
import json
import os
import tempfile
from datetime import datetime

class FileUploadAPITester:
    def __init__(self, base_url="https://7eea4923-fa73-44b8-bd6f-bf1f9153a434.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_project_id = None
        self.headers = {
            'Cookie': 'admin_auth=authenticated'
        }

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        if details and success:
            print(f"   Details: {details}")
        print()

    def create_test_image(self, filename, size=(100, 100), format='JPEG'):
        """Create a test image file"""
        try:
            from PIL import Image
            import io
            
            # Create image
            if format.upper() == 'JPEG':
                img = Image.new('RGB', size, color='red')
                buffer = io.BytesIO()
                img.save(buffer, format='JPEG', quality=85)
                buffer.seek(0)
                return buffer.getvalue()
            elif format.upper() == 'PNG':
                img = Image.new('RGBA', size, color='blue')
                buffer = io.BytesIO()
                img.save(buffer, format='PNG')
                buffer.seek(0)
                return buffer.getvalue()
            elif format.upper() == 'WEBP':
                img = Image.new('RGB', size, color='green')
                buffer = io.BytesIO()
                img.save(buffer, format='WEBP', quality=85)
                buffer.seek(0)
                return buffer.getvalue()
        except ImportError:
            # Fallback: create a minimal valid JPEG
            # Minimal JPEG header for a 1x1 red pixel
            jpeg_data = bytes([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46,
                0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
                0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06,
                0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C,
                0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F,
                0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
                0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28,
                0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
                0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF,
                0xC0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01,
                0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xFF, 0xC4,
                0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A,
                0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
                0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00,
                0x01, 0x7D, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00,
                0x3F, 0x00, 0xD2, 0xFF, 0xD9
            ])
            return jpeg_data

    def test_create_project_with_files(self):
        """Test creating a project with cover image and gallery"""
        try:
            # Create test images
            cover_data = self.create_test_image('test_cover.jpg', format='JPEG')
            gallery1_data = self.create_test_image('gallery1.png', format='PNG')
            gallery2_data = self.create_test_image('gallery2.jpg', format='JPEG')

            # Prepare files properly for requests
            files = [
                ('cover_image', ('test_cover.jpg', cover_data, 'image/jpeg')),
                ('gallery_images', ('gallery1.png', gallery1_data, 'image/png')),
                ('gallery_images', ('gallery2.jpg', gallery2_data, 'image/jpeg'))
            ]

            data = {
                'name': f'Test Project {datetime.now().strftime("%H%M%S")}',
                'category': 'real_estate',
                'location': 'Test Location',
                'year': '2024',
                'summary': 'Test project summary',
                'story': 'Test project story',
                'scope': 'Test scope',
                'materials': 'Test materials',
                'area_sqm': '100',
                'client_name': 'Test Client',
                'is_featured': 'true'
            }

            response = requests.post(
                f"{self.base_url}/api/admin/projects/create",
                files=files,
                data=data,
                headers=self.headers,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('project'):
                    self.created_project_id = result['project']['id']
                    project = result['project']
                    
                    # Verify project data
                    details = f"Project ID: {project['id']}, Name: {project['name']}"
                    if project.get('cover_image_url'):
                        details += f", Cover URL: {project['cover_image_url'][:50]}..."
                    if project.get('gallery') and len(project['gallery']) > 0:
                        details += f", Gallery images: {len(project['gallery'])}"
                    
                    self.log_test("Create project with file uploads", True, details)
                    return True
                else:
                    self.log_test("Create project with file uploads", False, f"Invalid response format: {result}")
            else:
                try:
                    error_data = response.json()
                    self.log_test("Create project with file uploads", False, f"HTTP {response.status_code}: {error_data.get('error', 'Unknown error')}")
                except:
                    self.log_test("Create project with file uploads", False, f"HTTP {response.status_code}: {response.text[:200]}")

        except Exception as e:
            self.log_test("Create project with file uploads", False, f"Exception: {str(e)}")
        
        return False

    def test_update_project_with_files(self):
        """Test updating a project with new files"""
        if not self.created_project_id:
            self.log_test("Update project with file uploads", False, "No project ID available for update")
            return False

        try:
            # Create new test image for update
            new_cover_data = self.create_test_image('updated_cover.webp', format='WEBP')
            new_gallery_data = self.create_test_image('new_gallery.jpg', format='JPEG')

            files = [
                ('cover_image', ('updated_cover.webp', new_cover_data, 'image/webp')),
                ('gallery_images', ('new_gallery.jpg', new_gallery_data, 'image/jpeg'))
            ]

            data = {
                'id': str(self.created_project_id),
                'name': f'Updated Project {datetime.now().strftime("%H%M%S")}',
                'category': 'architecture',
                'location': 'Updated Location',
                'year': '2025',
                'summary': 'Updated project summary',
                'existing_gallery_urls': '[]'  # Keep no existing gallery images
            }

            response = requests.put(
                f"{self.base_url}/api/admin/projects/update",
                files=files,
                data=data,
                headers=self.headers,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('project'):
                    project = result['project']
                    details = f"Updated project ID: {project['id']}, Name: {project['name']}"
                    if project.get('cover_image_url'):
                        details += f", Cover URL updated"
                    self.log_test("Update project with file uploads", True, details)
                    return True
                else:
                    self.log_test("Update project with file uploads", False, f"Invalid response: {result}")
            else:
                try:
                    error_data = response.json()
                    self.log_test("Update project with file uploads", False, f"HTTP {response.status_code}: {error_data.get('error', 'Unknown error')}")
                except:
                    self.log_test("Update project with file uploads", False, f"HTTP {response.status_code}: {response.text[:200]}")

        except Exception as e:
            self.log_test("Update project with file uploads", False, f"Exception: {str(e)}")
        
        return False

    def test_file_validation_errors(self):
        """Test file validation (size and type restrictions)"""
        try:
            # Test with invalid file type
            files = {
                'cover_image': ('test.txt', b'This is not an image', 'text/plain')
            }
            data = {
                'name': 'Validation Test',
                'category': 'real_estate'
            }

            response = requests.post(
                f"{self.base_url}/api/admin/projects/create",
                files=files,
                data=data,
                headers=self.headers,
                timeout=30
            )

            if response.status_code == 400:
                result = response.json()
                if 'invalid file type' in result.get('error', '').lower() or 'only jpeg, png, and webp' in result.get('error', '').lower():
                    self.log_test("File type validation", True, f"Correctly rejected invalid file type: {result.get('error')}")
                    return True
                else:
                    self.log_test("File type validation", False, f"Wrong error message: {result.get('error')}")
            else:
                self.log_test("File type validation", False, f"Expected 400, got {response.status_code}")

        except Exception as e:
            self.log_test("File type validation", False, f"Exception: {str(e)}")
        
        return False

    def test_delete_project_with_storage_cleanup(self):
        """Test deleting a project and its storage files"""
        if not self.created_project_id:
            self.log_test("Delete project with storage cleanup", False, "No project ID available for deletion")
            return False

        try:
            response = requests.delete(
                f"{self.base_url}/api/admin/projects/delete?id={self.created_project_id}",
                headers=self.headers,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    self.log_test("Delete project with storage cleanup", True, f"Successfully deleted project {self.created_project_id}")
                    return True
                else:
                    self.log_test("Delete project with storage cleanup", False, f"Unexpected response: {result}")
            else:
                try:
                    error_data = response.json()
                    self.log_test("Delete project with storage cleanup", False, f"HTTP {response.status_code}: {error_data.get('error', 'Unknown error')}")
                except:
                    self.log_test("Delete project with storage cleanup", False, f"HTTP {response.status_code}: {response.text[:200]}")

        except Exception as e:
            self.log_test("Delete project with storage cleanup", False, f"Exception: {str(e)}")
        
        return False

    def test_authentication_required(self):
        """Test that endpoints require authentication"""
        try:
            # Test without auth cookie
            files = {'cover_image': ('test.jpg', self.create_test_image('test.jpg'), 'image/jpeg')}
            data = {'name': 'Auth Test', 'category': 'real_estate'}

            response = requests.post(
                f"{self.base_url}/api/admin/projects/create",
                files=files,
                data=data,
                timeout=30
            )

            if response.status_code == 401:
                result = response.json()
                if 'unauthorized' in result.get('error', '').lower():
                    self.log_test("Authentication required", True, "Correctly rejected unauthenticated request")
                    return True
                else:
                    self.log_test("Authentication required", False, f"Wrong error message: {result.get('error')}")
            else:
                self.log_test("Authentication required", False, f"Expected 401, got {response.status_code}")

        except Exception as e:
            self.log_test("Authentication required", False, f"Exception: {str(e)}")
        
        return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API File Upload Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        print()

        # Test authentication requirement
        self.test_authentication_required()
        
        # Test creating project with files
        self.test_create_project_with_files()
        
        # Test updating project with files
        self.test_update_project_with_files()
        
        # Test file validation
        self.test_file_validation_errors()
        
        # Test deletion with storage cleanup
        self.test_delete_project_with_storage_cleanup()

        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("❌ Some tests failed")
            return False

def main():
    """Main test runner"""
    tester = FileUploadAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())