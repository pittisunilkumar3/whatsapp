import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import axios from 'axios';

interface FormData {
  employee_id: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  department: string;
  role: string;
  designation: string;
  joining_date: string;
  reporting_to: string;
  work_location: string;
  employment_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  bank_branch: string;
  tax_id: string;
  social_security_number: string;
  education: string;
  certifications: string;
  skills: string;
  photo_url: string;
  status: 'active' | 'inactive';
}

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  [key: string]: string | undefined;
}

export default function StaffRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    employee_id: '',
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    department: '',
    role: '',
    designation: '',
    joining_date: '',
    reporting_to: '',
    work_location: '',
    employment_type: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_name: '',
    bank_branch: '',
    tax_id: '',
    social_security_number: '',
    education: '',
    certifications: '',
    skills: '',
    photo_url: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileSelected = (file: File) => {
    setFormData(prev => ({ ...prev, photo_url: file.name }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          username: formData.username,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          role: formData.role,
          status: formData.status,
          // Add other fields as needed
        };

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/staff`, payload);
        if (response.status === 200 || response.status === 201) {
          alert('Staff member created successfully!');
          // Reset form
          setFormData({
            employee_id: '',
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            mobile: '',
            department: '',
            role: '',
            designation: '',
            joining_date: '',
            reporting_to: '',
            work_location: '',
            employment_type: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            bank_account_name: '',
            bank_account_number: '',
            bank_name: '',
            bank_branch: '',
            tax_id: '',
            social_security_number: '',
            education: '',
            certifications: '',
            skills: '',
            photo_url: '',
            status: 'active'
          });
        }
      } catch (error: any) {
        console.error('Error creating staff member:', error);
        alert(error.response?.data?.message || 'Error creating staff member. Please try again.');
      }
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Staff Registration Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Information */}
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter first name"
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter last name"
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter username"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter department"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter role"
              />
            </div>

            <div>
              <Label htmlFor="photo_url">Profile Photo</Label>
              <FileUpload
                onFileSelected={handleFileSelected}
                className="mt-1"
              />
              {formData.photo_url && <p className="text-gray-500 text-sm mt-1">Selected file: {formData.photo_url}</p>}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
            className="w-full mt-4"
          >
            {showAdditionalDetails ? 'Hide Additional Details' : 'Show Additional Details'}
          </Button>

          {showAdditionalDetails && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter designation"
                  />
                </div>

                <div>
                  <Label htmlFor="joining_date">Joining Date</Label>
                  <Input
                    id="joining_date"
                    name="joining_date"
                    type="date"
                    value={formData.joining_date}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reporting_to">Reporting To</Label>
                  <Input
                    id="reporting_to"
                    name="reporting_to"
                    value={formData.reporting_to}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter reporting manager"
                  />
                </div>

                <div>
                  <Label htmlFor="work_location">Work Location</Label>
                  <Input
                    id="work_location"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter work location"
                  />
                </div>

                <div>
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Input
                    id="employment_type"
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter employment type"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                <div>
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <Label htmlFor="bank_account_name">Bank Account Name</Label>
                  <Input
                    id="bank_account_name"
                    name="bank_account_name"
                    value={formData.bank_account_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter bank account name"
                  />
                </div>

                <div>
                  <Label htmlFor="bank_account_number">Bank Account Number</Label>
                  <Input
                    id="bank_account_number"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter bank account number"
                  />
                </div>

                <div>
                  <Label htmlFor="bank_branch">Bank Branch</Label>
                  <Input
                    id="bank_branch"
                    name="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter bank branch"
                  />
                </div>

                <div>
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter tax ID"
                  />
                </div>

                <div>
                  <Label htmlFor="social_security_number">Social Security Number</Label>
                  <Input
                    id="social_security_number"
                    name="social_security_number"
                    value={formData.social_security_number}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter social security number"
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter education details"
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter certifications"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter skills"
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { StaffRegistrationForm as AddStaff }; 