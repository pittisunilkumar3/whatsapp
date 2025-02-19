import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface CompanyRole {
  id: number;
  company_id: number;
  name: string;
  slug: string;
  is_active: number;
  is_system: number;
  is_superadmin: number;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  employee_id: string;
  lang_id: number;
  currency_id: number;
  department: number | null;
  designation: number | null;
  qualification: string;
  work_exp: string;
  name: string;
  surname: string;
  father_name: string;
  mother_name: string;
  contact_no: string;
  emergency_contact_no: string;
  email: string;
  dob: string;
  marital_status: string;
  date_of_joining: string | null;
  date_of_leaving: string | null;
  local_address: string;
  permanent_address: string;
  note: string;
  image: string;
  password: string;
  gender: string;
  account_title: string;
  bank_account_no: string;
  bank_name: string;
  ifsc_code: string;
  bank_branch: string;
  payscale: string;
  basic_salary: number | null;
  epf_no: string;
  contract_type: string;
  shift: string;
  location: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  resume: string;
  joining_letter: string;
  resignation_letter: string;
  other_document_name: string;
  other_document_file: string;
  user_id: number;
  is_active: number;
  verification_code: string;
  zoom_api_key: string | null;
  zoom_api_secret: string | null;
  role_id: string;
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

export default function EmployeeRegistrationForm() {
  const { user } = useAuthStore();
  const companyId = user?.company?.id;
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    employee_id: '',
    lang_id: 1,
    currency_id: 0,
    department: null,
    designation: null,
    qualification: '',
    work_exp: '',
    name: '',
    surname: '',
    father_name: '',
    mother_name: '',
    contact_no: '',
    emergency_contact_no: '',
    email: '',
    dob: '',
    marital_status: 'Single',
    date_of_joining: null,
    date_of_leaving: null,
    local_address: '',
    permanent_address: '',
    note: '',
    image: '',
    password: '',
    gender: 'Male',
    account_title: '',
    bank_account_no: '',
    bank_name: '',
    ifsc_code: '',
    bank_branch: '',
    payscale: '',
    basic_salary: null,
    epf_no: '',
    contract_type: 'Full-time',
    shift: 'Day',
    location: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    resume: '',
    joining_letter: '',
    resignation_letter: '',
    other_document_name: '',
    other_document_file: '',
    user_id: 1,
    is_active: 1,
    verification_code: '',
    zoom_api_key: null,
    zoom_api_secret: null,
    role_id: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  // Fetch company roles
  useEffect(() => {
    const fetchRoles = async () => {
      if (!companyId) return;
      
      setIsLoadingRoles(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/company-roles?company_id=${companyId}`);
        if (response.data.success) {
          setRoles(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileSelected = (file: File) => {
    setFormData(prev => ({ ...prev, image: file.name }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Only validate mandatory fields based on the schema
    if (!formData.employee_id) newErrors.employee_id = 'Employee ID is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.surname) newErrors.surname = 'Surname is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.contact_no) newErrors.contact_no = 'Contact number is required';
    if (!formData.emergency_contact_no) newErrors.emergency_contact_no = 'Emergency contact is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.work_exp) newErrors.work_exp = 'Work experience is required';
    if (!formData.local_address) newErrors.local_address = 'Local address is required';
    if (!formData.permanent_address) newErrors.permanent_address = 'Permanent address is required';
    if (!formData.role_id) newErrors.role_id = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Company ID:', companyId);

    if (validateForm()) {
      console.log('Form validation passed');
      try {
        // Create employee payload (excluding role_id)
        const { role_id, ...employeeData } = formData;
        const employeePayload = {
          company_id: companyId,
          ...employeeData,
          // Convert string dates to proper format
          dob: new Date(formData.dob).toISOString().split('T')[0],
          date_of_joining: formData.date_of_joining ? new Date(formData.date_of_joining).toISOString().split('T')[0] : null,
          date_of_leaving: null,
          // Ensure numeric fields are properly typed
          basic_salary: formData.basic_salary ? Number(formData.basic_salary) : null,
          department: formData.department ? Number(formData.department) : null,
          designation: formData.designation ? Number(formData.designation) : null,
          lang_id: Number(formData.lang_id),
          currency_id: Number(formData.currency_id),
          user_id: Number(formData.user_id),
          is_active: 1
        };

        console.log('=== Employee Creation ===');
        console.log('Employee payload:', employeePayload);
        
        const response = await apiService.createEmployee(employeePayload);
        console.log('Employee creation API response:', response);
        
        // Check if employee creation was successful and we have an ID
        if (response.data && response.data.id) {
          const employeeId = response.data.id;
          console.log('=== Employee Created Successfully ===');
          console.log('Employee ID:', employeeId);
          toast.success('Employee created successfully!');
          
          // Prepare role assignment payload using the employee ID from response
          const roleAssignmentPayload = {
            company_id: companyId,
            role_id: Number(role_id),
            company_employee_id: employeeId,
            is_active: 1
          };

          console.log('=== Role Assignment ===');
          console.log('Role assignment payload:', roleAssignmentPayload);
          
          try {
            // Make the role assignment API call
            const roleResponse = await apiService.assignRoleToEmployee(roleAssignmentPayload);
            console.log('Role assignment API response:', roleResponse);

            if (roleResponse.success) {
              console.log('=== Role Assignment Successful ===');
              console.log('Role assignment data:', roleResponse.data);
              toast.success('Role assigned successfully!');
              
              // Show final success message
              setTimeout(() => {
                toast.success('Employee registration completed successfully!');
              }, 500);

              // Reset form after successful creation and role assignment
              setFormData({
                employee_id: '',
                lang_id: 1,
                currency_id: 0,
                department: null,
                designation: null,
                qualification: '',
                work_exp: '',
                name: '',
                surname: '',
                father_name: '',
                mother_name: '',
                contact_no: '',
                emergency_contact_no: '',
                email: '',
                dob: '',
                marital_status: 'Single',
                date_of_joining: null,
                date_of_leaving: null,
                local_address: '',
                permanent_address: '',
                note: '',
                image: '',
                password: '',
                gender: 'Male',
                account_title: '',
                bank_account_no: '',
                bank_name: '',
                ifsc_code: '',
                bank_branch: '',
                payscale: '',
                basic_salary: null,
                epf_no: '',
                contract_type: 'Full-time',
                shift: 'Day',
                location: '',
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: '',
                resume: '',
                joining_letter: '',
                resignation_letter: '',
                other_document_name: '',
                other_document_file: '',
                user_id: 1,
                is_active: 1,
                verification_code: '',
                zoom_api_key: null,
                zoom_api_secret: null,
                role_id: ''
              });
              
              console.log('Form reset complete');
            } else {
              console.error('=== Role Assignment Failed ===');
              console.error('Role assignment error:', roleResponse);
              toast.error('Failed to assign role to employee. Please try again.');
            }
          } catch (roleError) {
            console.error('=== Role Assignment Error ===');
            console.error('Role assignment error details:', roleError);
            toast.error('Error occurred while assigning role. Please try again.');
          }
        } else {
          console.error('=== Employee Creation Failed ===');
          console.error('Employee creation error:', response);
          toast.error('Failed to create employee. Please try again.');
        }
      } catch (error: any) {
        console.error('=== Error in Employee Creation Process ===');
        console.error('Error details:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error message:', error.message);
        toast.error(error.response?.data?.message || 'An error occurred while creating employee. Please try again.');
      }
    } else {
      console.log('Form validation failed');
      console.log('Validation errors:', errors);
      toast.error('Please fill in all required fields.');
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employee Registration Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Required Basic Information */}
            <div>
              <Label htmlFor="employee_id">Employee ID *</Label>
              <Input
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter employee ID"
                required
              />
            </div>

            <div>
              <Label htmlFor="name">First Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <Label htmlFor="surname">Last Name *</Label>
              <Input
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter last name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact_no">Contact Number *</Label>
              <Input
                id="contact_no"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter contact number"
                required
              />
            </div>

            <div>
              <Label htmlFor="emergency_contact_no">Emergency Contact *</Label>
              <Input
                id="emergency_contact_no"
                name="emergency_contact_no"
                value={formData.emergency_contact_no}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter emergency contact"
                required
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <select
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="qualification">Qualification *</Label>
              <Input
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter qualification"
                required
              />
            </div>

            <div>
              <Label htmlFor="work_exp">Work Experience *</Label>
              <Input
                id="work_exp"
                name="work_exp"
                value={formData.work_exp}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter work experience"
                required
              />
            </div>

            <div>
              <Label htmlFor="local_address">Local Address *</Label>
              <Input
                id="local_address"
                name="local_address"
                value={formData.local_address}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter local address"
                required
              />
            </div>

            <div>
              <Label htmlFor="permanent_address">Permanent Address *</Label>
              <Input
                id="permanent_address"
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter permanent address"
                required
              />
            </div>

            <div>
              <Label htmlFor="role_id">Role *</Label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                disabled={isLoadingRoles}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
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
                {/* Bank Details */}
                <div>
                  <Label htmlFor="account_title">Account Title</Label>
                  <Input
                    id="account_title"
                    name="account_title"
                    value={formData.account_title}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter account title"
                  />
                </div>

                <div>
                  <Label htmlFor="bank_account_no">Bank Account Number</Label>
                  <Input
                    id="bank_account_no"
                    name="bank_account_no"
                    value={formData.bank_account_no}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter bank account number"
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
                  <Label htmlFor="ifsc_code">IFSC Code</Label>
                  <Input
                    id="ifsc_code"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter IFSC code"
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

                {/* Employment Details */}
                <div>
                  <Label htmlFor="epf_no">EPF Number</Label>
                  <Input
                    id="epf_no"
                    name="epf_no"
                    value={formData.epf_no}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter EPF number"
                  />
                </div>

                <div>
                  <Label htmlFor="contract_type">Contract Type</Label>
                  <Input
                    id="contract_type"
                    name="contract_type"
                    value={formData.contract_type}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter contract type"
                  />
                </div>

                <div>
                  <Label htmlFor="shift">Shift</Label>
                  <Input
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter shift"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter location"
                  />
                </div>

                {/* Social Media */}
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter Facebook profile"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter Twitter profile"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter LinkedIn profile"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter Instagram profile"
                  />
                </div>

                {/* Optional Fields */}
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    type="number"
                    value={formData.department || ''}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter department ID"
                  />
                </div>

                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    type="number"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter designation ID"
                  />
                </div>

                <div>
                  <Label htmlFor="basic_salary">Basic Salary</Label>
                  <Input
                    id="basic_salary"
                    name="basic_salary"
                    type="number"
                    value={formData.basic_salary || ''}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter basic salary"
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_joining">Date of Joining</Label>
                  <Input
                    id="date_of_joining"
                    name="date_of_joining"
                    type="date"
                    value={formData.date_of_joining || ''}
                    onChange={handleChange}
                    className="mt-1"
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

export { EmployeeRegistrationForm as AddEmployee }; 