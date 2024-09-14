import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { registerUser } from 'src/redux/api/api'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
  const [preview, setPreview] = useState('')
  const navigate = useNavigate()
  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset, // Added reset to reset the form after submission
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    if (data.password !== data.Repeatpassword) {
      setError('Repeatpassword', { type: 'manual', message: 'Passwords do not match' })
      return
    }

    let formData = new FormData()
    Object.keys(data).forEach(function (key) {
      if (key === 'image') {
        if (data[key][0] !== undefined) {
          formData.append(key, data[key][0])
        }
      } else {
        formData.append(key, data[key])
      }
    })

    try {
      const res = await registerUser(formData)
      if (res.status === 400) {
        toast.error(res.data.message || 'Registration failed')
      } else {
        toast.success('Account created successfully')
        navigate('/')
        reset() // Reset form fields after successful submission
        setPreview('') // Clear the image preview
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Something went wrong'
      toast.error(errorMsg)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      // Validate file size (example: 5MB max size)
      if (selectedFile.size > 5000000) {
        setError('image', { type: 'manual', message: 'File size too large (Max 5MB)' })
        toast.error('Image is Large')
        return
      }

      // Validate file type (should be an image)
      if (!selectedFile.type.startsWith('image/')) {
        setError('image', { type: 'manual', message: 'Invalid file type' })
        return
      }

      const imageUrl = URL.createObjectURL(selectedFile)
      setPreview(imageUrl)
      clearErrors('image')
    } else {
      setPreview('')
      setError('image', { type: 'manual', message: 'Image is required' })
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      {...register('name', { required: 'Username is required' })}
                      invalid={!!errors.name}
                    />
                    <CFormFeedback invalid>{errors.name?.message}</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Invalid email address',
                        },
                      })}
                      invalid={!!errors.email}
                    />
                    <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register('password', {
                        required: 'Password is required',
                      })}
                      invalid={!!errors.password}
                    />
                    <CFormFeedback invalid>{errors.password?.message}</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      {...register('Repeatpassword', { required: 'Confirm Password is required' })}
                      invalid={!!errors.Repeatpassword}
                    />
                    <CFormFeedback invalid>{errors.Repeatpassword?.message}</CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>📷</CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      {...register('image')}
                      onChange={handleFileChange}
                    />
                    {errors.image && <CFormFeedback invalid>{errors.image.message}</CFormFeedback>}
                  </CInputGroup>

                  {preview && (
                    <div className="mb-4 text-center">
                      <img
                        src={preview}
                        alt="Profile Preview"
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                  )}

                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
