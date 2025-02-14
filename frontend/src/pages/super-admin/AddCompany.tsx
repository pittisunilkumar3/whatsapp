import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select } from "../../components/ui/Select"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { format } from 'date-fns'
import { CalendarIcon } from "lucide-react"

const FileUpload = ({ onFileSelected, className }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button variant="outline">
          Upload Logo
        </Button>
      </label>
    </div>
  )
}

export default function CompanyRegistrationForm() {
  const [formData, setFormData] = useState({
    company_name: '',
    trading_name: '',
    registration_number: '',
    tax_number: '',
    industry: '',
    founded_date: '',
    company_type: '',
    email: '',
    phone: '',
    fax: '',
    website: '',
    social_media_linkedin: '',
    social_media_twitter: '',
    social_media_facebook: '',
    street_address: '',
    building_name: '',
    floor_number: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    mailing_address: '',
    mailing_city: '',
    mailing_state: '',
    mailing_country: '',
    mailing_postal_code: '',
    contact_person_name: '',
    contact_person_position: '',
    contact_person_email: '',
    contact_person_phone: '',
    contact_person_mobile: '',
    secondary_contact_name: '',
    secondary_contact_position: '',
    secondary_contact_email: '',
    secondary_contact_phone: '',
    employee_count: '',
    annual_revenue: '',
    company_description: '',
    business_hours: '',
    year_end_date: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_swift_code: '',
    logo_url: '',
    parent_company_name: '',
    subsidiary_companies: '',
    operation_countries: '',
    languages_spoken: '',
    certifications: '',
    licenses: '',
    status: '',
    listing_status: '',
    credit_rating: '',
    compliance_status: '',
    last_audit_date: '',
    license_renewal_date: '',
    insurance_renewal_date: '',
    insurance_provider: '',
    insurance_policy_number: '',
    insurance_expiry_date: '',
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
    is_verified: false,
    verification_date: '',
    two_factor_enabled: false,
    two_factor_secret: '',
    backup_codes: '',
  })

  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date ? format(date, 'yyyy-MM-dd') : '',
    })
  }

  const handleFileSelected = (file) => {
    setFormData({
      ...formData,
      logo_url: file.name,
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.company_name) newErrors.company_name = 'Company name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      alert('Form submitted successfully!')
      console.log(formData)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Company Registration Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter company name"
              />
              {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
            </div>
            <div>
              <Label htmlFor="trading_name">Trading Name</Label>
              <Input
                id="trading_name"
                name="trading_name"
                value={formData.trading_name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter trading name"
              />
            </div>
            <div>
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter registration number"
              />
            </div>
            <div>
              <Label htmlFor="tax_number">Tax Number</Label>
              <Input
                id="tax_number"
                name="tax_number"
                value={formData.tax_number}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter tax number"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter industry"
              />
            </div>
            <div>
              <Label htmlFor="founded_date">Founded Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    {formData.founded_date ? format(new Date(formData.founded_date), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.founded_date ? new Date(formData.founded_date) : undefined}
                    onSelect={(date) => handleDateChange('founded_date', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="company_type">Company Type</Label>
              <Select
                className="w-full"
                value={formData.company_type}
                onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
              >
                <option value="">Select company type</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="non-profit">Non-Profit</option>
              </Select>
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
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter fax number"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter website URL"
              />
            </div>
            <div>
              <Label htmlFor="social_media_linkedin">LinkedIn</Label>
              <Input
                id="social_media_linkedin"
                name="social_media_linkedin"
                value={formData.social_media_linkedin}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter LinkedIn URL"
              />
            </div>
            <div>
              <Label htmlFor="social_media_twitter">Twitter</Label>
              <Input
                id="social_media_twitter"
                name="social_media_twitter"
                value={formData.social_media_twitter}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter Twitter URL"
              />
            </div>
            <div>
              <Label htmlFor="social_media_facebook">Facebook</Label>
              <Input
                id="social_media_facebook"
                name="social_media_facebook"
                value={formData.social_media_facebook}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter Facebook URL"
              />
            </div>
            <div>
              <Label htmlFor="logo_url">Logo Upload</Label>
              <FileUpload
                onFileSelected={handleFileSelected}
                className="mt-1"
              />
              {formData.logo_url && <p className="text-gray-500 text-sm mt-1">Selected file: {formData.logo_url}</p>}
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
            className="w-full mt-4"
          >
            {showAdditionalDetails ? 'Hide Additional Details' : 'Show Additional Details'}
          </Button>

          {showAdditionalDetails && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street_address">Street Address</Label>
                  <Input
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <Label htmlFor="building_name">Building Name</Label>
                  <Input
                    id="building_name"
                    name="building_name"
                    value={formData.building_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter building name"
                  />
                </div>
                <div>
                  <Label htmlFor="floor_number">Floor Number</Label>
                  <Input
                    id="floor_number"
                    name="floor_number"
                    value={formData.floor_number}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter floor number"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter postal code"
                  />
                </div>
                <div>
                  <Label htmlFor="mailing_address">Mailing Address</Label>
                  <Input
                    id="mailing_address"
                    name="mailing_address"
                    value={formData.mailing_address}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter mailing address"
                  />
                </div>
                <div>
                  <Label htmlFor="mailing_city">Mailing City</Label>
                  <Input
                    id="mailing_city"
                    name="mailing_city"
                    value={formData.mailing_city}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter mailing city"
                  />
                </div>
                <div>
                  <Label htmlFor="mailing_state">Mailing State</Label>
                  <Input
                    id="mailing_state"
                    name="mailing_state"
                    value={formData.mailing_state}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter mailing state"
                  />
                </div>
                <div>
                  <Label htmlFor="mailing_country">Mailing Country</Label>
                  <Input
                    id="mailing_country"
                    name="mailing_country"
                    value={formData.mailing_country}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter mailing country"
                  />
                </div>
                <div>
                  <Label htmlFor="mailing_postal_code">Mailing Postal Code</Label>
                  <Input
                    id="mailing_postal_code"
                    name="mailing_postal_code"
                    value={formData.mailing_postal_code}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter mailing postal code"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_name">Contact Person Name</Label>
                  <Input
                    id="contact_person_name"
                    name="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter contact person name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_position">Contact Person Position</Label>
                  <Input
                    id="contact_person_position"
                    name="contact_person_position"
                    value={formData.contact_person_position}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter contact person position"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_email">Contact Person Email</Label>
                  <Input
                    id="contact_person_email"
                    name="contact_person_email"
                    value={formData.contact_person_email}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter contact person email"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_phone">Contact Person Phone</Label>
                  <Input
                    id="contact_person_phone"
                    name="contact_person_phone"
                    value={formData.contact_person_phone}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter contact person phone"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_mobile">Contact Person Mobile</Label>
                  <Input
                    id="contact_person_mobile"
                    name="contact_person_mobile"
                    value={formData.contact_person_mobile}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter contact person mobile"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_contact_name">Secondary Contact Name</Label>
                  <Input
                    id="secondary_contact_name"
                    name="secondary_contact_name"
                    value={formData.secondary_contact_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter secondary contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_contact_position">Secondary Contact Position</Label>
                  <Input
                    id="secondary_contact_position"
                    name="secondary_contact_position"
                    value={formData.secondary_contact_position}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter secondary contact position"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_contact_email">Secondary Contact Email</Label>
                  <Input
                    id="secondary_contact_email"
                    name="secondary_contact_email"
                    value={formData.secondary_contact_email}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter secondary contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_contact_phone">Secondary Contact Phone</Label>
                  <Input
                    id="secondary_contact_phone"
                    name="secondary_contact_phone"
                    value={formData.secondary_contact_phone}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter secondary contact phone"
                  />
                </div>
                <div>
                  <Label htmlFor="employee_count">Employee Count</Label>
                  <Input
                    id="employee_count"
                    name="employee_count"
                    value={formData.employee_count}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter employee count"
                  />
                </div>
                <div>
                  <Label htmlFor="annual_revenue">Annual Revenue</Label>
                  <Input
                    id="annual_revenue"
                    name="annual_revenue"
                    value={formData.annual_revenue}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter annual revenue"
                  />
                </div>
                <div>
                  <Label htmlFor="company_description">Company Description</Label>
                  <Textarea
                    id="company_description"
                    name="company_description"
                    value={formData.company_description}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter company description"
                  />
                </div>
                <div>
                  <Label htmlFor="business_hours">Business Hours</Label>
                  <Input
                    id="business_hours"
                    name="business_hours"
                    value={formData.business_hours}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter business hours"
                  />
                </div>
                <div>
                  <Label htmlFor="year_end_date">Year End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.year_end_date ? format(new Date(formData.year_end_date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.year_end_date ? new Date(formData.year_end_date) : undefined}
                        onSelect={(date) => handleDateChange('year_end_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Label htmlFor="bank_swift_code">Bank Swift Code</Label>
                  <Input
                    id="bank_swift_code"
                    name="bank_swift_code"
                    value={formData.bank_swift_code}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter bank swift code"
                  />
                </div>
                <div>
                  <Label htmlFor="parent_company_name">Parent Company Name</Label>
                  <Input
                    id="parent_company_name"
                    name="parent_company_name"
                    value={formData.parent_company_name}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter parent company name"
                  />
                </div>
                <div>
                  <Label htmlFor="subsidiary_companies">Subsidiary Companies</Label>
                  <Input
                    id="subsidiary_companies"
                    name="subsidiary_companies"
                    value={formData.subsidiary_companies}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter subsidiary companies"
                  />
                </div>
                <div>
                  <Label htmlFor="operation_countries">Operation Countries</Label>
                  <Input
                    id="operation_countries"
                    name="operation_countries"
                    value={formData.operation_countries}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter operation countries"
                  />
                </div>
                <div>
                  <Label htmlFor="languages_spoken">Languages Spoken</Label>
                  <Input
                    id="languages_spoken"
                    name="languages_spoken"
                    value={formData.languages_spoken}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter languages spoken"
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
                  <Label htmlFor="licenses">Licenses</Label>
                  <Input
                    id="licenses"
                    name="licenses"
                    value={formData.licenses}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter licenses"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter status"
                  />
                </div>
                <div>
                  <Label htmlFor="listing_status">Listing Status</Label>
                  <Input
                    id="listing_status"
                    name="listing_status"
                    value={formData.listing_status}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter listing status"
                  />
                </div>
                <div>
                  <Label htmlFor="credit_rating">Credit Rating</Label>
                  <Input
                    id="credit_rating"
                    name="credit_rating"
                    value={formData.credit_rating}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter credit rating"
                  />
                </div>
                <div>
                  <Label htmlFor="compliance_status">Compliance Status</Label>
                  <Input
                    id="compliance_status"
                    name="compliance_status"
                    value={formData.compliance_status}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter compliance status"
                  />
                </div>
                <div>
                  <Label htmlFor="last_audit_date">Last Audit Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.last_audit_date ? format(new Date(formData.last_audit_date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.last_audit_date ? new Date(formData.last_audit_date) : undefined}
                        onSelect={(date) => handleDateChange('last_audit_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="license_renewal_date">License Renewal Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.license_renewal_date ? format(new Date(formData.license_renewal_date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.license_renewal_date ? new Date(formData.license_renewal_date) : undefined}
                        onSelect={(date) => handleDateChange('license_renewal_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="insurance_renewal_date">Insurance Renewal Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.insurance_renewal_date ? format(new Date(formData.insurance_renewal_date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.insurance_renewal_date ? new Date(formData.insurance_renewal_date) : undefined}
                        onSelect={(date) => handleDateChange('insurance_renewal_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="insurance_provider">Insurance Provider</Label>
                  <Input
                    id="insurance_provider"
                    name="insurance_provider"
                    value={formData.insurance_provider}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter insurance provider"
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_policy_number">Insurance Policy Number</Label>
                  <Input
                    id="insurance_policy_number"
                    name="insurance_policy_number"
                    value={formData.insurance_policy_number}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter insurance policy number"
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_expiry_date">Insurance Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.insurance_expiry_date ? format(new Date(formData.insurance_expiry_date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.insurance_expiry_date ? new Date(formData.insurance_expiry_date) : undefined}
                        onSelect={(date) => handleDateChange('insurance_expiry_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="is_verified">Is Verified</Label>
                  <Input
                    id="is_verified"
                    name="is_verified"
                    type="checkbox"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="two_factor_enabled">Two Factor Enabled</Label>
                  <Input
                    id="two_factor_enabled"
                    name="two_factor_enabled"
                    type="checkbox"
                    checked={formData.two_factor_enabled}
                    onChange={(e) => setFormData({ ...formData, two_factor_enabled: e.target.checked })}
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
  )
}
export { CompanyRegistrationForm as AddCompany }